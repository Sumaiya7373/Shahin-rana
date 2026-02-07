const axios = require('axios');
const yts = require('yt-search');
const fs = require('fs');
const path = require('path');
const { toAudio } = require('../lib/converter');

const AXIOS_DEFAULTS = {
	timeout: 60000,
	headers: {
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
		'Accept': 'application/json, text/plain, */*'
	}
};

async function tryRequest(getter, attempts = 3) {
	let lastError;
	for (let i = 0; i < attempts; i++) {
		try {
			return await getter();
		} catch (err) {
			lastError = err;
			await new Promise(r => setTimeout(r, 1000 * (i + 1)));
		}
	}
	throw lastError;
}

async function getYupraDownloadByUrl(url) {
	const apiUrl = `https://api.yupra.my.id/api/downloader/ytmp3?url=${encodeURIComponent(url)}`;
	const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
	if (res?.data?.success && res?.data?.data?.download_url) {
		return {
			download: res.data.data.download_url,
			title: res.data.data.title,
			thumbnail: res.data.data.thumbnail
		};
	}
	throw new Error('Yupra returned no download');
}

async function getOkatsuDownloadByUrl(url) {
	const apiUrl = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp3?url=${encodeURIComponent(url)}`;
	const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
	if (res?.data?.dl) {
		return {
			download: res.data.dl,
			title: res.data.title,
			thumbnail: res.data.thumb
		};
	}
	throw new Error('Okatsu returned no download');
}

async function songCommand(sock, chatId, message) {
	try {
		const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
		if (!text) {
			await sock.sendMessage(chatId, { text: 'Usage: .song <song name or YouTube link>' }, { quoted: message });
			return;
		}

		// YouTube link or search
		let video;
		if (text.includes('youtube.com') || text.includes('youtu.be')) {
			video = { url: text };
		} else {
			const search = await yts(text);
			if (!search || !search.videos.length) {
				await sock.sendMessage(chatId, { text: 'No results found.' }, { quoted: message });
				return;
			}
			video = search.videos[0];
		}

		// Send thumbnail first
		if (video.thumbnail) {
			await sock.sendMessage(chatId, {
				image: { url: video.thumbnail },
				caption: `🎵 Downloading: *${video.title}*\n⏱ Duration: ${video.timestamp || 'Unknown'}`
			}, { quoted: message });
		}

		// Try Yupra first, fallback Okatsu
		let audioData;
		try { audioData = await getYupraDownloadByUrl(video.url); }
		catch { audioData = await getOkatsuDownloadByUrl(video.url); }

		const audioUrl = audioData.download;
		if (!audioUrl) throw new Error('Audio URL not found');

		const audioResp = await axios.get(audioUrl, { responseType: 'arraybuffer', timeout: 90000 });
		let audioBuffer = Buffer.from(audioResp.data);
		if (!audioBuffer || !audioBuffer.length) throw new Error('Downloaded audio buffer is empty');

		// Convert to MP3 if needed
		let finalBuffer = audioBuffer;
		if (!audioUrl.endsWith('.mp3')) {
			finalBuffer = await toAudio(audioBuffer, 'm4a').catch(() => audioBuffer);
		}

		await sock.sendMessage(chatId, {
			audio: finalBuffer,
			mimetype: 'audio/mpeg',
			fileName: `${audioData.title || video.title}.mp3`,
			ptt: false
		}, { quoted: message });

	} catch (err) {
		console.error('Song command error:', err);
		await sock.sendMessage(chatId, { text: '❌ Failed to download song.' }, { quoted: message });
	}
}

module.exports = songCommand;
