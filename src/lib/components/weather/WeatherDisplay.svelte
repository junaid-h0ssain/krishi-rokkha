<script lang="ts">
  export let daily: any[] = [];
  import { makeBanglaAdvice } from '$lib/services/weather';
</script>

{#if !daily || daily.length === 0}
  <p>No weather data</p>
{:else}
  <div class="weather-grid">
    {#each daily as day}
      <article class="weather-day card">
        <h3>{new Date(day.dt*1000).toLocaleDateString('bn-BD')}</h3>
        <div>তাপমাত্রা: <strong>{Math.round(day.temp)}°C</strong></div>
        <div>আর্দ্রতা: <strong>{Math.round(day.humidity)}%</strong></div>
        <div>বৃষ্টি সম্ভাব্যতা: <strong>{Math.round(day.rainProb)}%</strong></div>
        <div class="advice">{makeBanglaAdvice(day)}</div>
      </article>
    {/each}
  </div>
{/if}

<style>
.weather-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem}
.weather-day{padding:1rem}
.advice{margin-top:0.5rem;background:#f8fafc;padding:0.5rem;border-left:4px solid #16a34a}
</style>
