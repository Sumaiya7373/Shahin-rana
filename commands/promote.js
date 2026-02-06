const { isAdmin } = require('../lib/isAdmin');

// ================= MANUAL PROMOTE COMMAND =================
async function promoteCommand(sock, chatId, mentionedJids, message) {
    let userToPromote = [];

    if (mentionedJids && mentionedJids.length > 0) {
        userToPromote = mentionedJids;
    } else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
        userToPromote = [message.message.extendedTextMessage.contextInfo.participant];
    }

    if (userToPromote.length === 0) {
        await sock.sendMessage(chatId, {
            text: 'Please mention the user or reply to their message to promote!'
        });
        return;
    }

    try {
        await sock.groupParticipantsUpdate(chatId, userToPromote, "promote");

        const usernames = userToPromote.map(jid => `@${jid.split('@')[0]}`);
        const promoterJid = sock.user.id;
        const adminTag = `@${promoterJid.split('@')[0]}`;

        const groupMeta = await sock.groupMetadata(chatId);
        const groupName = groupMeta.subject || 'Unknown Group';

        const ownerJid =
            groupMeta.owner ||
            groupMeta.participants.find(p => p.admin === 'superadmin')?.id;

        const ownerTag = ownerJid ? `@${ownerJid.split('@')[0]}` : 'Not Found';

        const promotionMessage =
`╭─〔 *🎉 Admin Event* 〕
├─ ${adminTag} has promoted ${usernames.join(', ')}
├─ Group: ${groupName}
├─ 👑 𝐆𝐫𝐨𝐮𝐩 𝐎𝐰𝐧𝐞𝐫 : ${ownerTag}
│
├─ 💖 *একটি বিশেষ বার্তা*
│   └─ আজ থেকে তুমি আমাদের গ্রুপের দায়িত্বশীল একজন অভিভাবক।
│      সততা ও সম্মানের সাথে দায়িত্ব পালন করবে 💫
│
╰─➤ Powered by ~⎯͢⎯⃝🩷➪‎‎‎Shahin Rana♡●➪`;

        await sock.sendMessage(chatId, {
            text: promotionMessage,
            mentions: [...userToPromote, promoterJid, ownerJid].filter(Boolean)
        });

    } catch (error) {
        console.error('Error in promote command:', error);
        await sock.sendMessage(chatId, { text: 'Failed to promote user(s)!' });
    }
}

// ================= AUTO PROMOTION EVENT =================
async function handlePromotionEvent(sock, groupId, participants, author) {
    try {
        if (!Array.isArray(participants) || participants.length === 0) return;

        const groupMeta = await sock.groupMetadata(groupId);
        const groupName = groupMeta.subject || 'Unknown Group';

        const promotedUsers = participants.map(jid => {
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

        const promotionMessage =
`╭─〔 *🎉 Admin Event* 〕
├─ ${adminTag} has promoted ${promotedUsers.join(', ')}
├─ Group: ${groupName}
├─ 👑 𝐆𝐫𝐨𝐮𝐩 𝐎𝐰𝐧𝐞𝐫 : ${ownerTag}
│
├─ 💖 *একটি বিশেষ বার্তা*
│   └─ আজ থেকে তুমি আমাদের গ্রুপের দায়িত্বশীল একজন অভিভাবক।
│      সততা ও সম্মানের সাথে দায়িত্ব পালন করবে 💫
│
╰─➤ Powered by ~⎯͢⎯⃝🩷➪‎‎‎Shahin Rana♡●➪`;

        await sock.sendMessage(groupId, {
            text: promotionMessage,
            mentions: mentionList
        });

    } catch (error) {
        console.error('Error handling promotion event:', error);
    }
}

module.exports = { promoteCommand, handlePromotionEvent };
