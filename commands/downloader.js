// ============================================
// KRISHU BOT - MEDIA DOWNLOADER COMMANDS
// YouTube, Instagram, Facebook, TikTok, Twitter
// Qualities: 144p, 360p, 420p, 720p, 1080p, 1440p
// ============================================

const { reply, register } = require('./_core');

async function instagramDownload(url) {
    try {
        const axios = require('axios');
        const res = await axios.get(`https://api.akuari.my.id/downloader/igdl?link=${encodeURIComponent(url)}`);
        if (res.data?.result) return { success: true, data: res.data.result };
        return { success: false };
    } catch { return { success: false }; }
}

async function tiktokDownload(url) {
    try {
        const axios = require('axios');
        const res = await axios.get(`https://api.akuari.my.id/downloader/tiktok?url=${encodeURIComponent(url)}`);
        if (res.data?.result) return { success: true, data: res.data.result };
        return { success: false };
    } catch { return { success: false }; }
}

async function facebookDownload(url) {
    try {
        const axios = require('axios');
        const res = await axios.get(`https://api.akuari.my.id/downloader/fb?url=${encodeURIComponent(url)}`);
        if (res.data?.result) return { success: true, data: res.data.result };
        return { success: false };
    } catch { return { success: false }; }
}

async function twitterDownload(url) {
    try {
        const axios = require('axios');
        const res = await axios.get(`https://api.akuari.my.id/downloader/twitter?url=${encodeURIComponent(url)}`);
        if (res.data?.result) return { success: true, data: res.data.result };
        return { success: false };
    } catch { return { success: false }; }
}

function registerDownloader(register) {
    // YouTube MP3
    register('ytmp3', async (sock, m, args, config) => {
        if (!args[0]) return reply(sock, m, '❌ Example: .ytmp3 https://youtu.be/xxxxx');
        reply(sock, m, '⏳ Downloading audio...');
        try {
            const axios = require('axios');
            const res = await axios.get(`https://api.akuari.my.id/downloader/ytmp3?url=${encodeURIComponent(args[0])}`);
            if (res.data?.result?.download?.url) {
                await sock.sendMessage(m.key.remoteJid, { 
                    audio: { url: res.data.result.download.url }, 
                    mimetype: 'audio/mp4'
                });
            } else throw new Error('No result');
        } catch(e) {
            reply(sock, m, '❌ Download failed. Try another link.');
        }
    });
    
    // YouTube MP4 with quality selection
    register('ytmp4', async (sock, m, args, config) => {
        if (!args[0]) return reply(sock, m, '❌ Example: .ytmp4 https://youtu.be/xxxxx\nQualities: 144, 360, 420, 720, 1080, 1440');
        
        let url = args[0];
        let quality = '720';
        
        if (args[1] && ['144','360','420','720','1080','1440'].includes(args[1])) {
            quality = args[1];
        }
        
        reply(sock, m, `⏳ Downloading ${quality}p video...`);
        try {
            const axios = require('axios');
            const res = await axios.get(`https://api.akuari.my.id/downloader/ytmp4?url=${encodeURIComponent(url)}&quality=${quality}`);
            if (res.data?.result?.download?.url) {
                await sock.sendMessage(m.key.remoteJid, { 
                    video: { url: res.data.result.download.url },
                    caption: `🎬 *YouTube Downloader*\n📹 Quality: ${quality}p\n📁 Size: ${res.data.result.download.size || 'Unknown'}`
                });
            } else throw new Error('No result');
        } catch(e) {
            reply(sock, m, '❌ Download failed. Try: .ytmp4 [url] [quality]');
        }
    });
    
    // Instagram downloader
    register('ig', async (sock, m, args, config) => {
        if (!args[0]) return reply(sock, m, '❌ Example: .ig https://instagram.com/p/xxxx');
        reply(sock, m, '⏳ Downloading Instagram...');
        const result = await instagramDownload(args[0]);
        if (result.success && result.data?.media) {
            for (const media of (Array.isArray(result.data.media) ? result.data.media : [result.data.media])) {
                const url = media.url || media;
                if (url.includes('.mp4')) {
                    await sock.sendMessage(m.key.remoteJid, { video: { url } });
                } else {
                    await sock.sendMessage(m.key.remoteJid, { image: { url } });
                }
            }
        } else {
            reply(sock, m, '❌ Download failed.');
        }
    });
    
    // TikTok downloader
    register('tiktok', async (sock, m, args, config) => {
        if (!args[0]) return reply(sock, m, '❌ Example: .tiktok https://tiktok.com/@user/video/xxxx');
        reply(sock, m, '⏳ Downloading TikTok...');
        const result = await tiktokDownload(args[0]);
        if (result.success && result.data?.media) {
            const url = (Array.isArray(result.data.media) ? result.data.media[0] : result.data.media).url || result.data.media;
            await sock.sendMessage(m.key.remoteJid, { video: { url }, caption: '🎵 TikTok Downloader' });
        } else {
            reply(sock, m, '❌ Download failed.');
        }
    });
    
    // Facebook downloader
    register('fb', async (sock, m, args, config) => {
        if (!args[0]) return reply(sock, m, '❌ Example: .fb https://facebook.com/xxxx/videos/xxxx');
        reply(sock, m, '⏳ Downloading Facebook video...');
        const result = await facebookDownload(args[0]);
        if (result.success && result.data?.media) {
            const url = (Array.isArray(result.data.media) ? result.data.media[0] : result.data.media).url || result.data.media;
            await sock.sendMessage(m.key.remoteJid, { video: { url }, caption: '📘 Facebook Downloader' });
        } else {
            reply(sock, m, '❌ Download failed.');
        }
    });
    
    // Twitter/X downloader
    register('twitter', async (sock, m, args, config) => {
        if (!args[0]) return reply(sock, m, '❌ Example: .twitter https://x.com/user/status/xxxx');
        reply(sock, m, '⏳ Downloading Twitter media...');
        const result = await twitterDownload(args[0]);
        if (result.success && result.data?.media) {
            const url = (Array.isArray(result.data.media) ? result.data.media[0] : result.data.media).url || result.data.media;
            await sock.sendMessage(m.key.remoteJid, { video: { url }, caption: '🐦 Twitter Downloader' });
        } else {
            reply(sock, m, '❌ Download failed.');
        }
    });
    
    // Pinterest downloader
    register('pinterest', async (sock, m, args, config) => {
        if (!args[0]) return reply(sock, m, '❌ Example: .pinterest https://pin.it/xxxx');
        reply(sock, m, '⏳ Downloading Pinterest...');
        try {
            const axios = require('axios');
            const res = await axios.get(`https://api.akuari.my.id/downloader/pinterest?url=${encodeURIComponent(args[0])}`);
            if (res.data?.result?.media) {
                await sock.sendMessage(m.key.remoteJid, { image: { url: res.data.result.media } });
            } else throw new Error();
        } catch(e) {
            reply(sock, m, '❌ Download failed.');
        }
    });
}

module.exports = { register: registerDownloader };