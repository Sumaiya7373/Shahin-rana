const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const USER_GROUP_DATA = path.join(__dirname, '../data/userGroupData.json');

// ================= BOT CALL REPLIES =================
const botCallReplies = [
  "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ😇😘",
  "কি গো সোনা আমাকে ডাকছ কেনো",
  "বার বার আমাকে ডাকস কেন😡",
  "আহ শোনা আমার আমাকে এতো ডাকতাছো কেনো আসো বুকে আশো🥱",
  "হুম জান তোমার অইখানে উম্মমাহ😷😘",
  "আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি",
  "আমাকে এতো না ডেকে বস রানাকে একটা বউ দে 🙄",
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

// ================= MEMORY =================
const chatMemory = {
  messages: new Map(),
  userInfo: new Map()
};

// ================= DATA HANDLER =================
function loadUserGroupData() {
  try {
    return JSON.parse(fs.readFileSync(USER_GROUP_DATA));
  } catch {
    return { chatbot: {} };
  }
}

function saveUserGroupData(data) {
  fs.writeFileSync(USER_GROUP_DATA, JSON.stringify(data, null, 2));
}

// ================= UTILS =================
function getRandomDelay() {
  return Math.floor(Math.random() * 3000) + 2000;
}

async function showTyping(sock, chatId) {
  await sock.presenceSubscribe(chatId);
  await sock.sendPresenceUpdate('composing', chatId);
  await new Promise(r => setTimeout(r, getRandomDelay()));
}

// ================= COMMAND =================
async function handleChatbotCommand(sock, chatId, message, match) {
  const data = loadUserGroupData();

  if (!match) {
    return sock.sendMessage(chatId, {
      text: `*CHATBOT MENU*\n\n.chatbot on\n.chatbot off`,
      quoted: message
    });
  }

  if (match === 'on') {
    data.chatbot[chatId] = true;
    saveUserGroupData(data);
    return sock.sendMessage(chatId, {
      text: '✅ Chatbot enabled',
      quoted: message
    });
  }

  if (match === 'off') {
    delete data.chatbot[chatId];
    saveUserGroupData(data);
    return sock.sendMessage(chatId, {
      text: '❌ Chatbot disabled',
      quoted: message
    });
  }
}

// ================= RESPONSE =================
async function handleChatbotResponse(sock, chatId, message, userMessage, senderId) {
  const data = loadUserGroupData();
  if (!data.chatbot[chatId]) return;

  const msg = userMessage.trim().toLowerCase();

  // 🔥 BOT / বট CALL RESPONSE
  if (msg === 'bot' || msg === 'বট') {
    const reply =
      botCallReplies[Math.floor(Math.random() * botCallReplies.length)];

    await showTyping(sock, chatId);

    return sock.sendMessage(chatId, {
      text: `@${senderId.split('@')[0]} ${reply}`,
      mentions: [senderId]
    }, { quoted: message });
  }

  // ================= AI CHAT =================
  await showTyping(sock, chatId);

  const response = await getAIResponse(userMessage);
  if (!response) return;

  await sock.sendMessage(chatId, {
    text: response
  }, { quoted: message });
}

// ================= AI =================
async function getAIResponse(text) {
  try {
    const res = await fetch(
      "https://zellapi.autos/ai/chatbot?text=" + encodeURIComponent(text)
    );
    const json = await res.json();
    return json.result || null;
  } catch {
    return null;
  }
}

module.exports = {
  handleChatbotCommand,
  handleChatbotResponse
};
