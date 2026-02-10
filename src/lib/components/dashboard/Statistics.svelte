<script lang="ts">
import { derived } from 'svelte/store';
import { batchesStore } from '$lib/stores/batches';

const stats = derived(batchesStore, ($b) => {
  const total = $b.batches.length;
  const byHealth = { healthy: 0, 'at-risk': 0, diseased: 0 } as Record<string, number>;
  const byRisk = { low: 0, medium: 0, high: 0 } as Record<string, number>;

  for (const b of $b.batches) {
    byHealth[b.healthStatus] = (byHealth[b.healthStatus] || 0) + 1;
    byRisk[b.riskLevel] = (byRisk[b.riskLevel] || 0) + 1;
  }

  return { total, byHealth, byRisk };
});
</script>

<div class="bg-white rounded-lg shadow p-6">
  <h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="p-4 bg-gray-50 rounded">
      <div class="text-sm text-gray-500">Total Batches</div>
      <div class="text-2xl font-bold">{$stats.total}</div>
    </div>

    <div class="p-4 bg-gray-50 rounded">
      <div class="text-sm text-gray-500">By Health</div>
      <div class="mt-2 space-y-1 text-sm">
        <div>Healthy: {$stats.byHealth.healthy}</div>
        <div>At-risk: {$stats.byHealth['at-risk']}</div>
        <div>Diseased: {$stats.byHealth.diseased}</div>
      </div>
    </div>

    <div class="p-4 bg-gray-50 rounded">
      <div class="text-sm text-gray-500">By Risk</div>
      <div class="mt-2 space-y-1 text-sm">
        <div>Low: {$stats.byRisk.low}</div>
        <div>Medium: {$stats.byRisk.medium}</div>
        <div>High: {$stats.byRisk.high}</div>
      </div>
    </div>
  </div>
</div>
