<script lang="ts">
	import '../app.css';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { authStore } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import LanguageToggle from '$lib/components/common/LanguageToggle.svelte';

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
	</header>
	<main>
		{@render children()}
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
