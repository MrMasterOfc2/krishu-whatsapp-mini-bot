const { reply, register } = require('./_core');

function registerConverter(register) {

    register('toimg', async (sock, m, args, config) => {
        const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted?.stickerMessage) return reply(sock, m, '❌ Reply to a sticker with .toimg');
        reply(sock, m, '⏳ Converting sticker to image...');
        try {
            const media = await sock.downloadMediaMessage(m);
            if (media) await sock.sendMessage(m.key.remoteJid, { image: media });
        } catch(e) {
            reply(sock, m, '❌ Conversion failed.');
        }
    });

    register('togif', async (sock, m, args, config) => {
        reply(sock, m, '🎬 GIF conversion: Send the video and I will convert it! (Requires ffmpeg on server)');
    });

    register('currency', async (sock, m, args, config) => {
        if (args.length < 3) return reply(sock, m, '❌ Example: .currency 100 usd inr');
        const [amount, from, , to] = args;
        try {
            const axios = require('axios');
            const res = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from.toUpperCase()}`);
            if (res.data?.rates?.[to.toUpperCase()]) {
                const converted = (parseFloat(amount) * res.data.rates[to.toUpperCase()]).toFixed(2);
                reply(sock, m, `💰 *Currency Converter*\n\n${amount} ${from.toUpperCase()} = ${converted} ${to.toUpperCase()}`);
            } else throw new Error();
        } catch(e) {
            reply(sock, m, '❌ Conversion failed. Check currency codes (USD, INR, EUR, etc.)');
        }
    });

    register('base64', async (sock, m, args, config) => {
        if (args.length < 2) return reply(sock, m, '❌ Example: .base64 encode Hello\nOr: .base64 decode SGVsbG8=');
        const mode = args[0].toLowerCase();
        const text = args.slice(1).join(' ');
        if (mode === 'encode') reply(sock, m, `🔐 *Base64 Encode*\n\n${Buffer.from(text).toString('base64')}`);
        else if (mode === 'decode') {
            try {
                reply(sock, m, `🔓 *Base64 Decode*\n\n${Buffer.from(text, 'base64').toString('utf-8')}`);
            } catch { reply(sock, m, '❌ Invalid base64 string'); }
        } else reply(sock, m, '❌ Use: .base64 encode/decode [text]');
    });

    register('color', async (sock, m, args, config) => {
        if (!args[0]) return reply(sock, m, '❌ Example: .color #ff0000');
        const color = args[0];
        reply(sock, m, `🎨 *Color Info - ${color}*\n\nRGB: ${parseInt(color.slice(1,3),16)}, ${parseInt(color.slice(3,5),16)}, ${parseInt(color.slice(5,7),16)}\n\nPreview: https://www.colorhexa.com/${color.slice(1)}`);
    });

    register('json', async (sock, m, args, config) => {
        if (!args.length) return reply(sock, m, '❌ Example: .json {"name":"Krishu"}');
        try {
            const parsed = JSON.parse(args.join(' '));
            reply(sock, m, `📋 *JSON Formatter*\n\n\`\`\`json\n${JSON.stringify(parsed, null, 2)}\n\`\`\``);
        } catch {
            reply(sock, m, '❌ Invalid JSON format!');
        }
    });
}

module.exports = { register: registerConverter };