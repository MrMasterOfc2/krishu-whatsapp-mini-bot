const { reply, register } = require('./_core');

function registerAI(register) {

    register('gemini', async (sock, m, args, config) => {
        if (!args.length) return reply(sock, m, '❌ Example: .gemini What is quantum computing?');
        reply(sock, m, `🤖 *Gemini AI*\n\nQuery: ${args.join(' ')}\n\n🔍 Processing...\n\n(Gemini API key required for full AI response. Configure in config.js)`);
    });

    register('meta', async (sock, m, args, config) => {
        if (!args.length) return reply(sock, m, '❌ Example: .meta Write a poem about coding');
        reply(sock, m, `🤖 *Meta AI (LLaMA Mode)*\n\nQuery: ${args.join(' ')}\n\nThis is a simulated AI response from KRISHU BOT.\nFor real AI integration, add your API key in config.js`);
    });

    register('chatgpt', async (sock, m, args, config) => {
        if (!args.length) return reply(sock, m, '❌ Example: .chatgpt How to make a website?');
        const responses = [
            "Great question! Here's what I know from my training data...",
            "Based on common knowledge, I'd suggest...",
            "Here's a helpful answer to your query...",
            "Thanks for asking! The answer involves several steps..."
        ];
        reply(sock, m, `🧠 *ChatGPT Mode*\n\n${responses[Math.floor(Math.random() * responses.length)]}\n\n(Add OpenAI API key in config.js for real AI) 💡`);
    });

    register('imagine', async (sock, m, args, config) => {
        if (!args.length) return reply(sock, m, '❌ Example: .imagine a beautiful sunset over mountains');
        reply(sock, m, `🎨 *AI Image Generator*\n\nPrompt: ${args.join(' ')}\n\n⏳ Generating image...\n\n(API key required for image generation. Try: https://craiyon.com)`);
    });

    register('code', async (sock, m, args, config) => {
        if (!args.length) return reply(sock, m, '❌ Example: .code python hello world');
        const lang = args[0].toLowerCase();
        const task = args.slice(1).join(' ');
        const codeSamples = {
            python: `# Python - ${task}\n\ndef main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()`,
            javascript: `// JavaScript - ${task}\n\nfunction main() {\n    console.log("Hello, World!");\n}\n\nmain();`,
            html: `<!-- HTML - ${task} -->\n<!DOCTYPE html>\n<html>\n<head><title>Page</title></head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>`
        };
        reply(sock, m, `💻 *Code Generator*\n\nLanguage: ${lang}\n\n\`\`\`${lang}\n${codeSamples[lang] || '// Code sample not available for ' + lang}\n\`\`\``);
    });
}

module.exports = { register: registerAI };