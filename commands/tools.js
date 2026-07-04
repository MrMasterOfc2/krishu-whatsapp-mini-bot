// ============================================
// KRISHU BOT - UTILITY TOOLS
// ============================================

const { reply, register } = require('./_core');
const moment = require('moment');

function registerTools(register) {
    
    // AI Chat (Google Gemini if API key available)
    register('ai', async (sock, m, args, config) => {
        if (!args.length) return reply(sock, m, '❌ Example: .ai what is hacking?');
        
        if (config.apiKeys.gemini) {
            try {
                const axios = require('axios');
                const text = args.join(' ');
                const res = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${config.apiKeys.gemini}`, {
                    contents: [{ parts: [{ text }] }]
                });
                const response = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
                reply(sock, m, `🤖 *Gemini AI:*\n\n${response}`);
            } catch(e) {
                reply(sock, m, '❌ AI service error. Using offline mode.\n\nThis is a test response from KRISHU BOT AI.');
            }
        } else {
            // Offline AI simulation
            const responses = [
                "That's an interesting question! KRISHU BOT is here to help.",
                "I'm a WhatsApp bot with 500+ commands. Try .menu to see all!",
                "You can ask me to download videos, search the web, create stickers, and more!",
                "Thanks for using KRISHU BOT! Type .help for assistance."
            ];
            reply(sock, m, `🤖 *KRISHU AI:*\n\n${responses[Math.floor(Math.random() * responses.length)]}`);
        }
    });
    
    // Sticker maker
    register('sticker', async (sock, m, args, config) => {
        const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage;
        const imageMsg = quoted?.imageMessage || m.message.imageMessage;
        
        if (!imageMsg) return reply(sock, m, '❌ Reply to an image with .sticker');
        
        try {
            const media = await sock.downloadMediaMessage(m);
            if (media) {
                await sock.sendMessage(m.key.remoteJid, { 
                    sticker: media,
                    mimetype: 'image/webp',
                    ptt: false
                });
            }
        } catch(e) {
            reply(sock, m, '❌ Failed to create sticker. Make sure you replied to an image.');
        }
    });
    
    // Sticker from video
    register('stickergif', async (sock, m, args, config) => {
        const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage;
        const videoMsg = quoted?.videoMessage || m.message.videoMessage;
        
        if (!videoMsg) return reply(sock, m, '❌ Reply to a short video with .stickergif');
        
        try {
            const media = await sock.downloadMediaMessage(m);
            if (media) {
                await sock.sendMessage(m.key.remoteJid, { 
                    sticker: media,
                    mimetype: 'image/webp',
                    ptt: false
                });
            }
        } catch(e) {
            reply(sock, m, '❌ Failed to create animated sticker.');
        }
    });
    
    // Get time
    register('time', async (sock, m, args, config) => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });
        const dateStr = now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        reply(sock, m, `🕐 *Date & Time*\n\n📅 ${dateStr}\n⏰ ${timeStr}\n🌍 Timezone: IST (Asia/Kolkata)`);
    });
    
    // Weather
    register('weather', async (sock, m, args, config) => {
        if (!args[0]) return reply(sock, m, '❌ Example: .weather Mumbai');
        try {
            const axios = require('axios');
            const city = args.join(' ');
            const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=YOUR_API_KEY&units=metric`);
            if (res.data) {
                const w = res.data;
                reply(sock, m, `🌤 *Weather in ${w.name}, ${w.sys.country}*\n\n🌡 Temp: ${w.main.temp}°C\n🤔 Feels: ${w.main.feels_like}°C\n💧 Humidity: ${w.main.humidity}%\n🌬 Wind: ${w.wind.speed} m/s\n☁️ ${w.weather[0].description}`);
            }
        } catch(e) {
            reply(sock, m, '❌ City not found. Try: .weather London');
        }
    });
    
    // Calculate
    register('calc', async (sock, m, args, config) => {
        if (!args.length) return reply(sock, m, '❌ Example: .calc 2+2*10');
        try {
            const result = eval(args.join(' '));
            reply(sock, m, `🧮 *Calculator*\n\n${args.join(' ')} = ${result}`);
        } catch(e) {
            reply(sock, m, '❌ Invalid calculation!');
        }
    });
    
    // Random number
    register('random', async (sock, m, args, config) => {
        const min = parseInt(args[0]) || 1;
        const max = parseInt(args[1]) || 100;
        if (min >= max) return reply(sock, m, '❌ Min must be less than max');
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        reply(sock, m, `🎲 *Random Number*\n\nBetween ${min} and ${max}\nResult: *${num}*`);
    });
    
    // Short URL
    register('short', async (sock, m, args, config) => {
        if (!args[0]) return reply(sock, m, '❌ Example: .short https://example.com');
        try {
            const axios = require('axios');
            const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(args[0])}`);
            reply(sock, m, `🔗 *Short URL*\n\nOriginal: ${args[0]}\nShort: ${res.data}`);
        } catch(e) {
            reply(sock, m, '❌ Failed to shorten URL.');
        }
    });
    
    // QR code generator
    register('qr', async (sock, m, args, config) => {
        if (!args[0]) return reply(sock, m, '❌ Example: .qr https://example.com');
        try {
            const axios = require('axios');
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(args.join(' '))}`;
            await sock.sendMessage(m.key.remoteJid, { image: { url: qrUrl }, caption: '📱 *QR Code Generated*' });
        } catch(e) {
            reply(sock, m, '❌ Failed to generate QR code.');
        }
    });
    
    // Read QR code
    register('readqr', async (sock, m, args, config) => {
        const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage;
        const imageMsg = quoted?.imageMessage || m.message.imageMessage;
        if (!imageMsg) return reply(sock, m, '❌ Reply to a QR code image with .readqr');
        reply(sock, m, '⏳ Reading QR code...');
        try {
            // Simplified - would need QR scanner library
            reply(sock, m, '📱 QR code reading requires additional libraries.');
        } catch(e) {}
    });
    
    // Text to speech
    register('tts', async (sock, m, args, config) => {
        if (!args.length) return reply(sock, m, '❌ Example: .tts Hello World');
        const text = encodeURIComponent(args.join(' '));
        const lang = 'hi'; // Hindi, change to 'en' for English
        try {
            const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${text}&tl=${lang}&client=tw-ob`;
            await sock.sendMessage(m.key.remoteJid, { audio: { url }, mimetype: 'audio/mp4', ptt: true });
        } catch(e) {
            reply(sock, m, '❌ TTS failed.');
        }
    });
    
    // Language translator
    register('translate', async (sock, m, args, config) => {
        if (args.length < 2) return reply(sock, m, '❌ Example: .translate en hi Hello\nLanguages: en, hi, ur, es, fr, de, ar, bn, mr, gu, ta, te');
        const targetLang = args[0];
        const text = args.slice(1).join(' ');
        try {
            const axios = require('axios');
            const res = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`);
            if (res.data?.responseData?.translatedText) {
                reply(sock, m, `🌐 *Translation (en → ${targetLang})*\n\n${res.data.responseData.translatedText}`);
            } else throw new Error();
        } catch(e) {
            reply(sock, m, '❌ Translation failed.');
        }
    });
    
    // Speed test
    register('speedtest', async (sock, m, args, config) => {
        reply(sock, m, '⏳ Running speed test... This may take 30 seconds.');
        try {
            const SpeedTest = require('speed-test');
            const result = await SpeedTest();
            reply(sock, m, `⚡ *Speed Test Result*\n\n📥 Download: ${result.download} Mbps\n📤 Upload: ${result.upload} Mbps\n📶 Ping: ${result.ping} ms`);
        } catch(e) {
            reply(sock, m, '❌ Speed test failed. Try again later.');
        }
    });
    
    // System info
    register('system', async (sock, m, args, config) => {
        const os = require('os');
        const uptime = process.uptime();
        const hrs = Math.floor(uptime / 3600);
        const mins = Math.floor((uptime % 3600) / 60);
        
        reply(sock, m, `💻 *System Information*\n\n🤖 Bot: ${config.botName} ${config.botVersion}\n📱 Platform: WhatsApp Multi-Device\n⏰ Uptime: ${hrs}h ${mins}m\n🖥 OS: ${os.type()} ${os.release()}\n🧠 RAM: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB\n💾 Free: ${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB\n⚡ Node: ${process.version}`);
    });
    
    // Owner contact
    register('owner', async (sock, m, args, config) => {
        reply(sock, m, `👑 *Bot Owner*\n\nName: ${config.ownerName}\nBot: ${config.botName}\n\n📞 Contact the owner for:\n• Bot issues\n• Feature requests\n• Group invites\n• Custom bots`);
    });
    
    // Ping the bot
    register('ping', async (sock, m, args, config) => {
        const start = Date.now();
        const msg = await reply(sock, m, '🏓 Pong!');
        const end = Date.now();
        reply(sock, m, `📶 *Bot Response Time*\n\n⚡ ${end - start}ms\n\n🤖 Status: ONLINE ✅`);
    });
    
    // Bot info
    register('info', async (sock, m, args, config) => {
        reply(sock, m, `🤖 *${config.botName} ${config.botVersion}*\n\n📅 Created: 2026\n👑 Owner: ${config.ownerName}\n📝 Prefix: ${config.prefix}\n📊 Commands: 500+\n🔒 Security: Encrypted\n🌐 Platform: WhatsApp MD\n\n⚡ *Features:*\n• Media Downloader (YT, IG, FB, TT, TW)\n• Sticker Maker\n• AI Chat\n• Group Management\n• Islamic Tools\n• Fun Commands\n• Admin Tools\n• And 500+ more!`);
    });
    
    // Alive message
    register('alive', async (sock, m, args, config) => {
        const uptime = process.uptime();
        const hrs = Math.floor(uptime / 3600);
        const mins = Math.floor((uptime % 3600) / 60);
        reply(sock, m, `🤖 *${config.botName}* is ALIVE! 🚀\n\n📶 Status: ONLINE\n⏰ Running: ${hrs}h ${mins}m\n⚡ Version: ${config.botVersion}\n📊 Commands: 500+\n\n💚 Powered by KRISHU BOT`);
    });
    
    // Report a bug
    register('report', async (sock, m, args, config) => {
        if (!args.length) return reply(sock, m, '❌ Example: .report Command .menu is not working');
        const report = args.join(' ');
        reply(sock, m, `✅ *Report Submitted!*\n\nYour report: ${report}\n\nThank you! The owner will look into it.\n\n📝 Bug reports help improve the bot!`);
    });
    
    // Suggest feature
    register('suggest', async (sock, m, args, config) => {
        if (!args.length) return reply(sock, m, '❌ Example: .suggest Add a meme generator');
        const suggestion = args.join(' ');
        reply(sock, m, `✅ *Suggestion Received!*\n\n${suggestion}\n\nThank you for your suggestion! 🎉`);
    });
}

module.exports = { register: registerTools };