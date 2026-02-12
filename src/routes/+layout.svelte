<script lang="ts">
	import '../app.css';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { authStore } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import LanguageToggle from '$lib/components/common/LanguageToggle.svelte';
	import ErrorBoundary from '$lib/components/common/ErrorBoundary.svelte';
	import NotificationCenter from '$lib/components/common/NotificationCenter.svelte';
	import { onMount } from 'svelte';
	import { initOfflineService } from '$lib/services/offline';
	import { createBatch, updateBatch, deleteBatch } from '$lib/services/batches';

	let { children, data } = $props();

	$effect(() => {
		// Check authentication and redirect accordingly
		if (!$authStore.isLoading) {
			const isAuthPage = $page.url.pathname.startsWith('/auth/');
			const hasUser = $authStore.user;

			if (!hasUser && !isAuthPage) {
				goto('/auth/login');
			} else if (hasUser && isAuthPage) {
				goto('/');
			}
		}
	});

	// Processor to handle queued sync actions
	async function syncProcessor(action: any): Promise<boolean> {
		try {
			if (action.collection === 'batches') {
				if (action.type === 'create') {
					// strip client-only fields
					const { id, createdAt, updatedAt, ...payload } = action.data || {};
					await createBatch(payload);
					return true;
				}

				if (action.type === 'update') {
					const data = action.data || {};
					if (!data.id) return false;
					const { id, ...updates } = data;
					await updateBatch(id, updates);
					return true;
				}

				if (action.type === 'delete') {
					const data = action.data || {};
					if (!data.id) return false;
					await deleteBatch(data.id);
					return true;
				}
			}

			// unknown collection/action: don't remove from queue
			return false;
		} catch (e) {
			// leave action in queue to retry later
			console.warn('syncProcessor error', e);
			return false;
		}
	}

	onMount(() => {
		initOfflineService(syncProcessor);
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if $authStore.isLoading}
	<div class="loading-screen">
		<div class="spinner"></div>
		<p>Loading...</p>
	</div>
{:else}
	<header class="app-header">
		<LanguageToggle />
		<NotificationCenter />
	</header>
	<main>
		<ErrorBoundary>
			{@render children()}
		</ErrorBoundary>
	</main>
{/if}

<style>
	.loading-screen {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: white;
		z-index: 9999;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #f3f3f3;
		border-top: 4px solid #007bff;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.app-header {
		position: fixed;
		top: 0;
		right: 0;
		padding: 1rem;
		z-index: 1000;
	}

	main {
		padding-top: 4rem; /* Space for fixed header */
	}
</style>
