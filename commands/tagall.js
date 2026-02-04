       const isAdmin = require('../lib/isAdmin');

async function tagAllCommand(sock, chatId, senderId, message) {
    try {
        const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);

        if (!isBotAdmin) {
            await sock.sendMessage(chatId, { 
                text: 'Please make the bot an admin first.', 
                quoted: message 
            });
            return;
        }

        const groupMetadata = await sock.groupMetadata(chatId);
        const members = groupMetadata.participants;

        const emojis = [
            "│🌸 ᩧ𝆺ྀི𝅥","│👑 ᩧ𝆺ྀི𝅥","│🎀 ᩧ𝆺ྀི𝅥",
            "│🦋 ᩧ𝆺ྀི𝅥","│💎 ᩧ𝆺ྀི𝅥","│🎾 ᩧ𝆺ྀི𝅥",
            "│🎈 ᩧ𝆺ྀི𝅥","│🧁 ᩧ𝆺ྀི𝅥","│🍿 ᩧ𝆺ྀི𝅥","│🥳 ᩧ𝆺ྀི𝅥"
        ];

        let count = 1;

        let messageText = `
▢ GROUP : ${groupMetadata.subject}
▢ MEMBERS : ${members.length}
▢ MESSAGE : 💥 ATTENTION EVERYONE! 💥

╭┈─「 ɦเ αℓℓ ƒɾเεɳ∂ร 🥰 」┈❍
`;

        for (let m of members) {
            let emoji = emojis[(count - 1) % emojis.length];
            messageText += `${emoji} @${m.id.split('@')[0]}\n`;
            count++;
        }

        messageText += `╰────────────❍

💬 Sent with Power by 𓆩Xtylish-Shahin𓆪 🖤
🌸 Stay Active — Stay Stylish! ✨
`;

        await sock.sendMessage(
            chatId,
            {
                text: messageText,
                mentions: members.map(a => a.id)
            },
            { quoted: message }
        );

    } catch (error) {
        console.error("❌ TagAll error:", error);
        await sock.sendMessage(
            chatId,
            { text: "⚠ কিছু সমস্যা হয়েছে ভাই! পরে আবার চেষ্টা করো 😅", quoted: message }
        );
    }
}

module.exports = tagAllCommand;
