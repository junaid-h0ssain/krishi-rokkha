<script lang="ts">
	import PasswordResetForm from '$lib/components/auth/PasswordResetForm.svelte';
</script>

<svelte:head>
	<title>Reset Password - KrishiRokkha</title>
</svelte:head>

<div class="reset-page">
	<PasswordResetForm />
</div>

<style>
	.reset-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 2rem;
		background: #f5f5f5;
	}
</style>