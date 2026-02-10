<script lang="ts">
	import { onDestroy } from 'svelte';
	import { batchesStore } from '$lib/stores/batches';
	import type { Batch } from '$lib/stores/batches';
	import BatchCard from './BatchCard.svelte';

	let batches: Batch[] = [];
	let isLoading = false;
	let error: string | null = null;

	// Subscribe to the store
	const unsubscribe = batchesStore.subscribe((state) => {
		batches = state.batches;
		isLoading = state.isLoading;
		error = state.error;
	});

	// Cleanup subscription on destroy
	onDestroy(unsubscribe);
</script>

<div class="batch-list">
	{#if isLoading}
		<div class="flex justify-center py-8">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
		</div>
	{:else if error}
		<div class="bg-red-50 border border-red-200 rounded-md p-4">
			<p class="text-red-800">Error loading batches: {error}</p>
		</div>
	{:else if batches.length === 0}
		<div class="text-center py-8">
			<p class="text-gray-500">No batches found. Create your first batch to get started.</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each batches as batch (batch.id)}
				<BatchCard {batch} />
			{/each}
		</div>
	{/if}
</div>