<script lang="ts">
  import { onMount } from 'svelte';
  import LocationSelector from '$lib/components/weather/LocationSelector.svelte';
  import WeatherDisplay from '$lib/components/weather/WeatherDisplay.svelte';
  import { fetchWeatherForDistrict } from '$lib/services/weather';

  import { browser } from '$app/environment';
  let selected: string = '';
  if (browser) selected = localStorage.getItem('weather.location') || '';
  let daily: any[] = [];
  let loading = false;
  let error: string | null = null;

  async function loadFor(loc:string) {
    if (!loc) return;
    loading = true; error = null; daily = [];
    try {
      const data = await fetchWeatherForDistrict(loc);
      daily = data;
      if (browser) localStorage.setItem('weather.location', loc);
    } catch (e) {
      error = 'Failed to load weather';
    } finally { loading = false; }
  }

  onMount(()=>{
    if (selected) loadFor(selected);
  });
</script>

<h1>আবহাওয়া (Weather)</h1>
<LocationSelector bind:value={selected} on:select={(e)=>{ selected = e.detail; loadFor(selected); }} />

{#if loading}
  <p>লোড হচ্ছে...</p>
{:else if error}
  <p class="error">{error} <button on:click={()=>loadFor(selected)}>Retry</button></p>
{:else}
  <WeatherDisplay {daily} />
{/if}
