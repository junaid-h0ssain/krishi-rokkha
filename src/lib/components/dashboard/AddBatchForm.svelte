<script lang="ts">
import { createEventDispatcher } from 'svelte';
import { createBatch } from '$lib/services/batches';
import { batchesStore } from '$lib/stores/batches';

const dispatch = createEventDispatcher();

let name = '';
let cropType = '';
let location = '';
let healthStatus: 'healthy' | 'at-risk' | 'diseased' = 'healthy';
let riskLevel: 'low' | 'medium' | 'high' = 'low';
let isSubmitting = false;
let error = '';

async function submit(e?: Event) {
  e?.preventDefault();
  error = '';
  isSubmitting = true;

  try {
    const id = await createBatch({ name, cropType, location, healthStatus, riskLevel });
    batchesStore.update(state => {
      const newBatch = {
        id,
        name,
        cropType,
        healthStatus,
        riskLevel,
        location,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      return { ...state, batches: [newBatch, ...state.batches] };
    });
    dispatch('created', { id });
    // reset
    name = '';
    cropType = '';
    location = '';
    healthStatus = 'healthy';
    riskLevel = 'low';
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  } finally {
    isSubmitting = false;
  }
}
</script>

<form class="bg-white rounded-lg shadow p-6" on:submit|preventDefault={submit}>
  <h3 class="text-lg font-semibold mb-4">Add Batch</h3>

  {#if error}
    <div class="bg-red-50 border border-red-200 text-red-800 p-2 rounded mb-3">{error}</div>
  {/if}

  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
    <input class="p-2 border rounded" placeholder="Batch name" bind:value={name} required />
    <input class="p-2 border rounded" placeholder="Crop type" bind:value={cropType} required />
    <input class="p-2 border rounded" placeholder="Location" bind:value={location} required />

    <select class="p-2 border rounded" bind:value={healthStatus}>
      <option value="healthy">Healthy</option>
      <option value="at-risk">At-risk</option>
      <option value="diseased">Diseased</option>
    </select>

    <select class="p-2 border rounded" bind:value={riskLevel}>
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
  </div>

  <div class="mt-4 flex items-center space-x-2">
    <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit" disabled={isSubmitting}>
      {#if isSubmitting}Adding...{:else}Add Batch{/if}
    </button>
    <button type="button" class="text-sm text-gray-600" on:click={() => dispatch('cancel')} disabled={isSubmitting}>Cancel</button>
  </div>
</form>
