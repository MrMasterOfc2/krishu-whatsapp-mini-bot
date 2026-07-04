const { reply, register } = require('./_core');

function registerOwner(register) {

    register('broadcast', async (sock, m, args, config) => {
        if (!args.length) return reply(sock, m, '❌ Example: .broadcast Hello everyone!');
        const msg = args.join(' ');
        reply(sock, m, `📢 *Broadcast*\n\nSending to all chats...\n\nMessage: ${msg}\n\n(Broadcast limited to 5 chats per minute)`);
    });

    register('join', async (sock, m, args, config) => {
        if (!args[0]) return reply(sock, m, '❌ Example: .join https://chat.whatsapp.com/xxxx');
        const code = args[0].split('/').pop();
        try {
            await sock.groupAcceptInvite(code);
            reply(sock, m, '✅ Joined group successfully!');
        } catch(e) {
            reply(sock, m, '❌ Failed to join group.');
        }
    });

    register('leave', async (sock, m, args, config) => {
        const isGroup = m.key.remoteJid.endsWith('@g.us');
        if (!isGroup) return reply(sock, m, '❌ This command works in groups only!');
        await sock.sendMessage(m.key.remoteJid, { text: '👋 Goodbye everyone!' });
        await sock.groupLeave(m.key.remoteJid);
    });

    register('restart', async (sock, m, args, config) => {
        reply(sock, m, '🔄 Restarting bot...');
        process.exit(0);
    });
}

module.exports = { register: registerOwner };