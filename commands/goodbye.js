const { handleGoodbye } = require('../lib/welcome');
const { isGoodByeOn, getGoodbye } = require('../lib/index');
const fetch = require('node-fetch');

async function goodbyeCommand(sock, chatId, message, match) {
    if (!chatId.endsWith('@g.us')) {
        await sock.sendMessage(chatId, { text: 'This command can only be used in groups.' });
        return;
    }

    const text = message.message?.conversation || 
                message.message?.extendedTextMessage?.text || '';
    const matchText = text.split(' ').slice(1).join(' ');

    await handleGoodbye(sock, chatId, message, matchText);
}

async function handleLeaveEvent(sock, id, participants) {
    const isGoodbyeEnabled = await isGoodByeOn(id);
    if (!isGoodbyeEnabled) return;

    const customMessage = await getGoodbye(id);

    const groupMetadata = await sock.groupMetadata(id);
    const groupName = groupMetadata.subject;

    for (const participant of participants) {
        try {
            const participantString = typeof participant === 'string'
                ? participant
                : (participant.id || participant.toString());

            const user = participantString.split('@')[0];

            let displayName = user;
            try {
                const groupParticipants = groupMetadata.participants;
                const userParticipant = groupParticipants.find(p => p.id === participantString);
                if (userParticipant && userParticipant.name) {
                    displayName = userParticipant.name;
                }
            } catch {}

            let finalMessage;
            if (customMessage) {
                finalMessage = customMessage
                    .replace(/{user}/g, `@${displayName}`)
                    .replace(/{group}/g, groupName);
            } else {
                // 🔥 CUSTOM DEFAULT GOODBYE MESSAGE
                finalMessage =
`╔═══❖•ೋ°°ೋ•❖═══╗
👋 *Goodbye @${displayName}*
╚═══❖•ೋ°°ೋ•❖═══╝

🤗 আমাদের ছোট্ট পরিবার তোমাকে মিস করবে!

— ☕ *✎ᝰ.⎯꯭̽𝐒𝐡𝐚𝐡𝐢𝐧 𝐑𝐚𝐧𝐚⎯꯭̽᪳❤️‍🩹🪽*`;
            }

            try {
                let profilePicUrl = 'https://img.pyrocdn.com/dbKUgahg.png';
                try {
                    const profilePic = await sock.profilePictureUrl(participantString, 'image');
                    if (profilePic) profilePicUrl = profilePic;
                } catch {}

                const apiUrl =
`https://api.some-random-api.com/welcome/img/2/gaming1
?type=leave
&textcolor=red
&username=${encodeURIComponent(displayName)}
&guildName=${encodeURIComponent(groupName)}
&memberCount=${groupMetadata.participants.length}
&avatar=${encodeURIComponent(profilePicUrl)}`.replace(/\n/g, '');

                const response = await fetch(apiUrl);
                if (response.ok) {
                    const imageBuffer = await response.buffer();
                    await sock.sendMessage(id, {
                        image: imageBuffer,
                        caption: finalMessage,
                        mentions: [participantString]
                    });
                    continue;
                }
            } catch {}

            await sock.sendMessage(id, {
                text: finalMessage,
                mentions: [participantString]
            });

        } catch (error) {
            console.error('Error sending goodbye message:', error);

            const participantString = typeof participant === 'string'
                ? participant
                : (participant.id || participant.toString());

            await sock.sendMessage(id, {
                text: `Goodbye @${participantString.split('@')[0]} 👋`,
                mentions: [participantString]
            });
        }
    }
}

module.exports = { goodbyeCommand, handleLeaveEvent };
