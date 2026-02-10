<script lang="ts">
	import type { Batch } from '$lib/stores/batches';

	let { batch }: { batch: Batch } = $props();
</script>

<div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
	<div class="flex justify-between items-start mb-4">
		<div>
			<h3 class="text-lg font-semibold text-gray-900">{batch.name}</h3>
			<p class="text-sm text-gray-600">{batch.cropType}</p>
		</div>
		<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
			{batch.healthStatus === 'healthy' ? 'bg-green-100 text-green-800' :
			 batch.healthStatus === 'at-risk' ? 'bg-yellow-100 text-yellow-800' :
			 'bg-red-100 text-red-800'}">
			{batch.healthStatus}
		</span>
	</div>

	<div class="space-y-2">
		<div class="flex justify-between">
			<span class="text-sm text-gray-600">Risk Level:</span>
			<span class="text-sm font-medium
				{batch.riskLevel === 'low' ? 'text-green-600' :
				 batch.riskLevel === 'medium' ? 'text-yellow-600' :
				 'text-red-600'}">
				{batch.riskLevel}
			</span>
		</div>
		<div class="flex justify-between">
			<span class="text-sm text-gray-600">Location:</span>
			<span class="text-sm text-gray-900">{batch.location}</span>
		</div>
		<div class="flex justify-between">
			<span class="text-sm text-gray-600">Created:</span>
			<span class="text-sm text-gray-900">{batch.createdAt.toLocaleDateString()}</span>
		</div>
	</div>
</div>