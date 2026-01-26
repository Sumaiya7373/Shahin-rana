const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message) {
    const helpMessage = `
╭──────────❏─────────⭓
   *🤖 ${settings.botName || ' 𝐒𝐡𝐚𝐡𝐢𝐧 𝐑𝐚𝐧𝐚'}*  
   *~_𝐕𝐞𝐫𝐬𝐢𝐨𝐧_~*: *${settings.version || '3.0.0'}*
   *~_𝐁𝐘_~* ${settings.botOwner || 'Mr Unique Hacker'}
   *~_𝐘𝐓_~* : *~_👑 𝐗𝐭𝐲𝐥𝐢𝐬𝐡_ღ꙰𝐒𝐡𝐚𝐡𝐢𝐧࿐👑_~*
╰──────────❏──────────⭓

*▣𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐬▣:*

╭──────────❏─────────⭓
🌐 *▣𝐆𝐞𝐧𝐞𝐫𝐚𝐥 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐬▣*:
├◈  🌐 *help or. Menu*
├◈  🏓 .ping
├◈  💡  .alive
├◈  🎙️ .tts <text>
├◈  👑  .owner
├◈  😂 .joke
├◈  📝 .quote
├◈  📚 .fact
├◈  ☁️ .weather <city>
├◈  📰  .news
├◈  🎨 .attp <text>
├◈  🎵 .lyrics <song_title>
├◈  🎱 .8ball <question>
├◈  👥 .groupinfo
├◈  🛡️ .staff or .admins 
├◈  👁️ .vv
├◈  🌍 .trt <text> <lang>
├◈  📸 .ss <link>
├◈  🆔  .jid
├◈  🔗 .url
╰──────────❏──────────⭓

╭──────────❏─────────⭓
👮‍♂️ *▣𝙰𝚍𝚖𝚒𝚗 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜▣*:
├◈  💀 .ban @user
├◈  🔥 .promote @user
├◈  💀 .demote @user
├◈  🎀 .mute <minutes>
├◈  🔥 .unmute
├◈  💀 .delete or .del
├◈  🎀 .kick @user
├◈  🔥 .warnings @user
├◈  🎀 .warn @user
├◈  🎀 .antilink
├◈  💀 .antibadword
├◈  💀 .clear
├◈  🎭 .tag <message>
├◈  🎭 .tagall
├◈  💗 .tagnotadmin
├◈  ☣️ .hidetag <message>
├◈  ☣️ .chatbot
├◈  🥳 .resetlink
├◈  🌺 .antitag <on/off>
├◈  🥳 .welcome <on/off>
├◈  🍎 .goodbye <on/off>
├◈  🍎 .setgdesc <description>
├◈  🍎 .setgname <new name>
├◈  🌺 .setgpp (reply to image)
╰──────────❏──────────⭓

╭──────────❏─────────⭓
🔒 *▣𝐎𝐰𝐧𝐞𝐫 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐬▣*:
├◈  🔐 .mode <public/private>
├◈  🔐 .clearsession
├◈  🔐 .antidelete
├◈  🔐 .cleartmp
├◈  🔐 .update
├◈  🔐 .settings
├◈  🔐 .setpp <reply to image>
├◈  🔐 .autoreact <on/off>
├◈  🔐 .autostatus <on/off>
├◈  🔐 .autostatus react <on/off>
├◈  🔐 .autotyping <on/off>
├◈  🔐 .autoread <on/off>
├◈  🔐 .anticall <on/off>
├◈  🔐 .pmblocker <on/off/status>
├◈  🔐 .pmblocker setmsg <text>
├◈  🔐 .setmention <reply to msg>
├◈  🔐 .mention <on/off>
╰──────────❏──────────⭓

╭──────────❏─────────⭓
🎨 *▣𝐈𝐦𝐚𝐠𝐞 /𝐒𝐭𝐢𝐜𝐤𝐞𝐫 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐬▣*:
├◈  🔥 .blur <image>
├◈  🔥 .simage <reply to sticker>
├◈  🔥 .sticker <reply to image>
├◈  🔥 .removebg
├◈  🔥 .remini
├◈  🔥 .crop <reply to image>
├◈  🔥 .tgsticker <Link>
├◈  🔥 .meme
├◈  🔥 .take <packname> 
├◈  🔥 .emojimix <emj1>+<emj2>
├◈  🔥 .igs <insta link>
├◈  🔥 .igsc <insta link>
╰──────────❏──────────⭓ 

╭──────────❏─────────⭓
🖼️ *▣𝐏𝐢𝐞𝐬 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐬▣*:
├◈  😻 .pies <country>
├◈  😻 .china 
├◈  😻 .indonesia 
├◈  😻 .japan 
├◈  😻 .korea 
├◈  😻 .hijab
╰──────────❏──────────⭓

╭──────────❏─────────⭓
🎮 *▣𝐆𝐚𝐦𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐬▣*:
├◈  🥳 .tictactoe @user
├◈  🥳 .hangman
├◈  🥳 .guess <letter>
├◈  🥳 .trivia
├◈  🥳 .answer <answer>
├◈  🥳 .truth
├◈  🥳 .dare
╰──────────❏──────────⭓

╭──────────❏─────────⭓
🤖 *▣𝐀𝐥 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐬▣*:
├◈  💀 .gpt <question>
├◈  💀 .gemini <question>
├◈  💀 .imagine <prompt>
├◈  💀 .flux <prompt>
├◈  💀 .sora <prompt>
╰──────────❏──────────⭓

╭──────────❏─────────⭓
🎯 *▣𝐅𝐮𝐧 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐬▣*:
├◈  🫶 .compliment @user
├◈  🫶 .insult @user
├◈  🫶 .flirt 
├◈  🫶 .shayari
├◈  🫶 .goodnight
├◈  🫶 .roseday
├◈  🫶 .character @user
├◈  🫶 .wasted @user
├◈  🫶 .ship @user
├◈  🫶 .simp @user
├◈  🫶 .stupid @user [text]
╰──────────❏──────────⭓

╭──────────❏─────────⭓
🔤 *▣𝐓𝐞𝐱𝐭𝐦𝐚𝐤𝐞𝐫▣*:
├◈  💲 .metallic <text>
├◈  💲 .ice <text>
├◈  💲 .snow <text>
├◈  💲 .impressive <text>
├◈  💲 .matrix <text>
├◈  💲 .light <text>
├◈  💲 .neon <text>
├◈  💲 .devil <text>
├◈  💲 .purple <text>
├◈  💲 .thunder <text>
├◈  💲 .leaves <text>
├◈  💲 .1917 <text>
├◈  💲 .arena <text>
├◈  💲 .hacker <text>
├◈  💲 .sand <text>
├◈  💲 .blackpink <text>
├◈  💲 .glitch <text>
├◈  💲 .fire <text>
╰──────────❏──────────⭓

╭──────────❏─────────⭓
📥 *▣𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐫▣*:
├◈  🎧.play <song_name>
├◈  🎧 .song <song_name>
├◈  🎧 .spotify <query>
├◈  🎧 .instagram <link>
├◈  🎧 .facebook <link>
├◈  🎧 .tiktok <link>
├◈  🎧 .video <song name>
├◈  🎧 . <Link>
╰──────────❏──────────⭓

╭──────────❏─────────⭓
🧩 *▣𝐌𝐢𝐬𝐜▣*:
├◈  🎀 .heart
├◈  🎀 .horny
├◈  🎀 .circle
├◈  🎀 .lgbt
├◈  🎀 .lolice
├◈  🎀 .its-so-stupid
├◈  🎀 .namecard 
├◈  🎀 .oogway
├◈  🎀 .tweet
├◈  🎀 .ytcomment 
├◈  🎀 .comrade 
├◈  🎀 .gay 
├◈  🎀 .glass 
├◈  🎀 .jail 
├◈  🎀 .passed 
├◈  🎀 .triggered
╰──────────❏──────────⭓

╭──────────❏─────────⭓
🖼️ *▣𝐀𝐧𝐢𝐦𝐞▣*:
├◈  📸 .nom 
├◈  📸 .poke 
├◈  📸 .cry 
├◈  📸 .kiss 
├◈  📸 .pat 
├◈  📸 .hug 
├◈  📸 .wink 
├◈  📸 .facepalm 
╰──────────❏──────────⭓

╭──────────❏─────────⭓
💻 *▣𝐆𝐢𝐭𝐡𝐮𝐛 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐬▣:*
├◈  🔐 .git
├◈  🔐 .github
├◈  🔐 .sc
├◈  🔐.script
├◈  🔐 .repo
╰──────────❏──────────⭓





💖 *~_Made with love by Shahin -Rana_~*:`;

    try {
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');
        
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363161513685998@newsletter',
                        newsletterName: 'SHAHIN RANA',
                        serverMessageId: -1
                    }
                }
            },{ quoted: message });
        } else {
            console.error('Bot image not found at:', imagePath);
            await sock.sendMessage(chatId, { 
                text: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363161513685998@newsletter',
                        newsletterName: 'Shahin bot by Mr Shahin Rana',
                        serverMessageId: -1
                    } 
                }
            });
        }
    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;
