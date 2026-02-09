<script lang="ts">
	import RegisterForm from '$lib/components/auth/RegisterForm.svelte';
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
	<title>Register - KrishiRokkha</title>
</svelte:head>

<div class="register-page">
	<RegisterForm />

	{#if $authStore.isLoading}
		<div class="loading">
			Loading...
		</div>
	{/if}
</div>

<style>
	.register-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 2rem;
		background: #f5f5f5;
	}

	.loading {
		margin-top: 1rem;
		color: #666;
	}
</style>