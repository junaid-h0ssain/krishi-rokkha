<script lang="ts">
	import { loginWithGoogle } from '$lib/services/auth';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let { disabled = false, text = 'Continue with Google' } = $props();

	async function handleGoogleLogin() {
		try {
			const user = await loginWithGoogle();
			dispatch('success', { user });
		} catch (error) {
			dispatch('error', { error });
		}
	}
</script>

<button class="google-btn" on:click={handleGoogleLogin} {disabled}>
	{#if disabled}
		<span class="spinner"></span>
		{text.replace('Continue', 'Signing')}
	{:else}
		{text}
	{/if}
</button>

<style>
	.google-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 0.75rem;
		background: #4285f4;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.2s;
	}

	.google-btn:hover:not(:disabled) {
		background: #3367d6;
	}

	.google-btn:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid #ffffff;
		border-top: 2px solid transparent;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-right: 0.5rem;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
</style>