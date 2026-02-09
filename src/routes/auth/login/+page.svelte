<script lang="ts">
	import LoginForm from '$lib/components/auth/LoginForm.svelte';
	import { authStore } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	$effect(() => {
		// Redirect if already authenticated
		if ($authStore.user) {
			goto('/');
		}
	});
</script>

<svelte:head>
	<title>Login - KrishiRokkha</title>
</svelte:head>

<div class="login-page">
	<LoginForm />

	{#if $authStore.error}
		<div class="error-message">
			{$authStore.error}
		</div>
	{/if}

	{#if $authStore.isLoading}
		<div class="loading">
			Loading...
		</div>
	{/if}
</div>

<style>
	.login-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 2rem;
		background: #f5f5f5;
	}

	.error-message {
		margin-top: 1rem;
		padding: 1rem;
		background: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
		border-radius: 4px;
		max-width: 400px;
	}

	.loading {
		margin-top: 1rem;
		color: #666;
	}
</style>