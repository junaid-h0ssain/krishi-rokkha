<script lang="ts">
	import { resetPassword } from '$lib/services/auth';
	import { goto } from '$app/navigation';

	let email = $state('');
	let isSubmitting = $state(false);
	let message = $state('');
	let isSuccess = $state(false);

	async function handleReset() {
		if (!email) return;

		isSubmitting = true;
		message = '';
		try {
			await resetPassword(email);
			isSuccess = true;
			message = 'Password reset email sent! Check your inbox.';
		} catch (error: any) {
			message = error.message || 'Failed to send reset email';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="reset-form">
	<h2>Reset Password</h2>
	<p>Enter your email address and we'll send you a link to reset your password.</p>

	<form on:submit|preventDefault={handleReset}>
		<div class="form-group">
			<label for="email">Email</label>
			<input
				type="email"
				id="email"
				bind:value={email}
				required
				placeholder="Enter your email"
			/>
		</div>

		{#if message}
			<div class="message" class:success={isSuccess}>
				{message}
			</div>
		{/if}

		<button type="submit" disabled={isSubmitting || !email}>
			{#if isSubmitting}
				Sending...
			{:else}
				Send Reset Link
			{/if}
		</button>
	</form>

	<p class="links">
		<a href="/auth/login">Back to Login</a>
	</p>
</div>

<style>
	.reset-form {
		max-width: 400px;
		margin: 2rem auto;
		padding: 2rem;
		border: 1px solid #ddd;
		border-radius: 8px;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
	}

	input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
	}

	button {
		width: 100%;
		padding: 0.75rem;
		background: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		margin-bottom: 1rem;
	}

	button:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.message {
		padding: 0.75rem;
		border-radius: 4px;
		margin-bottom: 1rem;
		font-weight: 500;
	}

	.message.success {
		background: #d4edda;
		color: #155724;
		border: 1px solid #c3e6cb;
	}

	.message:not(.success) {
		background: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
	}

	.links {
		text-align: center;
	}

	.links a {
		color: #007bff;
		text-decoration: none;
	}

	.links a:hover {
		text-decoration: underline;
	}
</style>