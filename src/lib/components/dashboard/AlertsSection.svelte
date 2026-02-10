<script lang="ts">
import { derived } from 'svelte/store';
import { batchesStore } from '$lib/stores/batches';

const alerts = derived(batchesStore, ($b) => {
  // Alert if riskLevel is medium/high or healthStatus is at-risk/diseased
  return $b.batches.filter(b => b.riskLevel === 'medium' || b.riskLevel === 'high' || b.healthStatus === 'at-risk' || b.healthStatus === 'diseased');
});
</script>

<div class="bg-white rounded-lg shadow p-6">
  <h2 class="text-xl font-semibold text-gray-900 mb-4">Risk Alerts</h2>

  {#if $alerts.length === 0}
    <div class="text-gray-600">No active alerts. All batches look good.</div>
  {:else}
    <ul class="space-y-3">
      {#each $alerts as batch}
        <li class="p-4 border rounded flex justify-between items-start">
          <div>
            <div class="font-semibold text-gray-900">{batch.name}</div>
            <div class="text-sm text-gray-600">{batch.cropType} • {batch.location}</div>
            <div class="text-sm mt-1">
              <span class="mr-2 text-xs px-2 py-0.5 rounded {batch.healthStatus === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">{batch.healthStatus}</span>
              <span class="text-xs px-2 py-0.5 rounded {batch.riskLevel === 'high' ? 'bg-red-100 text-red-800' : batch.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}">{batch.riskLevel}</span>
            </div>
          </div>
          <div class="text-right text-sm text-gray-700 max-w-xs">
            <div class="mb-2">Recommended action:</div>
            {#if batch.riskLevel === 'high' || batch.healthStatus === 'diseased'}
              <div class="font-medium">Inspect immediately and apply treatment.</div>
            {:else}
              <div>Monitor closely and consider preventive measures.</div>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>
