const settings = require('../settings');

async function ownerCommand(sock, chatId, msg) {
    try {
        // ✅ Static Owner info
        const ownerName = "Shahin Rana"; 
        const ownerAddress = "Sylhet"; 
        const ownerReligion = "Islam"; 

        // Dynamic number: যেই আইডিতে বট চালানো হচ্ছে
        const ownerNumber = settings.ownerNumber + "@s.whatsapp.net";

        // Profile picture
        let pp;
        try {
            pp = await sock.profilePictureUrl(ownerNumber, 'image');
        } catch {
            pp = 'https://i.imgur.com/2wzGhpF.jpeg'; // Default image
        }

        // Create fancy owner text with emojis
        const ownerText = `
╔══❖•ೋ° ⚡ °ೋ•❖══╗
      𝐎𝐖𝐍𝐄𝐑 𝐃𝐄𝐓𝐀𝐈𝐋𝐒
╚══❖•ೋ° ⚡ °ೋ•❖══╝

✨ নাম       : 𝐒𝐡𝐚𝐡𝐢𝐧 𝐑𝐚𝐧𝐚 💫
📍 বাসা      : 𝐒𝐲𝐥𝐡𝐞𝐭 🏡
☪️ ধর্ম      : 𝐈𝐬𝐥𝐚𝐦 🕌
📱 নম্বর    : @${settings.ownerNumber}

╔══❖•ೋ° ⚡ °ೋ•❖══╗
       𝐋𝐨𝐯𝐞 𝐰𝐢𝐭𝐡 𝐒𝐡𝐚𝐡𝐢𝐧 𝐑𝐚𝐧𝐚
╚══❖•ೋ° ⚡ °ೋ•❖══╝
`.trim();

        // Send vCard first (মেইন কোডের মতো)
        const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${settings.botOwner}
TEL;waid=${settings.ownerNumber}:${settings.ownerNumber}
END:VCARD
`;

        await sock.sendMessage(chatId, {
            contacts: { displayName: settings.botOwner, contacts: [{ vcard }] },
        });

        // তারপর fancy owner message পাঠাও
        await sock.sendMessage(chatId, {
            image: { url: pp },
            caption: ownerText,
            mentions: [settings.ownerNumber],
            quoted: msg
        });

    } catch (error) {
        console.error('Error in owner command:', error);
        await sock.sendMessage(chatId, { text: 'Failed to fetch owner info!', quoted: msg });
    }
}

module.exports = ownerCommand;
