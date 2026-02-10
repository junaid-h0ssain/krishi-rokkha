<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { DISTRICT_COORDS } from '$lib/services/weather';
  const dispatch = createEventDispatcher();

  export let value: string | null = null;

  function onChange(e: Event) {
    const v = (e.target as HTMLSelectElement).value;
    dispatch('select', v);
  }
</script>

<label for="weather-location">Location</label>
<select id="weather-location" on:change={onChange} bind:value>
  <option value="">-- select --</option>
  {#each Object.keys(DISTRICT_COORDS).sort() as loc}
    <option value={loc}>{loc}</option>
  {/each}
</select>
