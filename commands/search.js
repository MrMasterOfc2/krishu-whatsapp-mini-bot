// ============================================
// KRISHU BOT - SEARCH COMMANDS
// ============================================

const { reply, register } = require('./_core');

function registerSearch(register) {
    
    // Google search
    register('google', async (sock, m, args, config) => {
        if (!args.length) return reply(sock, m, '❌ Example: .google WhatsApp bot tutorial');
        const query = args.join(' ');
        reply(sock, m, `🔍 *Google Search*\n\nSearching for: ${query}\n\nhttps://www.google.com/search?q=${encodeURIComponent(query)}`);
    });
    
    // Wikipedia
    register('wiki', async (sock, m, args, config) => {
        if (!args.length) return reply(sock, m, '❌ Example: .wiki Artificial Intelligence');
        const query = args.join(' ');
        try {
            const axios = require('axios');
            const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
            if (res.data?.extract) {
                const text = res.data.extract.substring(0, 2000);
                reply(sock, m, `📚 *Wikipedia - ${res.data.title}*\n\n${text}\n\n🔗 ${res.data.content_urls?.desktop?.page || 'https://en.wikipedia.org'}`);
            } else throw new Error();
        } catch(e) {
            reply(sock, m, `🔍 *Search: ${query}*\n\nOpen: https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`);
        }
    });
    
    // YouTube search
    register('yts', async (sock, m, args, config) => {
        if (!args.length) return reply(sock, m, '❌ Example: .yts latest songs 2026');
        const query = args.join(' ');
        try {
            const axios = require('axios');
            const res = await axios.get(`https://api.akuari.my.id/search/youtube?query=${encodeURIComponent(query)}`);
            if (res.data?.result?.length) {
                let msg = `🎬 *YouTube Search*\n\nQuery: ${query}\n\n`;
                res.data.result.slice(0, 5).forEach((v, i) => {
                    msg += `${i+1}. ${v.title}\n   👁 ${v.views || 'N/A'} | ⏱ ${v.duration || 'N/A'}\n   🔗 https://youtu.be/${v.id}\n\n`;
                });
                reply(sock, m, msg);
            } else throw new Error();
        } catch(e) {
            reply(sock, m, `🔍 *YouTube Search: ${query}*\n\nhttps://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);
        }
    });
    
    // Image search
    register('image', async (sock, m, args, config) => {
        if (!args.length) return reply(sock, m, '❌ Example: .image beautiful mountains');
        const query = args.join(' ');
        try {
            const axios = require('axios');
            const res = await axios.get(`https://api.akuari.my.id/search/image?query=${encodeURIComponent(query)}`);
            if (res.data?.result?.length) {
                const images = res.data.result;
                const url = images[Math.floor(Math.random() * images.length)].url || images[Math.floor(Math.random() * images.length)];
                await sock.sendMessage(m.key.remoteJid, { image: { url }, caption: `🖼 *Image Search*\n\nQuery: ${query}` });
            } else throw new Error();
        } catch(e) {
            reply(sock, m, `🔍 *Image Search: ${query}*\n\nhttps://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`);
        }
    });
    
    // Lyrics search
    register('lyrics', async (sock, m, args, config) => {
        if (!args.length) return reply(sock, m, '❌ Example: .lyrics Shape of You');
        const query = args.join(' ');
        try {
            const axios = require('axios');
            const res = await axios.get(`https://api.akuari.my.id/search/lyrics?query=${encodeURIComponent(query)}`);
            if (res.data?.result?.lyrics) {
                const lyrics = res.data.result.lyrics.substring(0, 2000);
                reply(sock, m, `🎵 *Lyrics - ${res.data.result.title || query}*\n\n${lyrics}`);
            } else throw new Error();
        } catch(e) {
            reply(sock, m, '❌ Lyrics not found. Try: .lyrics [song name]');
        }
    });
    
    // News
    register('news', async (sock, m, args, config) => {
        try {
            const axios = require('axios');
            const category = args[0] || 'general';
            const res = await axios.get(`https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=demo`);
            if (res.data?.articles?.length) {
                let msg = `📰 *Top News - ${category.toUpperCase()}*\n\n`;
                res.data.articles.slice(0, 5).forEach((a, i) => {
                    msg += `${i+1}. ${a.title}\n   📍 ${a.source.name}\n   🔗 ${a.url}\n\n`;
                });
                reply(sock, m, msg);
            } else throw new Error();
        } catch(e) {
            reply(sock, m, '📰 *News*\n\nCheck: https://news.google.com');
        }
    });
    
    // Movie info
    register('movie', async (sock, m, args, config) => {
        if (!args.length) return reply(sock, m, '❌ Example: .movie Inception');
        const query = args.join(' ');
        try {
            const axios = require('axios');
            const res = await axios.get(`https://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=YOUR_KEY`);
            if (res.data?.Title) {
                reply(sock, m, `🎬 *Movie Info*\n\nTitle: ${res.data.Title}\nYear: ${res.data.Year}\nGenre: ${res.data.Genre}\nRating: ${res.data.imdbRating}/10\nDirector: ${res.data.Director}\nCast: ${res.data.Actors}\n\n📖 ${res.data.Plot}`);
            } else throw new Error();
        } catch(e) {
            reply(sock, m, '❌ Movie not found.');
        }
    });
}

module.exports = { register: registerSearch };