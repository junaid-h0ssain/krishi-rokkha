<script lang="ts">
	import { resetPassword } from '$lib/services/auth';
	import { goto } from '$app/navigation';
	import { t } from '$lib/services/i18n';

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
			message = t('passwordResetEmailSent');
		} catch (error: any) {
			message = error.message || t('failedToSendResetEmail');
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="reset-form">
	<h2>{t('resetPassword')}</h2>
	<p>{t('resetPasswordDescription')}</p>

	<form on:submit|preventDefault={handleReset}>
		<div class="form-group">
			<label for="email">{t('email')}</label>
			<input
				type="email"
				id="email"
				bind:value={email}
				required
				placeholder={t('enterEmail')}
			/>
		</div>

		{#if message}
			<div class="message" class:success={isSuccess}>
				{message}
			</div>
		{/if}

		<button type="submit" disabled={isSubmitting || !email}>
			{#if isSubmitting}
				{t('sendingResetLink')}
			{:else}
				{t('sendResetLink')}
			{/if}
		</button>
	</form>

	<p class="links">
		<a href="/auth/login">{t('backToLogin')}</a>
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