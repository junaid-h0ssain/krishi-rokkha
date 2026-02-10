<script lang="ts">
  export let daily: any[] = [];
  import { makeBanglaAdvice } from '$lib/services/weather';
</script>

<section class="forecast">
  <h2>৫-দিনের পূর্বাভাস (5-day Forecast)</h2>
  {#if !daily || daily.length === 0}
    <p>No forecast available</p>
  {:else}
    <ul class="forecast-list">
      {#each daily as day}
        <li class="forecast-item">
          <div class="date">{new Date(day.dt*1000).toLocaleDateString('bn-BD')}</div>
          <div class="metrics">{Math.round(day.temp)}°C · {Math.round(day.humidity)}% · {Math.round(day.rainProb)}%</div>
          <div class="advice">{makeBanglaAdvice(day)}</div>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
.forecast-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:0.75rem;padding:0;list-style:none}
.forecast-item{background:#fff;padding:0.75rem;border:1px solid #e6e6e6;border-radius:6px}
.date{font-weight:600;margin-bottom:6px}
.metrics{color:#374151}
.advice{margin-top:6px;font-size:0.95em;color:#065f46}
</style>
