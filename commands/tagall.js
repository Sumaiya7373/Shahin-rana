const isAdmin = require('../lib/isAdmin');

async function tagAllCommand(sock, chatId, senderId, message) {
    try {
        // Group metadata
        const groupMetadata = await sock.groupMetadata(chatId);
        const members = groupMetadata.participants;

        const emojis = [
            "│🌸 ᩧ𝆺ྀི𝅥","│👑 ᩧ𝆺ྀི𝅥","│🎀 ᩧ𝆺ྀི𝅥",
            "│🦋 ᩧ𝆺ྀི𝅥","│💎 ᩧ𝆺ྀི𝅥","│🎾 ᩧ𝆺ྀི𝅥",
            "│🎈 ᩧ𝆺ྀི𝅥","│🧁 ᩧ𝆺ྀི𝅥","│🍿 ᩧ𝆺ྀི𝅥","│🥳 ᩧ𝆺ྀི𝅥"
        ];

        let count = 1;

        let messageText = `
▢ 🇬‌𝐑𝐎𝐔𝐏 : ${groupMetadata.subject}
▢ 🇲‌𝐄𝐌𝐁𝐄𝐑𝐒 : ${members.length}
▢ 🇲‌𝐄𝐒𝐒𝐀𝐆𝐄 : 💗🇦‌𝐓𝐓𝐄𝐍𝐓𝐈𝐎𝐍 🇪‌𝐕𝐄𝐑𝐘𝐎𝐍𝐄!💗

╭┈─「 ɦเ αℓℓ ƒɾเεɳ∂ร 🥰 」┈❍
`;

        for (let m of members) {
            let emoji = emojis[(count - 1) % emojis.length];
            messageText += `${emoji} @${m.id.split('@')[0]}\n`;
            count++;
        }

        messageText += `╰────────────❍

💬 Sent with Love by 𓆩Xtylish-Shahin𓆪 🖤
💗 Stay Active — Stay Stylish! ✨
`;

        await sock.sendMessage(chatId, {
            text: messageText,
            mentions: members.map(a => a.id)
        }, { quoted: message });

    } catch (error) {
        console.error("❌ TagAll error:", error);
        await sock.sendMessage(
            chatId,
            { text: "⚠ কিছু সমস্যা হয়েছে ভাই! পরে আবার চেষ্টা করো 😅", quoted: message }
        );
    }
}

module.exports = tagAllCommand;
