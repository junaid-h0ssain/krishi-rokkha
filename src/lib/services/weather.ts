// Minimal weather service ported for SvelteKit
import { WEATHER_CONFIG } from '../../config.js';

export const DISTRICT_COORDS: Record<string,{lat:number,lon:number}> = {
    "Anwara": { lat: 22.4167, lon: 91.7667 },
    "Banshkhali": { lat: 22.3000, lon: 91.9833 },
    "Chattogram Sadar": { lat: 22.3569, lon: 91.7832 }
};

export async function fetchWeatherForDistrict(district:string) {
    const coords = (DISTRICT_COORDS as any)[district];
    if (!coords) return getMockWeatherData();

    const url = `${WEATHER_CONFIG.baseUrl}?lat=${coords.lat}&lon=${coords.lon}&appid=${WEATHER_CONFIG.apiKey}&units=metric`;

    try {
        const res = await fetch(url);
        if (!res.ok) return getMockWeatherData();
        const data = await res.json();
        // Aggregate to daily summary (5 days)
        return aggregateToDaily(data.list || []);
    } catch (err) {
        return getMockWeatherData();
    }
}

function aggregateToDaily(list:any[]) {
    const byDay: Record<string, any[]> = {};
    list.forEach(item => {
        const dateKey = (item.dt_txt || new Date(item.dt*1000).toISOString()).split(' ')[0];
        (byDay[dateKey] || (byDay[dateKey]=[])).push(item);
    });

    return Object.keys(byDay).slice(0,5).map(dateKey => {
        const items = byDay[dateKey];
        const avg = (arr:any[])=> arr.reduce((s,v)=>s+v,0)/arr.length;
        return {
            dt: Math.floor(new Date(dateKey).getTime()/1000),
            temp: avg(items.map((i:any)=>i.main?.temp ?? i.temp ?? 0)),
            humidity: avg(items.map((i:any)=>i.main?.humidity ?? 0)),
            rainProb: avg(items.map((i:any)=> (i.pop||0)*100 ))
        };
    });
}

function getMockWeatherData() {
    const now = Date.now();
    const days = [];
    for (let i=0;i<5;i++) {
        const dt = Math.floor((now + i*24*3600*1000)/1000);
        days.push({ dt, temp: 28 + Math.random()*6 - 3, humidity: 60 + Math.random()*30, rainProb: Math.round(Math.random()*100) });
    }
    return days;
}

export function makeBanglaAdvice(day:any) {
    if (day.rainProb > 80) return "বৃষ্টির সম্ভাবনা খুব বেশি (৮০%+)। আজই ধান কাটুন অথবা ঢেকে রাখুন।";
    if (day.rainProb > 50) return "বৃষ্টির সম্ভাবনা আছে। শস্য বাইরে রাখবেন না।";
    if (day.temp > 35) return "তাপমাত্রা অনেক বেশি (৩৫°C+)। নিয়মিত সেচ দিন।";
    if (day.humidity > 85) return "বাতাসে আর্দ্রতা বেশি। শস্যে পোকা বা ছত্রাক হতে পারে, সতর্ক থাকুন।";
    return "আবহাওয়া স্বাভাবিক আছে। নিয়মিত পরিচর্যা করুন।";
}
