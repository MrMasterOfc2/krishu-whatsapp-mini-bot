// ============================================
// KRISHU BOT - ADMIN & GROUP COMMANDS
// ============================================

const { reply, register } = require('./_core');

function registerAdmin(register) {
    
    // Group kick
    register('kick', async (sock, m, args, config) => {
        const isGroup = m.key.remoteJid.endsWith('@g.us');
        if (!isGroup) return reply(sock, m, '❌ This command is for groups only!');
        
        const mentions = m.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (mentions.length === 0) return reply(sock, m, '❌ Mention someone to kick!');
        
        try {
            for (const jid of mentions) {
                await sock.groupParticipantsUpdate(m.key.remoteJid, [jid], 'remove');
            }
            reply(sock, m, `✅ Kicked ${mentions.length} member(s)`);
        } catch(e) {
            reply(sock, m, '❌ Failed to kick. Make sure I am admin!');
        }
    });
    
    // Group add
    register('add', async (sock, m, args, config) => {
        const isGroup = m.key.remoteJid.endsWith('@g.us');
        if (!isGroup) return reply(sock, m, '❌ This command is for groups only!');
        if (!args[0]) return reply(sock, m, '❌ Example: .add 91xxxxxxxxxx');
        
        try {
            const jid = `${args[0].replace(/[^0-9]/g, '')}@s.whatsapp.net`;
            await sock.groupParticipantsUpdate(m.key.remoteJid, [jid], 'add');
            reply(sock, m, '✅ User added to group!');
        } catch(e) {
            reply(sock, m, '❌ Failed to add user.');
        }
    });
    
    // Promote to admin
    register('promote', async (sock, m, args, config) => {
        const isGroup = m.key.remoteJid.endsWith('@g.us');
        if (!isGroup) return reply(sock, m, '❌ This command is for groups only!');
        
        const mentions = m.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (mentions.length === 0) return reply(sock, m, '❌ Mention someone to promote!');
        
        try {
            await sock.groupParticipantsUpdate(m.key.remoteJid, mentions, 'promote');
            reply(sock, m, '✅ Member(s) promoted to admin!');
        } catch(e) {
            reply(sock, m, '❌ Failed to promote.');
        }
    });
    
    // Demote admin
    register('demote', async (sock, m, args, config) => {
        const isGroup = m.key.remoteJid.endsWith('@g.us');
        if (!isGroup) return reply(sock, m, '❌ This command is for groups only!');
        
        const mentions = m.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (mentions.length === 0) return reply(sock, m, '❌ Mention someone to demote!');
        
        try {
            await sock.groupParticipantsUpdate(m.key.remoteJid, mentions, 'demote');
            reply(sock, m, '✅ Member(s) demoted!');
        } catch(e) {
            reply(sock, m, '❌ Failed to demote.');
        }
    });
    
    // Mute group
    register('mute', async (sock, m, args, config) => {
        const isGroup = m.key.remoteJid.endsWith('@g.us');
        if (!isGroup) return reply(sock, m, '❌ This command is for groups only!');
        try {
            await sock.groupSettingUpdate(m.key.remoteJid, 'announcement');
            reply(sock, m, '🔇 Group muted! Only admins can send messages.');
        } catch(e) {
            reply(sock, m, '❌ Failed to mute.');
        }
    });
    
    // Unmute group
    register('unmute', async (sock, m, args, config) => {
        const isGroup = m.key.remoteJid.endsWith('@g.us');
        if (!isGroup) return reply(sock, m, '❌ This command is for groups only!');
        try {
            await sock.groupSettingUpdate(m.key.remoteJid, 'not_announcement');
            reply(sock, m, '🔊 Group unmuted! Everyone can send messages.');
        } catch(e) {
            reply(sock, m, '❌ Failed to unmute.');
        }
    });
    
    // Group link
    register('grouplink', async (sock, m, args, config) => {
        const isGroup = m.key.remoteJid.endsWith('@g.us');
        if (!isGroup) return reply(sock, m, '❌ This command is for groups only!');
        try {
            const code = await sock.groupInviteCode(m.key.remoteJid);
            reply(sock, m, `🔗 *Group Link:*\nhttps://chat.whatsapp.com/${code}`);
        } catch(e) {
            reply(sock, m, '❌ Failed to get group link.');
        }
    });
    
    // Delete bot message
    register('delete', async (sock, m, args, config) => {
        if (m.message.extendedTextMessage?.contextInfo?.stanzaId) {
            const msgId = m.message.extendedTextMessage.contextInfo.stanzaId;
            const participant = m.message.extendedTextMessage.contextInfo.participant || m.key.remoteJid;
            try {
                await sock.sendMessage(m.key.remoteJid, { delete: { remoteJid: m.key.remoteJid, fromMe: true, id: msgId, participant } });
            } catch(e) {}
        }
    });
    
    // Antilink toggle
    register('antilink', async (sock, m, args, config) => {
        config.features.antilink = !config.features.antilink;
        reply(sock, m, `${config.features.antilink ? '✅' : '❌'} Antilink ${config.features.antilink ? 'ENABLED' : 'DISABLED'}`);
    });
}

module.exports = { register: registerAdmin };