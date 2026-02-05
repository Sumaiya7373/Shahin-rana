const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const USER_GROUP_DATA = path.join(__dirname, '../data/userGroupData.json');

// In-memory storage
const chatMemory = {
    messages: new Map(),
    userInfo: new Map()
};

/* =========================
   🔥 CUSTOM BANGLA REPLIES
========================= */
const BOT_CALL_REPLIES = [
    "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ😇😘",
    "কি গো সোনা আমাকে ডাকছ কেনো",
    "বার বার আমাকে ডাকস কেন😡",
    "আহ শোনা আমার আমাকে এতো ডাকতাছো কেনো আসো বুকে আশো🥱",
    "হুম জান তোমার অইখানে উম্মমাহ😷😘",
    "আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি",
    "আমাকে এতো না ডেকে বস রানাকে ডাক দেও 🙄",
    "আরে বাবা, আমায় ডাকলে চা-নাস্তা তো লাগবেই ☕🍪",
    "এই যে শুনছেন, আমি কিন্তু আপনার জন্যই অনলাইনে আছি 😉",
    "ডাক দিলেন তো আসলাম, এখন ভাড়া দিবেন নাকি? 😏",
    "আমাকে বেশি ডাকবেন না, আমি VIP bot বুঝছেন 🤖👑",
    "ডাকতে ডাকতে যদি প্রেমে পড়ে যান, দায় আমি নেব না ❤️",
    "শুধু ডাকবেন না, খাওয়াবেনও! ভাত-মাংস হলে চলবে 🍛🐓",
    "আমি বট হইলেও কিন্তু feelings আছে 😌",
    "ডাক দিলেন, হাজির হলাম, এখন কি গান গাইতে হবে নাকি? 🎶",
    "আপনাকে না দেখলে নাকি আমার RAM হ্যাং হয়ে যায় 😜",
    "আপনি ডাক দিলেই আমি হাজির, বাকি বটরা হিংসা করে 😂"
];

function getRandomBotReply() {
    return BOT_CALL_REPLIES[Math.floor(Math.random() * BOT_CALL_REPLIES.length)];
}

// Load & Save
function loadUserGroupData() {
    try {
        return JSON.parse(fs.readFileSync(USER_GROUP_DATA));
    } catch {
        return { groups: [], chatbot: {} };
    }
}

function saveUserGroupData(data) {
    fs.writeFileSync(USER_GROUP_DATA, JSON.stringify(data, null, 2));
}

// Delay
function getRandomDelay() {
    return Math.floor(Math.random() * 3000) + 2000;
}

// Typing
async function showTyping(sock, chatId) {
    await sock.presenceSubscribe(chatId);
    await sock.sendPresenceUpdate('composing', chatId);
    await new Promise(r => setTimeout(r, getRandomDelay()));
}

/* =========================
   CHATBOT COMMAND
========================= */
async function handleChatbotCommand(sock, chatId, message, match) {
    if (!match) {
        await showTyping(sock, chatId);
        return sock.sendMessage(chatId, {
            text: `*CHATBOT SETUP*\n\n*.chatbot on*\nEnable chatbot\n*.chatbot off*\nDisable chatbot`,
            quoted: message
        });
    }

    const data = loadUserGroupData();

    if (match === 'on') {
        data.chatbot[chatId] = true;
        saveUserGroupData(data);
        return sock.sendMessage(chatId, { text: '*Chatbot enabled*', quoted: message });
    }

    if (match === 'off') {
        delete data.chatbot[chatId];
        saveUserGroupData(data);
        return sock.sendMessage(chatId, { text: '*Chatbot disabled*', quoted: message });
    }
}

/* =========================
   CHATBOT RESPONSE
========================= */
async function handleChatbotResponse(sock, chatId, message, userMessage, senderId) {
    const data = loadUserGroupData();
    if (!data.chatbot[chatId]) return;

    const text = userMessage.toLowerCase();

    // 🔥 CUSTOM TRIGGER WORDS
    const triggerWords = ['bot', 'বট', 'মামা', 'ডাক'];

    if (triggerWords.some(w => text.includes(w))) {
        await showTyping(sock, chatId);
        return sock.sendMessage(chatId, {
            text: getRandomBotReply(),
            quoted: message
        });
    }

    // ---------- AI PART ----------
    try {
        await showTyping(sock, chatId);

        const response = await getAIResponse(userMessage, {
            messages: chatMemory.messages.get(senderId) || [],
            userInfo: chatMemory.userInfo.get(senderId) || {}
        });

        if (!response) return;

        await sock.sendMessage(chatId, {
            text: response,
            quoted: message
        });

    } catch (e) {
        console.error(e);
    }
}

/* =========================
   AI RESPONSE
========================= */
async function getAIResponse(userMessage, userContext) {
    try {
        const response = await fetch(
            "https://zellapi.autos/ai/chatbot?text=" +
            encodeURIComponent(userMessage)
        );

        const data = await response.json();
        return data?.result?.trim() || null;

    } catch {
        return null;
    }
}

module.exports = {
    handleChatbotCommand,
    handleChatbotResponse
};                
