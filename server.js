const express = require('express');
const fs = require('fs');
const path = require('path');
const pino = require('pino');
const {
    Browsers,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    makeWASocket,
    useMultiFileAuthState,
} = require('baileys');

const config = require('./config');
const commandCore = require('./commands/_core');

const app = express();
const PORT = process.env.PORT || config.port || 3000;
const logger = pino({ level: process.env.LOG_LEVEL || 'silent' });

let activeSocket = null;
let currentAuthDir = null;
let pairingCodeData = null;
let pairingInProgress = false;
let reconnectTimer = null;
let commandsLoaded = false;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function disconnectStatusCode(error) {
    return error?.output?.statusCode || error?.data?.statusCode || error?.statusCode;
}

function cleanPhoneNumber(value) {
    return String(value || '').replace(/\D/g, '');
}

async function loadCommands() {
    if (commandsLoaded) return;
    await commandCore.loadAll(null, config);
    commandsLoaded = true;
    console.log(`Loaded ${commandCore.getCommands().length} commands`);
}

async function handleMessage(sock, message) {
    if (!message.message || message.key.fromMe || message.key.remoteJid === 'status@broadcast') return;

    const text = message.message.conversation
        || message.message.extendedTextMessage?.text
        || message.message.imageMessage?.caption
        || message.message.videoMessage?.caption
        || '';

    const prefixes = Array.from(new Set([config.prefix || '.', '.', '!']));
    const prefix = prefixes.find(item => text.startsWith(item));
    if (!prefix) return;

    const args = text.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;

    const command = commandCore.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(sock, message, args, config);
    } catch (error) {
        console.error(`Command ${commandName} failed:`, error.message);
        try {
            await sock.sendMessage(
                message.key.remoteJid,
                { text: 'Command failed. Please try again.' },
                { quoted: message },
            );
        } catch (_) {}
    }
}

async function startSocket(authDir) {
    await loadCommands();

    const { state, saveCreds } = await useMultiFileAuthState(authDir);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger,
        printQRInTerminal: false,
        browser: Browsers.ubuntu('Chrome'),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        markOnlineOnConnect: true,
        syncFullHistory: false,
    });

    activeSocket = sock;
    currentAuthDir = authDir;

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify' || !messages?.length) return;
        for (const message of messages) {
            await handleMessage(sock, message);
        }
    });

    sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
        if (connection === 'open') {
            activeSocket = sock;
            pairingCodeData = null;
            console.log(`WhatsApp connected as ${sock.user?.id || 'unknown'}`);
            return;
        }

        if (connection !== 'close' || activeSocket !== sock) return;

        activeSocket = null;
        const statusCode = disconnectStatusCode(lastDisconnect?.error);
        const loggedOut = statusCode === DisconnectReason.loggedOut || statusCode === 401;

        if (loggedOut) {
            pairingCodeData = null;
            console.log('WhatsApp logged out. Generate a new pairing code.');
            return;
        }

        clearTimeout(reconnectTimer);
        reconnectTimer = setTimeout(() => {
            if (!activeSocket && currentAuthDir) {
                startSocket(currentAuthDir).catch(error => {
                    console.error('Reconnect failed:', error.message);
                });
            }
        }, 5000);
    });

    return { sock, registered: state.creds.registered };
}

app.post('/api/pair', async (req, res) => {
    const phone = cleanPhoneNumber(req.body?.phone || req.query?.phone);

    if (phone.length < 10 || phone.length > 15) {
        return res.status(400).json({
            success: false,
            message: 'Enter a valid phone number with country code (10-15 digits).',
        });
    }

    if (activeSocket?.user) {
        return res.json({
            success: true,
            connected: true,
            code: 'ALREADY_CONNECTED',
            message: 'The bot is already connected.',
        });
    }

    if (pairingInProgress) {
        return res.status(409).json({
            success: false,
            message: 'A pairing request is already in progress. Try again shortly.',
        });
    }

    pairingInProgress = true;

    try {
        if (activeSocket) {
            try {
                activeSocket.end(new Error('Starting a new pairing session'));
            } catch (_) {}
            activeSocket = null;
        }

        const authDir = path.join(__dirname, `auth_${phone}`);
        const { sock, registered } = await startSocket(authDir);

        if (registered && sock.user) {
            return res.json({
                success: true,
                connected: true,
                code: 'ALREADY_CONNECTED',
                message: 'This session is already connected.',
            });
        }

        const code = await sock.requestPairingCode(phone);
        pairingCodeData = { phone, code, timestamp: Date.now() };

        return res.json({
            success: true,
            code,
            formattedCode: code.match(/.{1,4}/g)?.join('-') || code,
            message: 'Pairing code generated successfully.',
        });
    } catch (error) {
        console.error('Pairing failed:', error.message);
        return res.status(500).json({
            success: false,
            message: `Pairing failed: ${error.message}`,
        });
    } finally {
        pairingInProgress = false;
    }
});

app.get('/api/status', (req, res) => {
    const connected = Boolean(activeSocket?.user);

    res.json({
        success: true,
        online: connected,
        connected,
        number: activeSocket?.user?.id?.split(':')[0] || null,
        activeUsers: connected ? 1 : 0,
        botName: config.botName,
        version: config.botVersion,
        serverName: config.serverName,
        uptime: process.uptime(),
        commandCount: commandCore.getCommands().length,
    });
});

app.get('/api/pairing-status', (req, res) => {
    res.json({
        success: true,
        connected: Boolean(activeSocket?.user),
        number: activeSocket?.user?.id?.split(':')[0] || null,
        pairingCode: pairingCodeData?.code || null,
        pairingPhone: pairingCodeData?.phone || null,
    });
});

app.post('/api/disconnect', async (req, res) => {
    try {
        if (activeSocket) {
            await activeSocket.logout();
            activeSocket = null;
        }

        if (currentAuthDir && fs.existsSync(currentAuthDir)) {
            fs.rmSync(currentAuthDir, { recursive: true, force: true });
        }

        currentAuthDir = null;
        pairingCodeData = null;
        return res.json({ success: true, message: 'Bot disconnected.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

app.use((error, req, res, next) => {
    console.error('Server error:', error.message);
    if (res.headersSent) return next(error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
});

app.listen(PORT, '0.0.0.0', async () => {
    console.log(`${config.botName} ${config.botVersion} running on port ${PORT}`);

    try {
        await loadCommands();

        const existingSession = fs.readdirSync(__dirname, { withFileTypes: true })
            .find(entry => entry.isDirectory() && entry.name.startsWith('auth_'));

        if (existingSession) {
            startSocket(path.join(__dirname, existingSession.name)).catch(error => {
                console.error('Could not restore WhatsApp session:', error.message);
            });
        }
    } catch (error) {
        console.error('Startup initialization failed:', error.message);
    }
});

module.exports = app;
