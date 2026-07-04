// ============================================
// KRISHU BOT - FUN & GAMES COMMANDS
// ============================================

const { reply, register } = require('./_core');

function registerFun(register) {
    
    // Truth or Dare
    register('truth', async (sock, m, args, config) => {
        const truths = [
            "What's your biggest secret?",
            "Who do you secretly hate?",
            "What's the most embarrassing thing you've done?",
            "Have you ever lied to your best friend?",
            "Who was your first crush?",
            "What's the worst date you've been on?",
            "Have you ever cheated on a test?",
            "What's your biggest fear?",
            "What's a dream you've given up on?",
            "Have you ever stolen something?"
        ];
        reply(sock, m, `🎯 *TRUTH*\n\n${truths[Math.floor(Math.random() * truths.length)]}\n\nYou must answer truthfully! 🤫`);
    });
    
    register('dare', async (sock, m, args, config) => {
        const dares = [
            "Send a funny selfie to the group!",
            "Text your crush 'I love ice cream more than you'",
            "Do 10 pushups right now!",
            "Sing a song and send voice note",
            "Change your profile picture to a funny meme for 1 hour",
            "Send 'I'm a potato' to 5 contacts",
            "Do a dance and record it",
            "Speak in a funny accent for next 3 messages",
            "Send your most embarrassing photo",
            "Compliment everyone in the group one by one"
        ];
        reply(sock, m, `🔥 *DARE*\n\n${dares[Math.floor(Math.random() * dares.length)]}\n\nNo backing out! 😈`);
    });
    
    // Meme generator
    register('meme', async (sock, m, args, config) => {
        try {
            const axios = require('axios');
            const res = await axios.get('https://meme-api.com/gimme');
            if (res.data?.url) {
                await sock.sendMessage(m.key.remoteJid, { 
                    image: { url: res.data.url },
                    caption: `😂 *Meme*\n\n${res.data.title || 'Funny Meme'}\n\nr/${res.data.subreddit || 'memes'}`
                });
            }
        } catch(e) {
            reply(sock, m, '😂 *Meme not available right now. Try later!*');
        }
    });
    
    // Jokes
    register('joke', async (sock, m, args, config) => {
        const jokes = [
            "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
            "What do you call a fake noodle? An impasta! 🍝",
            "Why did the scarecrow win an award? He was outstanding in his field! 🌾",
            "What do you call a bear with no teeth? A gummy bear! 🐻",
            "Why don't eggs tell jokes? They'd crack each other up! 🥚",
            "What do you call a fish wearing a bowtie? Sofishticated! 🐟",
            "Why did the math book look so sad? Because it had too many problems! 📚",
            "What do you call a sleeping bull? A bulldozer! 🐂",
            "Why did the bicycle fall over? Because it was two-tired! 🚲",
            "What do you call a factory that sells generally okay products? A satis-factory! 🏭"
        ];
        reply(sock, m, `😂 *Joke Time!*\n\n${jokes[Math.floor(Math.random() * jokes.length)]}`);
    });
    
    // Love calculator
    register('love', async (sock, m, args, config) => {
        if (args.length < 2) return reply(sock, m, '❌ Example: .love Krishu Priya');
        const [name1, name2] = [args[0], args.slice(1).join(' ')];
        const percentage = Math.floor(Math.random() * 100) + 1;
        
        let emoji = '💔';
        let msg = 'Not meant to be...';
        if (percentage > 90) { emoji = '💖'; msg = 'Perfect match! ❤️'; }
        else if (percentage > 75) { emoji = '💕'; msg = 'Great couple!'; }
        else if (percentage > 50) { emoji = '💗'; msg = 'There is hope!'; }
        else if (percentage > 30) { emoji = '💛'; msg = 'Friendship zone!'; }
        else { emoji = '💔'; msg = 'Better as friends!'; }
        
        reply(sock, m, `💘 *Love Calculator*\n\n${name1} ❤️ ${name2}\n\n${emoji} *${percentage}%* ${emoji}\n\n${msg}`);
    });
    
    // Horoscope
    register('horoscope', async (sock, m, args, config) => {
        const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
        if (!args[0] || !signs.includes(args[0].toLowerCase())) {
            return reply(sock, m, `❌ Example: .horoscope aries\n\nSigns: ${signs.join(', ')}`);
        }
        
        const readings = [
            "Today is a day of new opportunities. Embrace change and stay positive!",
            "The stars align in your favor. Good news is coming your way!",
            "Take a moment to reflect on your goals. The universe supports you.",
            "Communication is key today. Speak your truth with kindness.",
            "A pleasant surprise awaits you. Keep your heart open!",
            "Focus on your health and wellbeing today. Balance is important.",
            "Your creativity is at its peak. Channel it into something productive!",
            "Patience will pay off. Good things come to those who wait.",
            "Trust your intuition today. It will guide you right.",
            "New connections are forming. Someone important will enter your life."
        ];
        
        reply(sock, m, `⭐ *Horoscope - ${args[0].toUpperCase()}*\n\n${readings[Math.floor(Math.random() * readings.length)]}\n\n✨ Have a blessed day!`);
    });
    
    // Flip a coin
    register('coinflip', async (sock, m, args, config) => {
        const result = Math.random() > 0.5 ? 'Heads 🪙' : 'Tails 🪙';
        reply(sock, m, `🪙 *Coin Flip*\n\nResult: *${result}*`);
    });
    
    // Rock Paper Scissors
    register('rps', async (sock, m, args, config) => {
        const choices = ['rock', 'paper', 'scissors'];
        if (!args[0] || !choices.includes(args[0].toLowerCase())) {
            return reply(sock, m, '❌ Example: .rps rock\nChoices: rock, paper, scissors');
        }
        
        const botChoice = choices[Math.floor(Math.random() * 3)];
        const userChoice = args[0].toLowerCase();
        
        let result;
        if (userChoice === botChoice) result = "It's a tie! 🤝";
        else if (
            (userChoice === 'rock' && botChoice === 'scissors') ||
            (userChoice === 'paper' && botChoice === 'rock') ||
            (userChoice === 'scissors' && botChoice === 'paper')
        ) result = "You win! 🎉";
        else result = "Bot wins! 🤖";
        
        reply(sock, m, `✂️ *Rock Paper Scissors*\n\nYou: ${userChoice}\nBot: ${botChoice}\n\n*${result}*`);
    });
    
    // Quote generator
    register('quote', async (sock, m, args, config) => {
        const quotes = [
            '"The only way to do great work is to love what you do." - Steve Jobs',
            '"In the middle of difficulty lies opportunity." - Albert Einstein',
            '"Be yourself; everyone else is already taken." - Oscar Wilde',
            '"The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt',
            '"It does not matter how slowly you go as long as you do not stop." - Confucius',
            '"Believe you can and you are halfway there." - Theodore Roosevelt',
            '"The only impossible journey is the one you never begin." - Tony Robbins',
            '"What lies behind us and what lies before us are tiny matters compared to what lies within us." - Ralph Waldo Emerson'
        ];
        reply(sock, m, `💫 *Inspirational Quote*\n\n${quotes[Math.floor(Math.random() * quotes.length)]}`);
    });
    
    // 8 Ball
    register('8ball', async (sock, m, args, config) => {
        if (!args.length) return reply(sock, m, '❌ Ask a yes/no question!\nExample: .8ball Will I be rich?');
        const responses = [
            'Yes, definitely! 🎱',
            'No, not right now. 🎱',
            'Ask again later. 🎱',
            'Cannot predict now. 🎱',
            'Signs point to yes! 🎱',
            'Very doubtful. 🎱',
            'Without a doubt! 🎱',
            'My sources say no. 🎱',
            'Outlook good! 🎱',
            'Better not tell you now. 🎱',
            'Concentrate and ask again. 🎱',
            'As I see it, yes! 🎱'
        ];
        reply(sock, m, `🔮 *Magic 8 Ball*\n\nQuestion: ${args.join(' ')}\nAnswer: ${responses[Math.floor(Math.random() * responses.length)]}`);
    });
    
    // Calculate age
    register('age', async (sock, m, args, config) => {
        if (!args[0]) return reply(sock, m, '❌ Example: .age 2005-06-15');
        const birthDate = new Date(args[0]);
        if (isNaN(birthDate.getTime())) return reply(sock, m, '❌ Invalid date format! Use YYYY-MM-DD');
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
        reply(sock, m, `🎂 *Age Calculator*\n\nBorn: ${args[0]}\nAge: ${age} years old`);
    });
    
    // Reaction roles
    register('hug', async (sock, m, args, config) => {
        const target = args[0] ? `@${args[0].replace(/[^0-9]/g, '')}` : 'everyone';
        reply(sock, m, `🤗 *HUG*\n\n${target} you received a warm hug! 🫂\n\nSpread love! ❤️`);
    });
}

module.exports = { register: registerFun };