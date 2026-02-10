const settings = require("../settings");

async function aliveCommand(sock, chatId, message) {

    try {

        const botNumber = sock.user.id.split(":")[0];

        const aliveText =

`*╭━━━〔🍓𝐒𝐡𝐚𝐡𝐢𝐧 𝐑𝐚𝐧𝐚━ 𝐁𝕺𝐓 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃〕━━━✦*

*┃🌱 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃 : ${botNumber}*

*┃👻 𝐏𝐑𝐄𝐅𝐈𝐗 : .*

*┃🔮 𝐌𝐎𝐃𝐄 : public*

*┃🎐 𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : ${settings.version}*

*┃👑 𝐎𝐖𝐍𝐄𝐑 :*~_🪀𝐗𝐭𝐲𝐥𝐢𝐬𝐡_ღ꙰𝐒𝐡𝐚𝐡𝐢𝐧࿐👑_~*

*╰━━━━━━━━━━━━━━━━━━╯*

*╭━━━〔🛠️ 𝗧𝗜𝗣𝗦〕━━━━✦*

*┃✧ 𝐓𝐘𝐏𝐄 .menu 𝐓𝐎 𝐕𝐈𝐄𝐖 𝐀𝐋𝐋*

*┃✧ 𝐈𝐍𝐂𝐋𝐔𝐃𝐄𝐒 𝐅𝐔𝐍, 𝐆𝐀𝐌𝐄, 𝐒𝐓𝐘𝐋𝐄*

*╰━━━━━━━━━━━━━━━━━╯*`;

        await sock.sendMessage(chatId, {

            text: aliveText,

            contextInfo: {

                forwardingScore: 999,

                isForwarded: true,

                forwardedNewsletterMessageInfo: {

                    newsletterJid: '120363161513685998@newsletter',

                    newsletterName: 'SHAHIN RANA',

                    serverMessageId: -1

                }

            }

        }, { quoted: message });

    } catch (err) {

        console.error("Alive Command Error:", err);

        await sock.sendMessage(

            chatId,

            { text: "🤖 Bot is connected and running!" },

            { quoted: message }

        );

    }

}

module.exports = aliveCommand;
