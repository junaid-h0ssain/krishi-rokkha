// Import modules
import { initQuickRegister } from "../modules/quickRegister.js";

// Translation data
const translations = {
    en: {
        "nav-features": "About Us",
        "nav-impact": "Testimonies",
        "nav-about": "Research",
        "nav-enter": "Enter App",
        "hero-tagline": "Reducing Food Loss in Bangladesh",
        "hero-title": "Protecting Every Grain, Securing Every Future.",
        "hero-subtitle": "Bangladesh loses 4.5 million metric tonnes of food grains annually—costing $1.5 billion. HarvestGuard helps farmers reduce post-harvest losses through smart storage monitoring and real-time weather advisories.",
        "hero-cta": "Learn more",
        "stat-title": "Bangladesh has",
        "stat-1-label": "Million Tonnes Lost",
        "stat-2-label": "Billion USD Cost",
        "stat-3-label": "% Food Loss Rate",
        "workflow-title": "How KrishiRokkha Works",
        "workflow-1-label": "Data Collection",
        "workflow-1-desc": "AI scans storage conditions & weather patterns",
        "workflow-2-label": "Smart Warning",
        "workflow-2-desc": "Real-time alerts for risks detected",
        "workflow-3-label": "Farmer Action",
        "workflow-3-desc": "Simple Bangla instructions to protect crops",
        "workflow-4-label": "Food Saved",
        "workflow-4-desc": "Reduced losses, increased income",
        "meta-problem-title": "The Problem",
        "meta-problem-text": "12–32% of staple foods including rice, pulses, vegetables, meat, and dairy are lost annually during production and distribution.",
        "meta-sdg-title": "SDG 12.3",
        "meta-sdg-text": "By 2030, halve per capita food waste and reduce food losses along production and supply chains, including post-harvest losses.",
        "meta-solution-title": "Our Solution",
        "meta-solution-text": "Real-time monitoring, AI-powered risk detection, and hyper-local weather advisories in Bangla.",
        "s1-heading": "The Challenge",
        "s1-title": "Food Loss Undermines Food Security",
        "s1-body": "Inadequate storage facilities, poor handling practices, and inefficient transportation result in massive economic and environmental costs. These losses particularly affect vulnerable communities and hinder progress toward SDG 12: Responsible Consumption and Production.",
        "s1-link": "Read the full report",
        "s2-heading": "Smart Technology",
        "s2-title": "AI-Powered Storage Monitoring",
        "s2-body": "KrishiRokkha uses computer vision to detect early signs of spoilage, moisture damage, and pest infestation. Farmers receive instant alerts and actionable recommendations to protect their harvest.",
        "s2-link": "See how it works",
        "s3-heading": "Weather Advisories",
        "s3-title": "Hyper-Local Forecasts in Bangla",
        "s3-body": "Get 5-day weather forecasts tailored to your upazila, with simple Bangla advisories like \"বৃষ্টির সম্ভাবনা খুব বেশি—আজই ধান কাটুন অথবা ঢেকে রাখুন\" so farmers can make informed decisions quickly.",
        "s3-link": "View weather feature",
        "footer-desc": "Empowering Bangladeshi farmers to reduce post-harvest losses and build a more resilient, sustainable food system.",
        "footer-about-title": "About KrishiRokkha",
        "footer-mission": "Our Mission",
        "footer-sdg": "SDG Impact",
        "footer-team": "Team",
        "footer-resources-title": "Resources",
        "footer-guide": "User Guide",
        "footer-research": "Research & Data",
        "footer-stories": "Farmer Stories"
    },
    bn: {
        "nav-features": "আমাদের সম্পর্কে",
        "nav-impact": "সাক্ষ্য",
        "nav-about": "গবেষণা",
        "nav-enter": "অ্যাপে প্রবেশ করুন",
        "hero-tagline": "বাংলাদেশে খাদ্য ক্ষতি হ্রাস",
        "hero-title": "প্রতিটি শস্য রক্ষা, প্রতিটি ভবিষ্যৎ সুরক্ষিত।",
        "hero-subtitle": "বাংলাদেশ বছরে ৪.৫ মিলিয়ন মেট্রিক টন খাদ্যশস্য হারায়—যার মূল্য $১.৫ বিলিয়ন। কৃষিরক্ষা কৃষকদের স্মার্ট স্টোরেজ মনিটরিং এবং রিয়েল-টাইম আবহাওয়া পরামর্শের মাধ্যমে ফসল-পরবর্তী ক্ষতি কমাতে সাহায্য করে।",
        "hero-cta": "আরও জানুন",
        "stat-title": "বাংলাদেশে",
        "stat-1-label": "মিলিয়ন টন ক্ষতি",
        "stat-2-label": "বিলিয়ন ডলার খরচ",
        "stat-3-label": "% খাদ্য ক্ষতির হার",
        "workflow-title": "কৃষিরক্ষা কীভাবে কাজ করে",
        "workflow-1-label": "ডেটা সংগ্রহ",
        "workflow-1-desc": "এআই স্টোরেজ অবস্থা এবং আবহাওয়ার ধরণ স্ক্যান করে",
        "workflow-2-label": "স্মার্ট সতর্কতা",
        "workflow-2-desc": "ঝুঁকি সনাক্ত হলে রিয়েল-টাইম সতর্কতা",
        "workflow-3-label": "কৃষকের পদক্ষেপ",
        "workflow-3-desc": "ফসল রক্ষার জন্য সহজ বাংলা নির্দেশনা",
        "workflow-4-label": "খাদ্য সংরক্ষিত",
        "workflow-4-desc": "ক্ষতি হ্রাস, আয় বৃদ্ধি",
        "meta-problem-title": "সমস্যা",
        "meta-problem-text": "চাল, ডাল, সবজি, মাংস এবং দুগ্ধজাত সহ প্রধান খাদ্যের ১২–৩২% উৎপাদন এবং বিতরণের সময় বছরে হারিয়ে যায়।",
        "meta-sdg-title": "এসডিজি ১২.৩",
        "meta-sdg-text": "২০৩০ সালের মধ্যে, খুচরা এবং ভোক্তা স্তরে মাথাপিছু খাদ্য অপচয় অর্ধেক করুন এবং ফসল-পরবর্তী ক্ষতি সহ উৎপাদন ও সরবরাহ শৃঙ্খলে খাদ্য ক্ষতি হ্রাস করুন।",
        "meta-solution-title": "আমাদের সমাধান",
        "meta-solution-text": "রিয়েল-টাইম মনিটরিং, এআই-চালিত ঝুঁকি সনাক্তকরণ এবং বাংলায় হাইপার-লোকাল আবহাওয়া পরামর্শ।",
        "s1-heading": "চ্যালেঞ্জ",
        "s1-title": "খাদ্য ক্ষতি খাদ্য নিরাপত্তাকে দুর্বল করে",
        "s1-body": "অপর্যাপ্ত স্টোরেজ সুবিধা, দুর্বল হ্যান্ডলিং অনুশীলন এবং অদক্ষ পরিবহন বিশাল অর্থনৈতিক এবং পরিবেশগত খরচের ফলস্বরূপ। এই ক্ষতিগুলি বিশেষত দুর্বল সম্প্রদায়গুলিকে প্রভাবিত করে এবং এসডিজি ১২: দায়িত্বশীল ভোগ এবং উৎপাদনের দিকে অগ্রগতিতে বাধা দেয়।",
        "s1-link": "সম্পূর্ণ রিপোর্ট পড়ুন",
        "s2-heading": "স্মার্ট প্রযুক্তি",
        "s2-title": "এআই-চালিত স্টোরেজ মনিটরিং",
        "s2-body": "কৃষিরক্ষা নষ্ট হওয়া, আর্দ্রতার ক্ষতি এবং কীটপতঙ্গের আক্রমণের প্রাথমিক লক্ষণ সনাক্ত করতে কম্পিউটার ভিশন ব্যবহার করে। কৃষকরা তাদের ফসল রক্ষার জন্য তাৎক্ষণিক সতর্কতা এবং কার্যকর সুপারিশ পান।",
        "s2-link": "এটি কীভাবে কাজ করে দেখুন",
        "s3-heading": "আবহাওয়া পরামর্শ",
        "s3-title": "বাংলায় হাইপার-লোকাল পূর্বাভাস",
        "s3-body": "আপনার উপজেলার জন্য তৈরি ৫-দিনের আবহাওয়া পূর্বাভাস পান, সহজ বাংলা পরামর্শ সহ যেমন \"বৃষ্টির সম্ভাবনা খুব বেশি—আজই ধান কাটুন অথবা ঢেকে রাখুন\" যাতে কৃষকরা দ্রুত সচেতন সিদ্ধান্ত নিতে পারে।",
        "s3-link": "আবহাওয়া বৈশিষ্ট্য দেখুন",
        "footer-desc": "বাংলাদেশী কৃষকদের ফসল-পরবর্তী ক্ষতি কমাতে এবং আরও স্থিতিস্থাপক, টেকসই খাদ্য ব্যবস্থা তৈরি করতে ক্ষমতায়ন করা।",
        "footer-about-title": "কৃষিরক্ষা সম্পর্কে",
        "footer-mission": "আমাদের মিশন",
        "footer-sdg": "এসডিজি প্রভাব",
        "footer-team": "টিম",
        "footer-resources-title": "সম্পদ",
        "footer-guide": "ব্যবহারকারী গাইড",
        "footer-research": "গবেষণা ও ডেটা",
        "footer-stories": "কৃষকদের গল্প"
    }
};

// Current language state
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

    console.log(`Language switched to: ${lang}`);
}

function initializeEventListeners() {
    try {
        const langToggle = document.getElementById('lang-toggle');
        const enterAppBtn = document.getElementById('enter-app-btn');

        if (langToggle) {
            langToggle.addEventListener('click', () => {
                console.log('Language toggle clicked! Current language:', currentLang);
                const newLang = currentLang === 'en' ? 'bn' : 'en';
                setLanguage(newLang);
            });
            console.log('✓ Language toggle button initialized');
        } else {
            console.error('✗ Language toggle button not found!');
        }

        if (enterAppBtn) {
            enterAppBtn.addEventListener('click', () => {
                console.log('Enter app button clicked');
                window.location.href = '/app.html';
            });
            console.log('✓ Enter app button initialized');
        }

        // Initialize quick register module
        initQuickRegister();

        console.log('✓ Page initialization complete');
    } catch (error) {
        console.error('✗ Error initializing page:', error);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEventListeners);
} else {
    initializeEventListeners();
}