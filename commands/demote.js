 // ================= MANUAL DEMOTE COMMAND =================
async function demoteCommand(sock, chatId, mentionedJids, message) {
    let userToDemote = [];

    if (mentionedJids && mentionedJids.length > 0) {
        userToDemote = mentionedJids;
    } else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
        userToDemote = [message.message.extendedTextMessage.contextInfo.participant];
    }

    if (userToDemote.length === 0) {
        await sock.sendMessage(chatId, {
            text: 'Please mention the user or reply to their message to demote!'
        });
        return;
    }

    try {
        await sock.groupParticipantsUpdate(chatId, userToDemote, "demote");

        const usernames = userToDemote.map(jid => `@${jid.split('@')[0]}`);
        const promoterJid = sock.user.id;
        const adminTag = `@${promoterJid.split('@')[0]}`;

        const groupMeta = await sock.groupMetadata(chatId);
        const groupName = groupMeta.subject || 'Unknown Group';

        const ownerJid =
            groupMeta.owner ||
            groupMeta.participants.find(p => p.admin === 'superadmin')?.id;

        const ownerTag = ownerJid ? `@${ownerJid.split('@')[0]}` : 'Not Found';

        const now = new Date();
        const date = now.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        const time = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        const demoteMessage =
`╭─〔 *⚡ Admin Event* 〕
├─ ${adminTag} has demoted ${usernames.join(', ')}
├─ Group: ${groupName}
├─ 👑 𝐆𝐫𝐨𝐮𝐩 𝐎𝐰𝐧𝐞𝐫 : ${ownerTag}
│
├─ ✦ *Demotion Schedule* ✦
│   ├─ 🗓️ 𝐃𝐚𝐭𝐞 » ${date}
│   └─ ⌛ 𝐓𝐢𝐦𝐞 » ${time}
│
╰─➤ Powered by ~⎯͢⎯⃝🩷➪‎‎‎Shahin Rana♡●➪`;

        await sock.sendMessage(chatId, {
            text: demoteMessage,
            mentions: [...userToDemote, promoterJid, ownerJid].filter(Boolean)
        });

    } catch (error) {
        console.error('Error in demote command:', error);
        await sock.sendMessage(chatId, { text: 'Failed to demote user(s)!' });
    }
}

// ================= AUTO DEMOTION EVENT =================
async function handleDemotionEvent(sock, groupId, participants, author) {
    try {
        if (!Array.isArray(participants) || participants.length === 0) return;

        const groupMeta = await sock.groupMetadata(groupId);
        const groupName = groupMeta.subject || 'Unknown Group';

        const demotedUsers = participants.map(jid => {
            const jidStr = typeof jid === 'string' ? jid : jid.id;
            return `@${jidStr.split('@')[0]}`;
        });

        let mentionList = participants.map(jid =>
            typeof jid === 'string' ? jid : jid.id
        );

        let adminTag = 'System';
        if (author) {
            const adminJid = typeof author === 'string' ? author : author.id;
            adminTag = `@${adminJid.split('@')[0]}`;
            mentionList.push(adminJid);
        }

        const ownerJid =
            groupMeta.owner ||
            groupMeta.participants.find(p => p.admin === 'superadmin')?.id;

        const ownerTag = ownerJid ? `@${ownerJid.split('@')[0]}` : 'Not Found';
        if (ownerJid) mentionList.push(ownerJid);

        const now = new Date();
        const date = now.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        const time = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        const demoteMessage =
`╭─〔 *⚡ Admin Event* 〕
├─ ${adminTag} has demoted ${demotedUsers.join(', ')}
├─ Group: ${groupName}
├─ 👑 𝐆𝐫𝐨𝐮𝐩 𝐎𝐰𝐧𝐞𝐫 : ${ownerTag}
│
├─ ✦ *Demotion Schedule* ✦
│   ├─ 🗓️ 𝐃𝐚𝐭𝐞 » ${date}
│   └─ ⌛ 𝐓𝐢𝐦𝐞 » ${time}
│
╰─➤ Powered by ~⎯͢⎯⃝🩷➪‎‎‎Shahin Rana♡●➪`;

        await sock.sendMessage(groupId, {
            text: demoteMessage,
            mentions: mentionList
        });

    } catch (error) {
        console.error('Error handling demotion event:', error);
    }
}

module.exports = {
    demoteCommand,
    handleDemotionEvent
};
