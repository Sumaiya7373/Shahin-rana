const { handleWelcome } = require('../lib/welcome');
const { isWelcomeOn, getWelcome } = require('../lib/index');
const { channelInfo } = require('../lib/messageConfig');
const fetch = require('node-fetch');

async function welcomeCommand(sock, chatId, message, match) {
    // Check if it's a group
    if (!chatId.endsWith('@g.us')) {
        await sock.sendMessage(chatId, { text: 'This command can only be used in groups.' });
        return;
    }

    // Extract match from message
    const text =
        message.message?.conversation ||
        message.message?.extendedTextMessage?.text ||
        '';
    const matchText = text.split(' ').slice(1).join(' ');

    await handleWelcome(sock, chatId, message, matchText);
}

async function handleJoinEvent(sock, id, participants) {
    // Check if welcome is enabled for this group
    const isWelcomeEnabled = await isWelcomeOn(id);
    if (!isWelcomeEnabled) return;

    // Get custom welcome message
    const customMessage = await getWelcome(id);

    // Get group metadata
    const groupMetadata = await sock.groupMetadata(id);
    const groupName = groupMetadata.subject;
    const groupDesc = groupMetadata.desc || 'No description available';

    // Send welcome message for each new participant
    for (const participant of participants) {
        try {
            const participantString =
                typeof participant === 'string'
                    ? participant
                    : participant.id || participant.toString();

            const user = participantString.split('@')[0];

            // Get user's display name
            let displayName = user;
            try {
                const contact = await sock.getBusinessProfile(participantString);
                if (contact && contact.name) {
                    displayName = contact.name;
                } else {
                    const groupParticipants = groupMetadata.participants;
                    const userParticipant = groupParticipants.find(
                        (p) => p.id === participantString
                    );
                    if (userParticipant && userParticipant.name) {
                        displayName = userParticipant.name;
                    }
                }
            } catch (e) {
                console.log('Could not fetch display name, using phone number');
            }

            let finalMessage;

            if (customMessage) {
                finalMessage = customMessage
                    .replace(/{user}/g, `@${displayName}`)
                    .replace(/{group}/g, groupName)
                    .replace(/{description}/g, groupDesc);
            } else {
                finalMessage = `
╔══❀•°•🌸•°•❀══╗
𝐖𝐄𝐋𝐂𝐎𝐌𝐄 @${displayName} 😎
╚══❀•°•🌸•°•❀══╝
𝐆𝐫𝐨𝐮𝐩 𝐧𝐚𝐦𝐞 :
*${groupName}*

👥 𝐓𝐨𝐭𝐚𝐥 𝐌𝐞𝐦𝐛𝐞𝐫𝐬 :
${groupMetadata.participants.length} জন 🔥

😜 নতুন মেম্বার আসছে মানেই
চা ☕ + আড্ডা 🗣️ + হাসি 🤣 বাড়ছে!

_সময় বদলায় কিন্তু কিছু অনুভুতি_
_যা কখনো বদলায় না_

__আমাদের গ্রুপে এড হওয়ার জন্য ধন্যবাদ__
__মজা করুন, আড্ডা দেন__ 🌸

╭───❖☆❖───╮
💖 𝐋𝐨𝐯𝐞 𝐰𝐢𝐭𝐡 𝐒𝐡𝐚𝐡𝐢𝐧 𝐑𝐚𝐧𝐚 💖
╰───❖☆❖───╯
`;
            }

            // Try sending image welcome
            try {
                let profilePicUrl = 'https://img.pyrocdn.com/dbKUgahg.png';
                try {
                    const profilePic = await sock.profilePictureUrl(
                        participantString,
                        'image'
                    );
                    if (profilePic) profilePicUrl = profilePic;
                } catch {}

                const apiUrl = `https://api.some-random-api.com/welcome/img/2/gaming3?type=join&textcolor=green&username=${encodeURIComponent(
                    displayName
                )}&guildName=${encodeURIComponent(
                    groupName
                )}&memberCount=${
                    groupMetadata.participants.length
                }&avatar=${encodeURIComponent(profilePicUrl)}`;

                const response = await fetch(apiUrl);
                if (response.ok) {
                    const imageBuffer = await response.buffer();
                    await sock.sendMessage(id, {
                        image: imageBuffer,
                        caption: finalMessage,
                        mentions: [participantString],
                        ...channelInfo,
                    });
                    continue;
                }
            } catch {
                console.log('Image failed, sending text');
            }

            // Fallback text
            await sock.sendMessage(id, {
                text: finalMessage,
                mentions: [participantString],
                ...channelInfo,
            });
        } catch (error) {
            console.error('Welcome error:', error);
        }
    }
}

module.exports = { welcomeCommand, handleJoinEvent };
