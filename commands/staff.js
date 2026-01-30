async function staffCommand(sock, chatId, msg) {
    try {
        // Get group metadata
        const groupMetadata = await sock.groupMetadata(chatId);
        
        // Get group profile picture
        let pp;
        try {
            pp = await sock.profilePictureUrl(chatId, 'image');
        } catch {
            pp = 'https://i.imgur.com/2wzGhpF.jpeg'; // Default image
        }

        // Get admins from participants
        const participants = groupMetadata.participants;
        const groupAdmins = participants.filter(p => p.admin);

        // Owner of the group
        const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || chatId.split('-')[0] + '@s.whatsapp.net';

        // Build fancy admin list
        let listAdminText = '';
        groupAdmins.forEach((admin, index) => {
            listAdminText += `╔══❖•ೋ° ⚡ °ೋ•❖══╗\n`;
            listAdminText += `✨ ${index + 1}. @${admin.id.split('@')[0]}\n`;
            listAdminText += `╚══❖•ೋ° ⚡ °ೋ•❖══╝\n`;
        });

        // Compose final text with fancy boxes
        const text = `
╔══❖•ೋ° ⚡ °ೋ•❖══╗
      𝐆𝐑𝐎𝐔𝐏: ${groupMetadata.subject}
╚══❖•ೋ° ⚡ °ೋ•❖══╝
╔══❖•ೋ° ⚡ °ೋ•❖══╗
      𝐀𝐝𝐦𝐢𝐧 (${groupAdmins.length})
╚══❖•ೋ° ⚡ °ೋ•❖══╝

╔══❖•ೋ° ⚡ °ೋ•❖══╗
  𝐀𝐓𝐓𝐄𝐍𝐓𝐈𝐎𝐍 𝐀𝐋𝐋 𝐀𝐃𝐌𝐈𝐍 💗🥳🍁
╚══❖•ೋ° ⚡ °ೋ•❖══╝

${listAdminText}
`.trim();

        // Send the message with image and mentions
        await sock.sendMessage(chatId, {
            image: { url: pp },
            caption: text,
            mentions: [...groupAdmins.map(v => v.id), owner]
        });

    } catch (error) {
        console.error('Error in staff command:', error);
        await sock.sendMessage(chatId, { text: 'Failed to get admin list!' });
    }
}

module.exports = staffCommand;
