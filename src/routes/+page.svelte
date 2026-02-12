<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { batchesStore } from '$lib/stores/batches';
	import { getUserBatches } from '$lib/services/batches';
	import BatchList from '$lib/components/dashboard/BatchList.svelte';
	import Statistics from '$lib/components/dashboard/Statistics.svelte';
	import AlertsSection from '$lib/components/dashboard/AlertsSection.svelte';
	import AddBatchForm from '$lib/components/dashboard/AddBatchForm.svelte';
	 import ExportModal from '$lib/components/dashboard/ExportModal.svelte';
	import { authStore } from '$lib/stores/auth';

	let user = null;
	let isLoading = false;
	let showAddForm = false;
	let exportOpen = false;

	// Subscribe to auth store
	const unsubscribeAuth = authStore.subscribe((state) => {
		user = state.user;
	});

	// Load batches on mount and when user changes
	async function loadBatches() {
		if (!user) return;

		batchesStore.update(state => ({ ...state, isLoading: true, error: null }));

		try {
			const batches = await getUserBatches();
			batchesStore.update(state => ({
				...state,
				batches,
				isLoading: false
			}));
		} catch (error) {
			batchesStore.update(state => ({
				...state,
				error: error instanceof Error ? error.message : 'Failed to load batches',
				isLoading: false
			}));
		}
	}

	onMount(() => {
		loadBatches();
	});

	// Cleanup
	onDestroy(unsubscribeAuth);
</script>

<svelte:head>
	<title>Dashboard - KrishiRokkha</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
			<p class="mt-2 text-gray-600">Welcome back! Here's an overview of your farming batches.</p>
		</div>

		<div class="mb-8">
			<Statistics />
		</div>

		<div class="mb-8">
			<AlertsSection />
		</div>

		<div>
			<div class="flex justify-between items-center mb-6">
				<h2 class="text-2xl font-semibold text-gray-900">Your Batches</h2>
				<div class="flex items-center space-x-3">
					<button class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700" on:click={() => exportOpen = true}>
						Export
					</button>
					<button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" on:click={() => showAddForm = !showAddForm}>
						{#if showAddForm}Close{/if}
						{#if !showAddForm}Add New Batch{/if}
					</button>
				</div>
			</div>

			{#if showAddForm}
				<div class="mb-6">
					<AddBatchForm on:created={() => { showAddForm = false; loadBatches(); }} on:cancel={() => (showAddForm = false)} />
				</div>
			{/if}

			{#if exportOpen}
				<ExportModal on:close={() => (exportOpen = false)} />
			{/if}

			<BatchList />
		</div>
	</div>
</div>
