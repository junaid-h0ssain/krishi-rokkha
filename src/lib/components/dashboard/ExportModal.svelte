<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { toCSV, toJSON } from '$lib/services/export';
  import { batchesStore } from '$lib/stores/batches';

  const dispatch = createEventDispatcher();

  let format: 'csv' | 'json' = 'csv';
  let filename = 'batches_export';
  let batches: any[] = [];

  const unsubscribe = batchesStore.subscribe(s => {
    batches = s.batches || [];
  });

  function close() {
    dispatch('close');
  }

  function doExport() {
    if (format === 'csv') {
      toCSV(batches, `${filename}.csv`);
    } else {
      toJSON(batches, `${filename}.json`);
    }
    close();
  }

  // cleanup
  $: if (!batches) batches = [];
  onDestroy(() => unsubscribe());
</script>

<style>
  .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; }
  .modal { background: white; padding:1rem; border-radius:8px; width:320px; }
</style>

<div class="modal-backdrop" on:click|self={close}>
  <div class="modal" on:click|stopPropagation>
    <h3 class="text-lg font-semibold mb-2">Export Batches</h3>
    <div class="mb-2">
      <label class="block text-sm">Format</label>
      <div class="flex items-center space-x-3 mt-1">
        <label><input type="radio" bind:group={format} value="csv" /> CSV</label>
        <label><input type="radio" bind:group={format} value="json" /> JSON</label>
      </div>
    </div>
    <div class="mb-3">
      <label class="block text-sm">Filename</label>
      <input class="mt-1 w-full border rounded px-2 py-1" bind:value={filename} />
    </div>
    <div class="flex justify-end space-x-2">
      <button class="px-3 py-1" on:click={close}>Cancel</button>
      <button class="bg-blue-600 text-white px-3 py-1 rounded" on:click={doExport}>Export</button>
    </div>
  </div>
</div>
