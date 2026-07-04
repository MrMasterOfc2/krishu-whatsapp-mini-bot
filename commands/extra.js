// ============================================
// KRISHU BOT - BONUS / SPECIAL COMMANDS
// ============================================

const { reply, register } = require('./_core');

function registerExtra(register) {

    // WhatsApp channel info
    register('channel', async (sock, m, args, config) => {
        reply(sock, m, `📢 *KRISHU BOT Channel*

Follow for updates:
🔗 Coming Soon!

🤖 Bot: ${config.botName} ${config.botVersion}`);
    });

    // Bot support group
    register('support', async (sock, m, args, config) => {
        reply(sock, m, `🆘 *Support*

📞 Contact: ${config.ownerName}
📧 Email: krishu.bot.2026@gmail.com

💡 For issues, type .report [issue]
💬 For suggestions, type .suggest [idea]`);
    });

    // Donate
    register('donate', async (sock, m, args, config) => {
        reply(sock, m, `💚 *Support KRISHU BOT*

This bot is 100% FREE for everyone!

You can support by:
⭐ Sharing with friends
⭐ Giving suggestions
⭐ Reporting bugs

🙏 Thank you for using ${config.botName}!`);
    });

    // Bot version
    register('version', async (sock, m, args, config) => {
        reply(sock, m, `📱 *${config.botName} ${config.botVersion}*

📅 Release: July 2026
📊 Total Commands: 500+
🔧 Build: Production
⚡ Status: Stable

🆕 Latest Features:
• Media Downloader (144p-1440p)
• AI Integration
• 100+ Islamic Commands
• Group Management Tools
• Fun & Games`);
    });

    // Server status
    register('server', async (sock, m, args, config) => {
        const os = require('os');
        const uptime = process.uptime();
        const hrs = Math.floor(uptime / 3600);
        const mins = Math.floor((uptime % 3600) / 60);
        const secs = Math.floor(uptime % 60);
        const memory = process.memoryUsage();
        const memoryMB = (memory.heapUsed / 1024 / 1024).toFixed(2);
        
        reply(sock, m, `🖥 *Server Status*
╔══════════════════╗
║ ${config.serverName}
╚══════════════════╝

⏰ Uptime: ${hrs}h ${mins}m ${secs}s
💾 RAM: ${memoryMB} MB used
⚡ CPU: ${os.cpus().length} cores
🌐 Platform: Render.com
📦 Node: ${process.version}
🤖 Bot: ${config.botName} ${config.botVersion}

✅ All systems operational!`);
    });

    // Auto react toggle (simulated)
    register('autoreact', async (sock, m, args, config) => {
        config.features.autoreact = !config.features.autoreact;
        reply(sock, m, `${config.features.autoreact ? '✅' : '❌'} Auto React ${config.features.autoreact ? 'ENABLED' : 'DISABLED'}`);
    });

    // Antispam toggle
    register('antispam', async (sock, m, args, config) => {
        config.features.antispam = !config.features.antispam;
        reply(sock, m, `${config.features.antispam ? '✅' : '❌'} AntiSpam ${config.features.antispam ? 'ENABLED' : 'DISABLED'}`);
    });

    // Antifake toggle
    register('antifake', async (sock, m, args, config) => {
        config.features.antifake = !config.features.antifake;
        reply(sock, m, `${config.features.antifake ? '✅' : '❌'} AntiFake ${config.features.antifake ? 'ENABLED' : 'DISABLED'}`);
    });

    // Session info
    register('session', async (sock, m, args, config) => {
        const user = sock.user;
        if (user) {
            reply(sock, m, `📱 *Session Info*

📞 Number: ${user.id?.split(':')[0] || 'Connected'}
👤 Name: ${user.name || user.verifiedName || 'Connected'}
🔗 Platform: WhatsApp Multi-Device
⚡ Status: Active

✅ Session is healthy!`);
        } else {
            reply(sock, m, '❌ No active session. Please link a device first.');
        }
    });

    // Clear chat
    register('clear', async (sock, m, args, config) => {
        reply(sock, m, '🗑 Chat clearing is not available via bot for privacy reasons.\n\nYou can clear chat manually from WhatsApp settings.');
    });

    // ID
    register('id', async (sock, m, args, config) => {
        const sender = m.key.remoteJid;
        const isGroup = sender.endsWith('@g.us');
        const userJid = m.key.participant || sender;
        
        reply(sock, m, `🆔 *ID Information*

📱 Your JID: ${userJid}
${isGroup ? `👥 Group JID: ${sender}` : ''}
🔢 Type: ${isGroup ? 'Group Chat' : 'Private Chat'}

💡 This ID is used for bot operations.`);
    });

    // Poll creator
    register('poll', async (sock, m, args, config) => {
        if (args.length < 3) return reply(sock, m, '❌ Example: .poll Question | Option1 | Option2 | Option3');
        
        const pollText = args.join(' ');
        const parts = pollText.split('|').map(p => p.trim());
        const question = parts[0];
        const options = parts.slice(1);
        
        if (options.length < 2) return reply(sock, m, '❌ At least 2 options needed!');
        if (options.length > 10) return reply(sock, m, '❌ Max 10 options allowed!');
        
        try {
            await sock.sendMessage(m.key.remoteJid, {
                poll: {
                    name: question,
                    values: options,
                    selectableCount: 1
                }
            });
        } catch(e) {
            reply(sock, m, '❌ Failed to create poll.');
        }
    });

    // Multi-select poll
    register('multipoll', async (sock, m, args, config) => {
        if (args.length < 3) return reply(sock, m, '❌ Example: .multipoll Select fruits | Apple | Banana | Orange');
        
        const pollText = args.join(' ');
        const parts = pollText.split('|').map(p => p.trim());
        const question = parts[0];
        const options = parts.slice(1);
        
        if (options.length < 2) return reply(sock, m, '❌ At least 2 options needed!');
        
        try {
            await sock.sendMessage(m.key.remoteJid, {
                poll: {
                    name: question,
                    values: options,
                    selectableCount: options.length
                }
            });
        } catch(e) {
            reply(sock, m, '❌ Failed to create poll.');
        }
    });

    // List all available commands count by category
    register('cmdlist', async (sock, m, args, config) => {
        reply(sock, m, `📊 *Command Statistics*

📥 Download Commands: 12
🤖 AI Commands: 6
🛠 Utility Tools: 35
👥 Group Commands: 25
📖 Islamic Commands: 30
🎮 Fun Commands: 30
🔍 Search Commands: 15
⚙️ System Commands: 10
✨ Special Commands: 50+
🔄 Converter Commands: 15
🎨 Media Tools: 20
🌐 Other Commands: 250+

━━━━━━━━━━━━━━━━
📊 *TOTAL: 500+ COMMANDS*
━━━━━━━━━━━━━━━━

Type .menu to see all commands!`);
    });

    // Fake number test
    register('test', async (sock, m, args, config) => {
        reply(sock, m, `✅ *Bot Test Successful!*

🤖 ${config.botName} is working perfectly!
⚡ Status: ONLINE
📱 Platform: WhatsApp MD
🆔 Your number is active

💡 If you see this, the bot is 100% working!
🙏 Thank you for using ${config.botName}`);
    });

    // Creator credits
    register('credits', async (sock, m, args, config) => {
        reply(sock, m, `🌟 *KRISHU BOT Credits*

👑 Creator: ${config.ownerName}
🤖 Bot: ${config.botName} ${config.botVersion}
📅 Created: July 2026
📊 Version: 2.0

💚 Special Thanks:
• Allah SWT
• All users who support this bot

🔧 Built with:
• Baileys (WhatsApp API)
• Node.js
• Express.js
• Render.com

🙏 JazakAllah Khair for using this bot!`);
    });
}

module.exports = { register: registerExtra };