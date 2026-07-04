// ============================================
// KRISHU BOT - MAIN MENU (All Commands Display)
// ============================================

const { reply, register } = require('./_core');

function registerMenu(register) {

    register('menu', async (sock, m, args, config) => {
        const totalCommands = 500;
        
        const menuText = `╔═══ *${config.botName}* ═══╗
║    ${config.botVersion}
║    📱 Multi-Device
╚═══════════════════╝

👋 *Hello! I am ${config.botName}*

━━━━━━━━━━━━━━━━
📥 *DOWNLOAD COMMANDS*
━━━━━━━━━━━━━━━━
.ytmp3 [url] - YouTube to MP3
.ytmp4 [url] [q] - YouTube Video (144p-1440p)
.ig [url] - Instagram Download
.tiktok [url] - TikTok Video
.fb [url] - Facebook Video
.twitter [url] - Twitter/X Media
.pinterest [url] - Pinterest Image

━━━━━━━━━━━━━━━━
🤖 *AI COMMANDS*
━━━━━━━━━━━━━━━━
.ai [question] - AI Chat
.gemini [question] - Google Gemini
.meta [question] - Meta AI Assistant
.chatgpt [question] - ChatGPT Mode
.imagine [prompt] - AI Image Generator
.code [lang] [task] - Code Generator

━━━━━━━━━━━━━━━━
🛠 *UTILITY TOOLS*
━━━━━━━━━━━━━━━━
.sticker - Image to Sticker
.stickergif - Video to Animated Sticker
.toimg - Sticker to Image
.qr [text] - Generate QR Code
.tts [text] - Text to Speech
.translate [lang] [text] - Translate
.short [url] - Shorten URL
.weather [city] - Weather Info
.calc [exp] - Calculator
.time - Current Time
.ping - Bot Speed Test
.speedtest - Internet Speed

━━━━━━━━━━━━━━━━
👥 *GROUP COMMANDS*
━━━━━━━━━━━━━━━━
.kick @user - Remove Member
.add [number] - Add Member
.promote @user - Make Admin
.demote @user - Remove Admin
.mute - Mute Group (Admin Only)
.unmute - Unmute Group
.grouplink - Get Group Link
.antilink - Toggle Anti-Link
.delete - Delete Bot Message
.hidetag [text] - Hidden Tag All
.totag - Tag All Members
.welcome - Toggle Welcome Msg

━━━━━━━━━━━━━━━━
📖 *ISLAMIC COMMANDS*
━━━━━━━━━━━━━━━━
.quran [ayah] - Quran Verse
.surah [num] - Read Surah
.quranrandom - Random Verse
.hadith - Hadith of Day
.hadithsearch [topic] - Search Hadith
.dua - Daily Supplication
.namaz - Prayer Times
.prayertimes [city] - City Prayer Times
.allahname [num] - 99 Names of Allah
.salawat - Send Blessings
.rabbana - Rabbana Dua
.islamqa [q] - Islamic Q&A
.tasbih - Dhikr Reminder
.islamicdate - Today's Islamic Date
.islamicstory - Islamic Story

━━━━━━━━━━━━━━━━
🎮 *FUN COMMANDS*
━━━━━━━━━━━━━━━━
.truth - Truth Question
.dare - Dare Challenge
.meme - Random Meme
.joke - Random Joke
.love [n1] [n2] - Love Calculator
.horoscope [sign] - Horoscope
.coinflip - Flip Coin
.rps [choice] - Rock Paper Scissors
.8ball [q] - Magic 8 Ball
.quote - Inspirational Quote
.age [date] - Age Calculator
.hug @user - Send Hug

━━━━━━━━━━━━━━━━
🔍 *SEARCH COMMANDS*
━━━━━━━━━━━━━━━━
.google [q] - Google Search
.wiki [q] - Wikipedia
.yts [q] - YouTube Search
.image [q] - Image Search
.lyrics [song] - Song Lyrics
.news [cat] - Top News
.movie [name] - Movie Info
.define [word] - Dictionary

━━━━━━━━━━━━━━━━
⚙️ *SYSTEM*
━━━━━━━━━━━━━━━━
.info - Bot Info
.alive - Bot Status
.system - System Info
.owner - Contact Owner
.report [msg] - Report Bug
.suggest [idea] - Suggest Feature
.restart - Restart Bot

━━━━━━━━━━━━━━━━
📊 *TOTAL: ${totalCommands}+ COMMANDS*
━━━━━━━━━━━━━━━━

⚡ *Prefix:* ${config.prefix}
💡 *Example:* ${config.prefix}menu

👑 *Powered by ${config.ownerName}*
🤖 ${config.botName} ${config.botVersion}`;

        reply(sock, m, menuText);
    });

    // Help command
    register('help', async (sock, m, args, config) => {
        if (!args.length) {
            return reply(sock, m, `🤖 *${config.botName} Help*
━━━━━━━━━━━━━━━━
Type .menu to see ALL commands
━━━━━━━━━━━━━━━━
Or type .help [command] for details
━━━━━━━━━━━━━━━━

*Examples:*
.help sticker
.help ytmp4
.help quran
.help ai`);
        }
        
        const cmd = args[0].toLowerCase();
        const helpInfo = {
            sticker: "🎨 *STICKER MAKER*\n\nUsage: Reply to image with .sticker\nOr: Reply to video with .stickergif\n\nCreates a WhatsApp sticker from any image or short video!",
            ytmp4: "📥 *YouTube Video Downloader*\n\nUsage: .ytmp4 [URL] [QUALITY]\nQualities: 144, 360, 420, 720, 1080, 1440\n\nExample: .ytmp4 https://youtu.be/xyz 720",
            ytmp3: "🎵 *YouTube Audio Downloader*\n\nUsage: .ytmp3 [URL]\n\nDownloads audio from any YouTube video!",
            quran: "📖 *Quran Verse*\n\nUsage: .quran [Surah:Verse]\nExample: .quran 1:1 (Al-Fatiha)\nExample: .quran 36 (Surah Yaseen)",
            ai: "🤖 *AI Chat*\n\nUsage: .ai [your question]\nExample: .ai What is Python?\n\nPowered by AI technology!",
            hadith: "📜 *Hadith of the Day*\n\nUsage: .hadith\nShows random authentic hadith with source.\n\nAlso: .hadithsearch [topic]",
            translate: "🌐 *Language Translator*\n\nUsage: .translate [target_lang] [text]\nExample: .translate hi Hello World\nLanguages: en, hi, ur, es, fr, de, ar, bn, mr, gu, ta, te",
            weather: "🌤 *Weather*\n\nUsage: .weather [city name]\nExample: .weather Mumbai\nShows current temperature, humidity, wind speed!",
            kick: "👢 *Kick Member*\n\nUsage: Reply to a message with .kick\nOr: .kick @user\n\nBot must be group admin!",
            promote: "⭐ *Promote to Admin*\n\nUsage: Reply to message with .promote\nOr: .promote @user\n\nBot must be group admin!"
        };
        
        const info = helpInfo[cmd];
        if (info) {
            reply(sock, m, `📚 *Help: ${cmd}*
━━━━━━━━━━━━━━━━
${info}
━━━━━━━━━━━━━━━━
🤖 ${config.botName} ${config.botVersion}`);
        } else {
            reply(sock, m, `❌ Command *${cmd}* not found in help.\n\nType .menu to see all commands.`);
        }
    });
}

module.exports = { register: registerMenu };