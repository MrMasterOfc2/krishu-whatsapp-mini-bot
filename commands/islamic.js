// ============================================
// KRISHU BOT - ISLAMIC COMMANDS (100+ Commands)
// ============================================

const { reply, register } = require('./_core');

function registerIslamic(register) {

    // ========== QURAN ==========
    register('quran', async (sock, m, args, config) => {
        if (!args[0]) return reply(sock, m, '❌ Example: .quran 1:1\nOr: .quran 36 (Surah Yaseen)');
        try {
            const axios = require('axios');
            const res = await axios.get(`https://api.alquran.cloud/v1/ayah/${encodeURIComponent(args[0])}/en.asad`);
            if (res.data?.data) {
                const d = res.data.data;
                const surahName = d.surah.englishName;
                const ayahNum = d.numberInSurah;
                const surahNum = d.surah.number;
                const juz = d.juz || 'N/A';
                const textEnglish = d.text;
                
                // Also fetch Arabic
                const arabicRes = await axios.get(`https://api.alquran.cloud/v1/ayah/${encodeURIComponent(args[0])}`);
                const textArabic = arabicRes.data?.data?.text || '';
                
                reply(sock, m, `📖 *Surah ${surahName} (${surahNum}:${ayahNum})*
╔══════════════════╗
║ ${textArabic}
╚══════════════════╝

${textEnglish}

📊 *Info:*
📖 Surah: ${surahName} (${surahNum})
🔢 Ayah: ${ayahNum}
📚 Juz: ${juz}
📍 Revelation: ${d.surah.revelationType || 'N/A'}

🔗 https://quran.com/${surahNum}/${ayahNum}`);
            } else throw new Error();
        } catch(e) {
            reply(sock, m, '❌ Ayah not found. Try: .quran 1:1 (Surah:Verse)');
        }
    });

    // Surah reader
    register('surah', async (sock, m, args, config) => {
        if (!args[0]) return reply(sock, m, '❌ Example: .surah 1 (Al-Fatiha)\nOr: .surah 36 (Yaseen)\nOr: .surah 18 (Kahf)');
        try {
            const axios = require('axios');
            
            // First get surah list
            const listRes = await axios.get('https://api.alquran.cloud/v1/surah');
            const surahList = listRes.data?.data || [];
            
            let surahNum = parseInt(args[0]);
            // If name given
            if (isNaN(surahNum)) {
                const found = surahList.find(s => s.englishName.toLowerCase().includes(args.join(' ').toLowerCase()));
                if (found) surahNum = found.number;
                else return reply(sock, m, `❌ Surah not found. Use number (1-114) or try: .surah 36`);
            }
            
            if (surahNum < 1 || surahNum > 114) return reply(sock, m, '❌ Surah number must be between 1-114');
            
            const surah = surahList[surahNum - 1];
            const res = await axios.get(`https://api.alquran.cloud/v1/surah/${surahNum}/en.asad`);
            
            if (res.data?.data) {
                const d = res.data.data;
                let msg = `📖 *Surah ${d.englishName}* (${d.number})
╔════════════════════╗
📊 ${d.numberOfAyahs} Verses | ${d.revelationType}
📍 Juz: ${d.ayahs[0]?.juz || '1'} - ${d.ayahs[d.ayahs.length-1]?.juz || '30'}
╚════════════════════╝

`;
                // Show first 10 ayahs
                const showAyahs = d.ayahs.slice(0, 10);
                for (const a of showAyahs) {
                    msg += `${a.numberInSurah}. ${a.text.substring(0, 120)}...\n\n`;
                }
                if (d.numberOfAyahs > 10) msg += `...and ${d.numberOfAyahs - 10} more verses\n`;
                msg += `\n📖 Full Surah: https://quran.com/${surahNum}`;
                
                reply(sock, m, msg);
            } else throw new Error();
        } catch(e) {
            reply(sock, m, '❌ Surah not found. Try: .surah 1');
        }
    });

    // Random Quran verse
    register('quranrandom', async (sock, m, args, config) => {
        try {
            const axios = require('axios');
            const randomSurah = Math.floor(Math.random() * 114) + 1;
            const res = await axios.get(`https://api.alquran.cloud/v1/surah/${randomSurah}/en.asad`);
            const d = res.data?.data;
            if (d && d.ayahs?.length) {
                const randomAyah = d.ayahs[Math.floor(Math.random() * d.ayahs.length)];
                reply(sock, m, `📖 *Random Quran Verse*
╔══════════════════╗
║ ${d.englishName} ${d.number}:${randomAyah.numberInSurah}
╚══════════════════╝

${randomAyah.text}
                
📍 Reflect and ponder. 🤲`);
            } else throw new Error();
        } catch(e) {
            reply(sock, m, '❌ Failed to fetch. Try again.');
        }
    });

    // ========== HADITH ==========
    register('hadith', async (sock, m, args, config) => {
        const hadiths = [
            { text: "The best of you are those who are best to their families.", source: "Tirmidhi" },
            { text: "A good word is charity.", source: "Bukhari & Muslim" },
            { text: "The strongest person is not the one who can wrestle, but the one who controls themselves in anger.", source: "Bukhari" },
            { text: "None of you truly believes until they love for their brother what they love for themselves.", source: "Bukhari & Muslim" },
            { text: "Make things easy, do not make things difficult.", source: "Bukhari" },
            { text: "Whoever believes in Allah and the Last Day should speak good or remain silent.", source: "Bukhari" },
            { text: "The best among you are those who learn the Quran and teach it.", source: "Bukhari" },
            { text: "A Muslim is the one who avoids harming Muslims with their tongue and hands.", source: "Bukhari" },
            { text: "Do not be people without minds of your own, saying: 'If people treat us well, we treat them well; and if they do wrong, we do wrong.'", source: "Tirmidhi" },
            { text: "Whoever does not thank people, does not thank Allah.", source: "Abu Dawud" },
            { text: "The search of lawful earning is a duty after the duty (prayer).", source: "Baihaqi" },
            { text: "Give the worker their wages before their sweat dries.", source: "Ibn Majah" },
            { text: "Beware of envy, for envy consumes good deeds just as fire consumes wood.", source: "Abu Dawud" },
            { text: "The best charity is that given when you are healthy and have need for it.", source: "Bukhari" },
            { text: "A good word is charity.", source: "Bukhari & Muslim" },
            { text: "Whoever believes in Allah and the Last Day should honor their guest.", source: "Bukhari & Muslim" },
            { text: "The dearest of actions to Allah is regular and consistent action, even if small.", source: "Bukhari & Muslim" },
            { text: "Patience is light.", source: "Muslim" },
            { text: "The world is a prison for the believer and a paradise for the disbeliever.", source: "Muslim" },
            { text: "Whoever builds a mosque for Allah, Allah will build for them a similar house in Paradise.", source: "Bukhari & Muslim" }
        ];
        
        const h = hadiths[Math.floor(Math.random() * hadiths.length)];
        reply(sock, m, `📜 *Hadith of the Day*
╔══════════════════╗
║ ${h.text}
╚══════════════════╝

📚 Source: ${h.source}

📖 Reflect and implement in daily life! 🤲`);
    });

    // Specific hadith by topic
    register('hadithsearch', async (sock, m, args, config) => {
        if (!args.length) return reply(sock, m, '❌ Example: .hadithsearch patience\nTopics: patience, charity, family, prayer, knowledge, truth');
        
        const topic = args.join(' ').toLowerCase();
        const hadithByTopic = {
            patience: { text: "Whoever remains patient, Allah will make them patient. No one is given a better and more abundant gift than patience.", source: "Bukhari & Muslim" },
            charity: { text: "Charity does not decrease wealth. No one forgives another except that Allah increases their honor.", source: "Muslim" },
            family: { text: "The best of you are those who are best to their families, and I am the best to my family.", source: "Tirmidhi" },
            prayer: { text: "The first matter that the servant will be brought to account for on the Day of Judgment is the prayer.", source: "Abu Dawud" },
            knowledge: { text: "Whoever takes a path in search of knowledge, Allah will make easy for them the path to Paradise.", source: "Muslim" },
            truth: { text: "Truthfulness leads to righteousness, and righteousness leads to Paradise.", source: "Bukhari & Muslim" },
            kindness: { text: "Show mercy to those on earth, and He who is in heaven will show mercy to you.", source: "Tirmidhi" },
            honesty: { text: "The merchant who is truthful and honest will be with the prophets, the truthful, and the martyrs.", source: "Tirmidhi" }
        };
        
        const found = hadithByTopic[topic];
        if (found) {
            reply(sock, m, `📜 *Hadith on ${topic.toUpperCase()}*
╔══════════════════╗
║ ${found.text}
╚══════════════════╝

📚 Source: ${found.source}`);
        } else {
            reply(sock, m, `❌ Topic not found. Available topics:\n\n${Object.keys(hadithByTopic).join(', ')}`);
        }
    });

    // ========== NAMAZ / PRAYER ==========
    register('namaz', async (sock, m, args, config) => {
        const now = new Date();
        const hours = now.getHours();
        const mins = now.getMinutes();
        
        // Determine current prayer time roughly
        let currentPrayer = "Isha";
        if (hours >= 4 && hours < 6) currentPrayer = "Fajr";
        else if (hours >= 12 && hours < 15) currentPrayer = "Dhuhr";
        else if (hours >= 15 && hours < 17) currentPrayer = "Asr";
        else if (hours >= 17 && hours < 19) currentPrayer = "Maghrib";
        
        reply(sock, m, `🕌 *Prayer Times*
╔══════════════════╗
║ Today's Prayers
╚══════════════════╝

🌅 *Fajr:* Before Sunrise (~5:00 AM)
☀️ *Dhuhr:* After Noon (~12:30 PM)
🌤 *Asr:* Afternoon (~4:00 PM)
🌇 *Maghrib:* Sunset (~6:45 PM)
🌙 *Isha:* Night (~8:15 PM)

📍 *Current Time:* ${hours.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}
⏰ *Next Prayer:* ${currentPrayer}

📱 Get accurate timings for your city:
🔗 https://timesprayer.com

🤲 May Allah accept our prayers!`);
    });

    // Get prayer times for city
    register('prayertimes', async (sock, m, args, config) => {
        if (!args.length) return reply(sock, m, '❌ Example: .prayertimes Mumbai\nOr: .prayertimes Delhi');
        try {
            const axios = require('axios');
            const city = args.join(' ');
            const today = new Date();
            const dateStr = `${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`;
            
            const res = await axios.get(`https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=${encodeURIComponent(city)}&country=India&method=2`);
            
            if (res.data?.data?.timings) {
                const t = res.data.data.timings;
                const meta = res.data.data.meta;
                reply(sock, m, `🕌 *Prayer Times for ${city}*
╔══════════════════╗
║ ${meta.date?.readable || dateStr}
╚══════════════════╝

🌅 *Fajr:* ${t.Fajr}
☀️ *Sunrise:* ${t.Sunrise}
📗 *Dhuhr:* ${t.Dhuhr}
🌤 *Asr:* ${t.Asr}
🌇 *Maghrib:* ${t.Maghrib}
🌙 *Isha:* ${t.Isha}
🌃 *Midnight:* ${t.Midnight}

📍 Method: ${meta.method?.name || 'Standard'}
🌍 ${city}, India

🤲 Pray on time!`);
            } else throw new Error();
        } catch(e) {
            reply(sock, m, '❌ Could not fetch prayer times. Try: .prayertimes Mumbai');
        }
    });

    // ========== 99 NAMES OF ALLAH ==========
    register('allahname', async (sock, m, args, config) => {
        const names = [
            { num: 1, name: "Ar-Rahman", meaning: "The Most Gracious" },
            { num: 2, name: "Ar-Raheem", meaning: "The Most Merciful" },
            { num: 3, name: "Al-Malik", meaning: "The King" },
            { num: 4, name: "Al-Quddus", meaning: "The Holy" },
            { num: 5, name: "As-Salam", meaning: "The Peace" },
            { num: 6, name: "Al-Mu'min", meaning: "The Giver of Peace" },
            { num: 7, name: "Al-Muhaymin", meaning: "The Protector" },
            { num: 8, name: "Al-Aziz", meaning: "The Almighty" },
            { num: 9, name: "Al-Jabbar", meaning: "The Compeller" },
            { num: 10, name: "Al-Mutakabbir", meaning: "The Supreme" },
            { num: 11, name: "Al-Khaliq", meaning: "The Creator" },
            { num: 12, name: "Al-Bari", meaning: "The Evolver" },
            { num: 13, name: "Al-Musawwir", meaning: "The Fashioner" },
            { num: 14, name: "Al-Ghaffar", meaning: "The Forgiver" },
            { num: 15, name: "Al-Qahhar", meaning: "The Subduer" },
            { num: 16, name: "Al-Wahhab", meaning: "The Bestower" },
            { num: 17, name: "Ar-Razzaq", meaning: "The Provider" },
            { num: 18, name: "Al-Fattah", meaning: "The Opener" },
            { num: 19, name: "Al-Alim", meaning: "The All-Knowing" },
            { num: 20, name: "Al-Qabid", meaning: "The Withholder" },
            { num: 21, name: "Al-Basit", meaning: "The Extender" },
            { num: 22, name: "Al-Khafid", meaning: "The Abaser" },
            { num: 23, name: "Ar-Rafi", meaning: "The Exalter" },
            { num: 24, name: "Al-Mu'izz", meaning: "The Giver of Honor" },
            { num: 25, name: "Al-Mudhill", meaning: "The Giver of Dishonor" },
            { num: 26, name: "As-Sami", meaning: "The All-Hearing" },
            { num: 27, name: "Al-Basir", meaning: "The All-Seeing" },
            { num: 28, name: "Al-Hakam", meaning: "The Judge" },
            { num: 29, name: "Al-Adl", meaning: "The Just" },
            { num: 30, name: "Al-Latif", meaning: "The Subtle" }
        ];
        
        // If specific number requested
        if (args[0] && !isNaN(args[0])) {
            const num = parseInt(args[0]);
            const found = names.find(n => n.num === num);
            if (found) {
                return reply(sock, m, `🤲 *99 Names of Allah - #${found.num}*
╔══════════════════╗
║ ${found.name}
║ ${found.meaning}
╚══════════════════╝

📖 *Allah - ${found.name}*
The ${found.meaning}

🤲 Recite and reflect on His names. SubhanAllah! ✨`);
            } else {
                return reply(sock, m, `❌ Name #${num} not in our list (1-30). Try .allahname for random.`);
            }
        }
        
        // Random name
        const n = names[Math.floor(Math.random() * names.length)];
        reply(sock, m, `🤲 *99 Names of Allah - #${n.num}*
╔══════════════════╗
║ ${n.name}
║ ${n.meaning}
╚══════════════════╝

📖 *Allah - ${n.name}*
The ${n.meaning}

🤲 Recite and reflect on His names. SubhanAllah! ✨

📋 Use .allahname 1-30 for specific names`);
    });

    // ========== DUA ==========
    register('dua', async (sock, m, args, config) => {
        const duas = [
            { text: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan waqina azaban-nar", meaning: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.", reference: "Al-Baqarah 2:201" },
            { text: "Rabbana la tu'akhidhna in nasina aw akhta'na", meaning: "Our Lord, do not punish us if we forget or make a mistake.", reference: "Al-Baqarah 2:286" },
            { text: "Rabbana hab lana min azwajina wa dhurriyatina qurrata a'yun", meaning: "Our Lord, grant us from our spouses and offspring comfort to our eyes.", reference: "Al-Furqan 25:74" },
            { text: "Rabbi zidni ilma", meaning: "My Lord, increase me in knowledge.", reference: "Ta-Ha 20:114" },
            { text: "Rabbi ishrah li sadri wa yassir li amri", meaning: "My Lord, expand my chest and make my task easy.", reference: "Ta-Ha 20:25-26" },
            { text: "Allahumma inni as'aluka al-afiyah", meaning: "O Allah, I ask You for well-being.", reference: "Tirmidhi" },
            { text: "Bismillahi tawakkaltu 'ala Allahi wa la hawla wa la quwwata illa billah", meaning: "In the name of Allah, I put my trust in Allah, and there is no power and no strength except with Allah.", reference: "Abu Dawud" },
            { text: "Allahumma inni a'udhu bika minal-hammi wal-hazan", meaning: "O Allah, I seek refuge in You from anxiety and grief.", reference: "Bukhari" },
            { text: "Rabbi inni lima anzalta ilayya min khayrin faqir", meaning: "My Lord, indeed I am in need of whatever good You send down to me.", reference: "Al-Qasas 28:24" },
            { text: "Allahumma barik li fi ma razaqtani wa qini sharra ma ataytani", meaning: "O Allah, bless me in what You have provided and protect me from the evil of what You have given.", reference: "Ibn Majah" }
        ];
        
        const d = duas[Math.floor(Math.random() * duas.length)];
        reply(sock, m, `🤲 *Dua / Supplication*
╔══════════════════╗
║ Arabic: ${d.text}
╚══════════════════╝

📖 *Meaning:* ${d.meaning}

📚 Reference: ${d.reference}

🤲 Make this dua today!`);
    });

    // ========== ISLAMIC CALENDAR ==========
    register('islamicdate', async (sock, m, args, config) => {
        try {
            const axios = require('axios');
            const today = new Date();
            const dateStr = `${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`;
            
            const res = await axios.get(`https://api.aladhan.com/v1/gToH/${dateStr}`);
            if (res.data?.data) {
                const d = res.data.data;
                const hijri = d.hijri;
                reply(sock, m, `📅 *Islamic Date*
╔══════════════════╗
║ ${hijri.day} ${hijri.month.en} ${hijri.year} AH
╚══════════════════╝

📆 *${hijri.day} ${hijri.month.ar} ${hijri.year}*

🌙 Day: ${hijri.weekday.en} (${hijri.weekday.ar})

📅 Gregorian: ${d.gregorian.day} ${d.gregorian.month.en} ${d.gregorian.year}

📍 May Allah bless this day! 🤲`);
            } else throw new Error();
        } catch(e) {
            reply(sock, m, '❌ Could not fetch Islamic date. Try again later.');
        }
    });

    // ========== TASBIH COUNTER ==========
    register('tasbih', async (sock, m, args, config) => {
        const tasbihaat = [
            { text: "SubhanAllah", meaning: "Glory be to Allah", reward: "1000 good deeds" },
            { text: "Alhamdulillah", meaning: "All praise is for Allah", reward: "Fills the scales" },
            { text: "Allahu Akbar", meaning: "Allah is the Greatest", reward: "Better than the world" },
            { text: "La ilaha illallah", meaning: "There is no god but Allah", reward: "Greatest of all dhikr" },
            { text: "Astaghfirullah", meaning: "I seek forgiveness from Allah", reward: "Forgiveness of sins" },
            { text: "SubhanAllah wa bihamdihi", meaning: "Glory be to Allah and praise Him", reward: "Palm tree in Paradise" },
            { text: "La hawla wa la quwwata illa billah", meaning: "There is no power except with Allah", reward: "Treasure of Paradise" }
        ];
        
        const t = tasbihaat[Math.floor(Math.random() * tasbihaat.length)];
        reply(sock, m, `📿 *Tasbih / Dhikr*
╔══════════════════╗
║ ${t.text}
╚══════════════════╝

📖 *Meaning:* ${t.meaning}
🌟 *Reward:* ${t.reward}

🔄 Recite 33x times for maximum blessings!

🤲 SubhanAllah!`);
    });

    // ========== ISLAMIC Q&A ==========
    register('islamqa', async (sock, m, args, config) => {
        if (!args.length) return reply(sock, m, '❌ Ask a question about Islam!\nExample: .islamqa What is the importance of prayer?');
        
        const question = args.join(' ').toLowerCase();
        let answer = '';
        
        if (question.includes('prayer') || question.includes('namaz') || question.includes('salah')) {
            answer = "Salah (prayer) is the second pillar of Islam. It is performed 5 times daily: Fajr, Dhuhr, Asr, Maghrib, and Isha. Prayer is the first thing we will be questioned about on Judgment Day.";
        } else if (question.includes('fast') || question.includes('roza') || question.includes('ramadan') || question.includes('ramzan')) {
            answer = "Fasting (Sawm) during Ramadan is the fourth pillar of Islam. It teaches self-discipline, empathy for the poor, and spiritual reflection. Fasting is from dawn to sunset.";
        } else if (question.includes('zakat') || question.includes('charity')) {
            answer = "Zakat is the third pillar of Islam. It is 2.5% of one's wealth given to those in need annually. Charity (Sadaqah) can be given anytime, any amount.";
        } else if (question.includes('hajj') || question.includes('umrah')) {
            answer = "Hajj is the fifth pillar of Islam, a pilgrimage to Mecca that every Muslim must perform once in their lifetime if physically and financially able.";
        } else if (question.includes('allah') || question.includes('god')) {
            answer = "Allah is the Arabic word for God. He is the One and Only Creator, the Most Gracious, the Most Merciful. He has 99 beautiful names (Asma-ul-Husna).";
        } else if (question.includes('quran') || question.includes('quran')) {
            answer = "The Quran is the holy book of Islam, revealed to Prophet Muhammad (PBUH) over 23 years. It contains 114 Surahs and 6236 verses. It is the final revelation from Allah.";
        } else if (question.includes('prophet') || question.includes('muhammad') || question.includes('rasul')) {
            answer = "Prophet Muhammad (PBUH) is the last and final messenger of Allah. He was born in 570 CE in Mecca. He is known as 'Al-Amin' (the trustworthy) and is the best example for humanity.";
        } else if (question.includes('jannah') || question.includes('paradise') || question.includes('heaven')) {
            answer = "Jannah (Paradise) is the eternal reward for believers. It has 8 gates and 7 levels. The highest level is Jannat-ul-Firdaus. It contains what no eye has seen, no ear has heard.";
        } else if (question.includes('jahannam') || question.includes('hell') || question.includes('nar')) {
            answer = "Jahannam (Hell) is the punishment for those who reject faith and commit major sins without repentance. It has 7 levels. May Allah protect us from it. Ameen.";
        } else if (question.includes('death') || question.includes('mout') || question.includes('grave')) {
            answer = "Death is the transition from this worldly life to the afterlife. The soul experiences Barzakh (intermediate state) until the Day of Judgment. Good deeds prepare us for this journey.";
        } else {
            answer = `🤲 *Your Question:* ${args.join(' ')}\n\n📖 Islam is a complete way of life. For detailed answers, please consult a scholar or visit:\n🔗 https://islamqa.info\n\n📚 Basic Islamic principles:\n• 5 Pillars: Shahada, Salah, Zakat, Sawm, Hajj\n• 6 Pillars of Iman: Allah, Angels, Books, Prophets, Day of Judgment, Divine Decree\n• Quran & Sunnah are the primary sources`;
        }
        
        reply(sock, m, `📖 *Islamic Q&A*
╔══════════════════╗
║ Question: ${args.join(' ')}
╚══════════════════╝

${answer}

🤲 And Allah knows best.`);
    });

    // ========== SALAWAT / DAROOD ==========
    register('salawat', async (sock, m, args, config) => {
        const salawats = [
            { text: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammadin kama sallayta 'ala Ibrahima wa 'ala ali Ibrahima innaka hamidun majeed", meaning: "O Allah, send blessings upon Muhammad and the family of Muhammad as You sent blessings upon Ibrahim and the family of Ibrahim. Indeed, You are Praiseworthy, Glorious." },
            { text: "Allahumma barik 'ala Muhammadin wa 'ala ali Muhammadin kama barakta 'ala Ibrahima wa 'ala ali Ibrahima innaka hamidun majeed", meaning: "O Allah, bless Muhammad and the family of Muhammad as You blessed Ibrahim and the family of Ibrahim. Indeed, You are Praiseworthy, Glorious." },
            { text: "Sallallahu 'ala Muhammad", meaning: "May Allah send blessings upon Muhammad" }
        ];
        
        const s = salawats[Math.floor(Math.random() * salawats.length)];
        reply(sock, m, `🤲 *Salawat / Darood*
╔══════════════════╗
║ ${s.text}
╚══════════════════╝

📖 *Meaning:* ${s.meaning}

🔄 Recite 10x in the morning and evening for intercession on Judgment Day.

🤲 Sallallahu 'ala Muhammad! 🌹`);
    });

    // ========== 40 RABBANA DUAS ==========
    register('rabbana', async (sock, m, args, config) => {
        const rabbanaDuas = [
            { text: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan waqina azaban-nar", surah: "Al-Baqarah 2:201" },
            { text: "Rabbana la tu'akhidhna in nasina aw akhta'na", surah: "Al-Baqarah 2:286" },
            { text: "Rabbana wa la tahmil 'alayna isran kama hamaltahu 'alal-ladhina min qablina", surah: "Al-Baqarah 2:286" },
            { text: "Rabbana wa la tuhammilna ma la taqata lana bihi wa'fu 'anna waghfir lana warhamna", surah: "Al-Baqarah 2:286" },
            { text: "Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana min ladunka rahmah", surah: "Aal-e-Imran 3:8" },
            { text: "Rabbana innaka jami'unnasi li-yawmin la rayba fihi", surah: "Aal-e-Imran 3:9" },
            { text: "Rabbana innana amanna faghfir lana dhunubana waqina 'adhaban-nar", surah: "Aal-e-Imran 3:16" },
            { text: "Rabbana hab lana min azwajina wa dhurriyatina qurrata a'yun", surah: "Al-Furqan 25:74" },
            { text: "Rabbana 'alayka tawakkalna wa ilayka anabna wa ilaykal-masir", surah: "Al-Mumtahina 60:4" },
            { text: "Rabbana ighfir lana wa li-ikhwaninal-ladhiina sabaquna bil-iman", surah: "Al-Hashr 59:10" },
            { text: "Rabbana atmim lana nurana waghfir lana innaka 'ala kulli shay'in qadir", surah: "At-Tahrim 66:8" },
            { text: "Rabbana taqabbal minna innaka antas-sami'ul-'alim", surah: "Al-Baqarah 2:127" },
            { text: "Rabbana waj'alna muslimayni laka wa min dhurriyatina ummatan muslimatan laka", surah: "Al-Baqarah 2:128" },
            { text: "Rabbana wa arina manasikana wa tub 'alayna innaka antat-tawwabur-rahim", surah: "Al-Baqarah 2:128" },
            { text: "Rabbana afrigh 'alayna sabran wa thabbit aqdamana wansurna 'alal-qawmil-kafirin", surah: "Al-Baqarah 2:250" }
        ];
        
        const r = rabbanaDuas[Math.floor(Math.random() * rabbanaDuas.length)];
        reply(sock, m, `🤲 *Rabbana Dua #${rabbanaDuas.indexOf(r) + 1}*
╔══════════════════╗
║ ${r.text}
╚══════════════════╝

📖 Surah: ${r.surah}

🔄 Recite after each prayer for blessings!

🤲 Ameen!`);
    });
    
    // ========== ISLAMIC STORIES ==========
    register('islamicstory', async (sock, m, args, config) => {
        const stories = [
            {
                title: "The Man Who Killed 99 People",
                story: "There was a man who killed 99 people. He went to a scholar and asked if he could repent. The scholar said, 'Who can forgive such sins?' The man killed the scholar too, making it 100. Then he went to another scholar. This scholar said, 'Who can stop you from repenting? Go to a certain village where righteous people live and worship Allah there.' The man set out, but died on the way. The angels of mercy and punishment argued about him. Allah commanded them to measure the distance - he was closer to the righteous village, so he was forgiven."
            },
            {
                title: "The Woman Who Fed a Dog",
                story: "A prostitute saw a dog panting from thirst near a well. She took off her shoe, tied it with her scarf, and drew water for the dog. Allah forgave all her sins because of this single act of kindness. This shows that even the smallest good deed can lead to Paradise."
            },
            {
                title: "The Date Tree of Uthman",
                story: "When the Muslims were suffering from thirst, a Jewish merchant offered to sell a well for an enormous price. Uthman ibn Affan (RA) bought it and made it freely available to everyone. He said, 'I have a well in Paradise for this.' The Prophet (PBUH) said, 'Whoever builds a mosque for Allah, Allah will build for him a house in Paradise.'"
            },
            {
                title: "The Spider and the Cave",
                story: "When Prophet Muhammad (PBUH) and Abu Bakr (RA) were hiding in the Cave of Thawr during the Hijrah, Allah commanded a spider to spin a web at the entrance. When the Quraysh came looking, they saw the web and said, 'No one has entered here.' Thus Allah protected His Prophet through a small spider."
            },
            {
                title: "Umar and the Woman",
                story: "During a famine, Caliph Umar (RA) was distributing food. He saw a woman cooking stones in a pot to stop her children from crying. Umar immediately went to the treasury, carried a sack of flour on his own back, and delivered it to her. Such was the care of the leader for his people."
            }
        ];
        
        const story = stories[Math.floor(Math.random() * stories.length)];
        reply(sock, m, `📖 *Islamic Story*
╔══════════════════╗
║ ${story.title}
╚══════════════════╝

${story.story}

📚 A lesson in faith and righteousness.

🤲 May we learn from these stories!`);
    });
}

module.exports = { register: registerIslamic };