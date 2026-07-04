// ============================================
// KRISHU BOT - EXTRA GROUP FEATURES
// ============================================

const { reply, register } = require('./_core');

function registerGroup(register) {

    // Tag all members
    register('totag', async (sock, m, args, config) => {
        const isGroup = m.key.remoteJid.endsWith('@g.us');
        if (!isGroup) return reply(sock, m, '❌ Group only command!');
        
        try {
            const groupMeta = await sock.groupMetadata(m.key.remoteJid);
            const participants = groupMeta.participants;
            const mentions = participants.map(p => p.id);
            const message = args.length ? args.join(' ') : '👋 @all';
            
            await sock.sendMessage(m.key.remoteJid, { 
                text: `📢 ${message}`,
                mentions: mentions
            });
        } catch(e) {
            reply(sock, m, '❌ Failed to tag all.');
        }
    });

    // Hidden tag
    register('hidetag', async (sock, m, args, config) => {
        const isGroup = m.key.remoteJid.endsWith('@g.us');
        if (!isGroup) return reply(sock, m, '❌ Group only command!');
        if (!args.length) return reply(sock, m, '❌ Example: .hidetag Hello everyone');
        
        try {
            const groupMeta = await sock.groupMetadata(m.key.remoteJid);
            const participants = groupMeta.participants;
            const mentions = participants.map(p => p.id);
            
            await sock.sendMessage(m.key.remoteJid, { 
                text: args.join(' '),
                mentions: mentions
            });
        } catch(e) {
            reply(sock, m, '❌ Failed.');
        }
    });

    // Welcome message toggle
    register('welcome', async (sock, m, args, config) => {
        config.features.welcome = !config.features.welcome;
        reply(sock, m, `✅ Welcome message ${config.features.welcome ? 'ENABLED' : 'DISABLED'}`);
    });

    // Group info
    register('groupinfo', async (sock, m, args, config) => {
        const isGroup = m.key.remoteJid.endsWith('@g.us');
        if (!isGroup) return reply(sock, m, '❌ Group only command!');
        
        try {
            const meta = await sock.groupMetadata(m.key.remoteJid);
            const admins = meta.participants.filter(p => p.admin);
            const total = meta.participants.length;
            
            reply(sock, m, `👥 *Group Information*
╔══════════════════╗
║ ${meta.subject}
╚══════════════════╝

📝 *Name:* ${meta.subject}
👤 *Created by:* ${meta.owner || meta.subjectOwner || 'Unknown'}
📅 *Created:* ${meta.creation ? new Date(meta.creation * 1000).toLocaleDateString() : 'N/A'}
👥 *Members:* ${total}
⭐ *Admins:* ${admins.length}
🔒 *Restrict:* ${meta.restrict ? 'Yes' : 'No'}
💬 *Announce:* ${meta.announce ? 'Admins Only' : 'Everyone'}

🔗 Group link available via .grouplink`);
        } catch(e) {
            reply(sock, m, '❌ Failed to get group info.');
        }
    });

    // Profile photo
    register('getpp', async (sock, m, args, config) => {
        let jid = m.key.remoteJid;
        
        // If replied to someone
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid;
        if (mentioned?.length) jid = mentioned[0];
        else if (args[0]) jid = `${args[0].replace(/[^0-9]/g, '')}@s.whatsapp.net`;
        
        try {
            const ppUrl = await sock.profilePictureUrl(jid, 'image');
            await sock.sendMessage(m.key.remoteJid, { 
                image: { url: ppUrl },
                caption: `🖼 Profile Picture`
            });
        } catch(e) {
            reply(sock, m, '❌ No profile picture found or user not in contacts.');
        }
    });

    // Set group description
    register('setdesc', async (sock, m, args, config) => {
        const isGroup = m.key.remoteJid.endsWith('@g.us');
        if (!isGroup) return reply(sock, m, '❌ Group only!');
        if (!args.length) return reply(sock, m, '❌ Example: .setdesc Welcome to our group!');
        
        try {
            await sock.groupUpdateDescription(m.key.remoteJid, args.join(' '));
            reply(sock, m, '✅ Group description updated!');
        } catch(e) {
            reply(sock, m, '❌ Failed. Make sure I am admin.');
        }
    });

    // Set group name
    register('setname', async (sock, m, args, config) => {
        const isGroup = m.key.remoteJid.endsWith('@g.us');
        if (!isGroup) return reply(sock, m, '❌ Group only!');
        if (!args.length) return reply(sock, m, '❌ Example: .setname My Awesome Group');
        
        try {
            await sock.groupUpdateSubject(m.key.remoteJid, args.join(' '));
            reply(sock, m, '✅ Group name updated!');
        } catch(e) {
            reply(sock, m, '❌ Failed. Make sure I am admin.');
        }
    });

    // Invite via link
    register('invite', async (sock, m, args, config) => {
        const isGroup = m.key.remoteJid.endsWith('@g.us');
        if (!isGroup) return reply(sock, m, '❌ Group only!');
        
        try {
            const code = await sock.groupInviteCode(m.key.remoteJid);
            const inviteLink = `https://chat.whatsapp.com/${code}`;
            await sock.sendMessage(m.key.remoteJid, { text: `🔗 *Group Invite Link*\n\n${inviteLink}` });
        } catch(e) {
            reply(sock, m, '❌ Failed to get invite link.');
        }
    });

    // Revoke group link
    register('revoke', async (sock, m, args, config) => {
        const isGroup = m.key.remoteJid.endsWith('@g.us');
        if (!isGroup) return reply(sock, m, '❌ Group only!');
        
        try {
            await sock.groupRevokeInvite(m.key.remoteJid);
            reply(sock, m, '🔄 Group invite link revoked! Send .invite for new link.');
        } catch(e) {
            reply(sock, m, '❌ Failed to revoke link.');
        }
    });

    // Accept all pending requests
    register('acceptall', async (sock, m, args, config) => {
        const isGroup = m.key.remoteJid.endsWith('@g.us');
        if (!isGroup) return reply(sock, m, '❌ Group only!');
        
        try {
            const requests = await sock.groupRequestParticipantsList(m.key.remoteJid);
            if (requests.length === 0) return reply(sock, m, '✅ No pending requests.');
            
            for (const req of requests) {
                await sock.groupRequestParticipantsUpdate(m.key.remoteJid, [req.jid], 'approve');
            }
            reply(sock, m, `✅ Accepted ${requests.length} join request(s)!`);
        } catch(e) {
            reply(sock, m, '❌ Failed to accept requests.');
        }
    });

    // Reject all
    register('rejectall', async (sock, m, args, config) => {
        const isGroup = m.key.remoteJid.endsWith('@g.us');
        if (!isGroup) return reply(sock, m, '❌ Group only!');
        
        try {
            const requests = await sock.groupRequestParticipantsList(m.key.remoteJid);
            if (requests.length === 0) return reply(sock, m, '✅ No pending requests.');
            
            for (const req of requests) {
                await sock.groupRequestParticipantsUpdate(m.key.remoteJid, [req.jid], 'reject');
            }
            reply(sock, m, `❌ Rejected ${requests.length} join request(s)!`);
        } catch(e) {
            reply(sock, m, '❌ Failed to reject.');
        }
    });
}

module.exports = { register: registerGroup };