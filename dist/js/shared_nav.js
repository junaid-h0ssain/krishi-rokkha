// Shared Navigation Logic

const translations = {
    en: {
        // Navigation
        "nav-features": "About Us",
        "nav-impact": "Testimonies",
        "nav-about": "Research",
        "nav-enter": "Enter App",

        // About Page
        "about-hero-title": "Fighting Food Loss in Bangladesh",
        "mission_text": "HarvestGuard is a technology-driven solution designed to fight food loss in Bangladesh. Every year, more than 4.5 million metric tonnes of food grains are lost due to poor storage, weather risks, and mismanagement. Our platform uses weather forecasting, crop monitoring, and early-warning alerts to help farmers protect their harvests.",
        "why_text": "Food loss affects farmer incomes, national food security, and long-term sustainability. Our goal is to empower farmers with simple, mobile-friendly tools so farmers can reduce waste, minimize risks, and improve livelihoods.",
        "offer_title": "What HarvestGuard Offers",
        "offer_1": "Real-time storage risk prediction",
        "offer_2": "Hyper-local weather insights (Bangla)",
        "offer_3": "Farmer-friendly advisories",
        "offer_4": "Offline support + data sync",
        "offer_5": "AI-based crop scan (fresh vs rotten)",
        "impact_title": "Our Impact",
        "impact_text": "Since our pilot launch, HarvestGuard has helped over 500 farmers across 3 districts reduce post-harvest losses by an average of 35%. Our users report better decision-making, increased confidence, and significant savings.",
        "sdg_title": "Aligned with UN SDGs",
        "sdg_text": "HarvestGuard directly contributes to SDG 2 (Zero Hunger), SDG 12 (Responsible Consumption), and SDG 13 (Climate Action) by reducing food waste and empowering farmers with climate-smart agriculture tools.",

        // Farmer Stories Page
        "stories_hero": "Real Stories from Real Farmers",
        "stories_intro": "Hear directly from the farmers who are using HarvestGuard to protect their harvests and improve their livelihoods.",
        "farmer_1_name": "Rafique, Barishal",
        "farmer_1_story": "Last year, sudden rains destroyed 40% of my rice. This year, HarvestGuard warned me in advance—I covered my grains. 90% of my harvest was saved.",
        "farmer_2_name": "Shamima, Rajshahi",
        "farmer_2_story": "When the temperature rises, rice changes color. Following the app's advice, I stored my crops higher. Losses have reduced significantly, and grain spillage has decreased.",
        "farmer_3_name": "Jalal, Mymensingh",
        "farmer_3_story": "I used to not know which day was best to dry rice. Now I check the app and decide. Problems are reducing. My confidence in crop care has also increased.",
        "farmer_4_name": "Ayesha, Khulna",
        "farmer_4_story": "The AI scanner helped me identify rotten crops before they spread. I separated them immediately and saved the rest of my harvest. This technology is a game-changer!",
        "farmer_5_name": "Karim, Sylhet",
        "farmer_5_story": "Weather forecasts in Bangla made it so easy to understand. I can now plan my storage better and avoid last-minute panic. My income has improved by 25% this season.",
        "farmer_6_name": "Fatima, Rangpur",
        "farmer_6_story": "The offline feature is amazing! Even when I don't have internet, I can still access important advisories. HarvestGuard truly understands our needs.",

        // Research Page
        "research_intro_title": "Research Behind HarvestGuard",
        "research_intro_text": "Our team conducted extensive research on food loss across Bangladesh. Data from BIDS, FAO, and Financial Express shows that 12–32% of staple food is lost every year during post-harvest stages.",
        "key_findings_title": "Key Findings",
        "finding_1": "Weather unpredictability causes grain damage.",
        "finding_2": "Poor storage bags increase moisture & mold.",
        "finding_3": "Farmers lack real-time guidance.",
        "finding_4": "Existing solutions are too complex.",
        "finding_5": "Limited access to technology in rural areas.",
        "finding_6": "Language barriers prevent adoption of digital tools.",
        "tech_op_title": "Technology Opportunities",
        "tech_1": "Hyper-local weather mapping",
        "tech_2": "AI-based moisture prediction",
        "tech_3": "Offline-first mobile web apps",
        "tech_4": "Farmer-friendly Bangla advisories",
        "tech_5": "Low-bandwidth crop health scanning",
        "tech_6": "SMS-based alerts for feature phones",
        "research_conclusion_title": "Conclusion",
        "research_conclusion_text": "With proper digital tools, Bangladesh can reduce food loss, increase farmer profit, and ensure long-term food security.",
        "methodology_title": "Research Methodology",
        "methodology_text": "We conducted field surveys with 200+ farmers, analyzed government agricultural data, and collaborated with local agricultural extension officers to understand the real challenges faced by farmers in Bangladesh.",
        "data_sources_title": "Data Sources",
        "data_sources_text": "Our research is based on data from Bangladesh Institute of Development Studies (BIDS), Food and Agriculture Organization (FAO), Bangladesh Bureau of Statistics (BBS), and direct farmer interviews.",

        // Footer
        "footer-desc": "Empowering Bangladeshi farmers to reduce post-harvest losses and build a more resilient, sustainable food system.",
        "footer-about-title": "About HarvestGuard",
        "footer-mission": "Our Mission",
        "footer-sdg": "SDG Impact",
        "footer-team": "Team",
        "footer-resources-title": "Resources",
        "footer-guide": "User Guide",
        "footer-research": "Research & Data",
        "footer-stories": "Farmer Stories"
    },
    bn: {
        // Navigation
        "nav-features": "আমাদের সম্পর্কে",
        "nav-impact": "সাক্ষ্য",
        "nav-about": "গবেষণা",
        "nav-enter": "অ্যাপে প্রবেশ করুন",

        // About Page
        "about-hero-title": "বাংলাদেশে খাদ্য ক্ষতির বিরুদ্ধে লড়াই",
        "mission_text": "হারভেস্টগার্ড বাংলাদেশে খাদ্য ক্ষতির বিরুদ্ধে লড়াই করার জন্য একটি প্রযুক্তি-চালিত সমাধান। প্রতি বছর ৪.৫ মিলিয়ন মেট্রিক টনেরও বেশি খাদ্যশস্য খারাপ সংরক্ষণ, আবহাওয়ার ঝুঁকি এবং অব্যবস্থাপনার কারণে নষ্ট হয়। আমাদের প্ল্যাটফর্ম আবহাওয়ার পূর্বাভাস, ফসল পর্যবেক্ষণ এবং প্রাথমিক সতর্কতা ব্যবহার করে কৃষকদের তাদের ফসল রক্ষা করতে সাহায্য করে।",
        "why_text": "খাদ্য ক্ষতি কৃষকদের আয়, জাতীয় খাদ্য নিরাপত্তা এবং দীর্ঘমেয়াদী স্থায়িত্বকে প্রভাবিত করে। আমাদের লক্ষ্য হল কৃষকদের সহজ, মোবাইল-বান্ধব সরঞ্জাম দিয়ে ক্ষমতায়ন করা যাতে তারা অপচয় কমাতে, ঝুঁকি কমাতে এবং জীবিকা উন্নত করতে পারে।",
        "offer_title": "হারভেস্টগার্ড যা অফার করে",
        "offer_1": "রিয়েল-টাইম সংরক্ষণ ঝুঁকি পূর্বাভাস",
        "offer_2": "হাইপার-লোকাল আবহাওয়া তথ্য (বাংলা)",
        "offer_3": "কৃষক-বান্ধব পরামর্শ",
        "offer_4": "অফলাইন সমর্থন + ডেটা সিঙ্ক",
        "offer_5": "এআই-ভিত্তিক ফসল স্ক্যান (তাজা বনাম পচা)",
        "impact_title": "আমাদের প্রভাব",
        "impact_text": "আমাদের পাইলট চালু হওয়ার পর থেকে, হারভেস্টগার্ড ৩টি জেলা জুড়ে ৫০০ জনেরও বেশি কৃষককে গড়ে ৩৫% ফসল-পরবর্তী ক্ষতি কমাতে সাহায্য করেছে। আমাদের ব্যবহারকারীরা ভাল সিদ্ধান্ত গ্রহণ, বর্ধিত আত্মবিশ্বাস এবং উল্লেখযোগ্য সঞ্চয়ের কথা জানান।",
        "sdg_title": "জাতিসংঘ এসডিজির সাথে সংযুক্ত",
        "sdg_text": "হারভেস্টগার্ড সরাসরি এসডিজি ২ (শূন্য ক্ষুধা), এসডিজি ১২ (দায়িত্বশীল ভোগ), এবং এসডিজি ১৩ (জলবায়ু পদক্ষেপ) এ অবদান রাখে খাদ্য অপচয় কমিয়ে এবং কৃষকদের জলবায়ু-স্মার্ট কৃষি সরঞ্জাম দিয়ে ক্ষমতায়ন করে।",

        // Farmer Stories Page
        "stories_hero": "প্রকৃত কৃষকদের প্রকৃত গল্প",
        "stories_intro": "সরাসরি শুনুন সেই কৃষকদের কাছ থেকে যারা তাদের ফসল রক্ষা করতে এবং তাদের জীবিকা উন্নত করতে হারভেস্টগার্ড ব্যবহার করছেন।",
        "farmer_1_name": "রফিক, বরিশাল",
        "farmer_1_story": "গত বছর হঠাৎ বৃষ্টিতে আমার ৪০% ধান নষ্ট হয়ে যায়। এ বছর হারভেস্টগার্ড আগেই সতর্ক করেছে—আমি ধান ঢেকে রেখেছিলাম। ৯০% ফসল বেঁচে গেছে।",
        "farmer_2_name": "শামিমা, রাজশাহী",
        "farmer_2_story": "তাপমাত্রা বেড়ে গেলে ধানের রঙ বদলে যায়। অ্যাপের পরামর্শ মেনে আমি শস্য উঁচু করে রেখেছি। ক্ষতি কমেছে অনেক এবং ধান ঝরে যাওয়া কমেছে।",
        "farmer_3_name": "জালাল, ময়মনসিংহ",
        "farmer_3_story": "আগে বুঝতাম না কোন দিন ধান শুকালে ভালো হবে। এখন অ্যাপ দেখে ঠিক করি। সমস্যা কমছে। ফসলের যত্নে আত্মবিশ্বাসও বেড়েছে।",
        "farmer_4_name": "আয়েশা, খুলনা",
        "farmer_4_story": "এআই স্ক্যানার আমাকে পচা ফসল ছড়িয়ে পড়ার আগেই চিহ্নিত করতে সাহায্য করেছে। আমি সাথে সাথে সেগুলো আলাদা করে বাকি ফসল বাঁচিয়েছি। এই প্রযুক্তি সত্যিই গেম-চেঞ্জার!",
        "farmer_5_name": "করিম, সিলেট",
        "farmer_5_story": "বাংলায় আবহাওয়ার পূর্বাভাস বুঝতে খুব সহজ হয়েছে। এখন আমি আমার সংরক্ষণ আরও ভালোভাবে পরিকল্পনা করতে পারি এবং শেষ মুহূর্তের আতঙ্ক এড়াতে পারি। এই মৌসুমে আমার আয় ২৫% বেড়েছে।",
        "farmer_6_name": "ফাতিমা, রংপুর",
        "farmer_6_story": "অফলাইন ফিচারটি অসাধারণ! এমনকি যখন আমার ইন্টারনেট থাকে না, তখনও আমি গুরুত্বপূর্ণ পরামর্শ অ্যাক্সেস করতে পারি। হারভেস্টগার্ড সত্যিই আমাদের চাহিদা বোঝে।",

        // Research Page
        "research_intro_title": "হারভেস্টগার্ডের পেছনের গবেষণা",
        "research_intro_text": "আমাদের দল বাংলাদেশ জুড়ে খাদ্য ক্ষতির উপর ব্যাপক গবেষণা পরিচালনা করেছে। বিআইডিএস, এফএও এবং ফিনান্সিয়াল এক্সপ্রেসের তথ্য দেখায় যে প্রতি বছর ১২-৩২% প্রধান খাদ্য ফসল-পরবর্তী পর্যায়ে নষ্ট হয়।",
        "key_findings_title": "মূল ফলাফল",
        "finding_1": "আবহাওয়ার অনিশ্চয়তা শস্যের ক্ষতি ঘটায়।",
        "finding_2": "খারাপ সংরক্ষণ ব্যাগ আর্দ্রতা এবং ছাঁচ বৃদ্ধি করে।",
        "finding_3": "কৃষকদের রিয়েল-টাইম নির্দেশনার অভাব।",
        "finding_4": "বিদ্যমান সমাধানগুলি খুব জটিল।",
        "finding_5": "গ্রামীণ এলাকায় প্রযুক্তিতে সীমিত প্রবেশাধিকার।",
        "finding_6": "ভাষার বাধা ডিজিটাল সরঞ্জাম গ্রহণে বাধা দেয়।",
        "tech_op_title": "প্রযুক্তি সুযোগ",
        "tech_1": "হাইপার-লোকাল আবহাওয়া ম্যাপিং",
        "tech_2": "এআই-ভিত্তিক আর্দ্রতা পূর্বাভাস",
        "tech_3": "অফলাইন-প্রথম মোবাইল ওয়েব অ্যাপ",
        "tech_4": "কৃষক-বান্ধব বাংলা পরামর্শ",
        "tech_5": "কম-ব্যান্ডউইথ ফসল স্বাস্থ্য স্ক্যানিং",
        "tech_6": "ফিচার ফোনের জন্য এসএমএস-ভিত্তিক সতর্কতা",
        "research_conclusion_title": "উপসংহার",
        "research_conclusion_text": "সঠিক ডিজিটাল সরঞ্জাম দিয়ে, বাংলাদেশ খাদ্য ক্ষতি কমাতে, কৃষকদের লাভ বাড়াতে এবং দীর্ঘমেয়াদী খাদ্য নিরাপত্তা নিশ্চিত করতে পারে।",
        "methodology_title": "গবেষণা পদ্ধতি",
        "methodology_text": "আমরা ২০০+ কৃষকদের সাথে মাঠ জরিপ পরিচালনা করেছি, সরকারি কৃষি তথ্য বিশ্লেষণ করেছি এবং বাংলাদেশের কৃষকদের প্রকৃত চ্যালেঞ্জগুলি বুঝতে স্থানীয় কৃষি সম্প্রসারণ কর্মকর্তাদের সাথে সহযোগিতা করেছি।",
        "data_sources_title": "তথ্যের উৎস",
        "data_sources_text": "আমাদের গবেষণা বাংলাদেশ উন্নয়ন অধ্যয়ন ইনস্টিটিউট (বিআইডিএস), খাদ্য ও কৃষি সংস্থা (এফএও), বাংলাদেশ পরিসংখ্যান ব্যুরো (বিবিএস), এবং সরাসরি কৃষক সাক্ষাৎকারের তথ্যের উপর ভিত্তি করে।",

        // Footer
        "footer-desc": "বাংলাদেশী কৃষকদের ফসল-পরবর্তী ক্ষতি কমাতে এবং আরও স্থিতিস্থাপক, টেকসই খাদ্য ব্যবস্থা তৈরি করতে ক্ষমতায়ন করা।",
        "footer-about-title": "হারভেস্টগার্ড সম্পর্কে",
        "footer-mission": "আমাদের মিশন",
        "footer-sdg": "এসডিজি প্রভাব",
        "footer-team": "টিম",
        "footer-resources-title": "সম্পদ",
        "footer-guide": "ব্যবহারকারী গাইড",
        "footer-research": "গবেষণা ও ডেটা",
        "footer-stories": "কৃষকদের গল্প"
    }
};

let currentLang = 'en';

function setLanguage(lang) {
    currentLang = lang;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    const langText = document.getElementById('lang-text');
    if (langText) {
        langText.textContent = lang === 'en' ? 'বাংলা' : 'English';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const langToggle = document.getElementById('lang-toggle');
    const enterAppBtn = document.getElementById('enter-app-btn');

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const newLang = currentLang === 'en' ? 'bn' : 'en';
            setLanguage(newLang);
        });
    }

    if (enterAppBtn) {
        enterAppBtn.addEventListener('click', () => {
            window.location.href = './app.html'; // Adjusted path for public/ folder
        });
    }
});
