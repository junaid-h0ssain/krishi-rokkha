<script lang="ts">
	import { loginWithEmail, loginWithGoogle } from '$lib/services/auth';
	import { goto } from '$app/navigation';
	import { t } from '$lib/services/i18n';

	let email = $state('');
	let password = $state('');
	let isSubmitting = $state(false);

	async function handleEmailLogin() {
		if (!email || !password) return;

		isSubmitting = true;
		try {
			await loginWithEmail(email, password);
			goto('/');
		} catch (error) {
			console.error('Login error:', error);
		} finally {
			isSubmitting = false;
		}
	}

	async function handleGoogleLogin() {
		isSubmitting = true;
		try {
			await loginWithGoogle();
			goto('/');
		} catch (error) {
			console.error('Google login error:', error);
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="login-form">
	<h2>{t('loginToKrishiRokkha')}</h2>

	<form on:submit|preventDefault={handleEmailLogin}>
		<div class="form-group">
			<label for="email">{t('email')}</label>
			<input
				type="email"
				id="email"
				bind:value={email}
				required
				placeholder={t('email')}
			/>
		</div>

		<div class="form-group">
			<label for="password">{t('password')}</label>
			<input
				type="password"
				id="password"
				bind:value={password}
				required
				placeholder={t('password')}
			/>
		</div>

		<button type="submit" disabled={isSubmitting}>
			{#if isSubmitting}
				{t('loggingIn')}
			{:else}
				{t('login')}
			{/if}
		</button>
	</form>

	<div class="divider">
		<span>or</span>
	</div>

	<button class="google-btn" on:click={handleGoogleLogin} disabled={isSubmitting}>
		{#if isSubmitting}
			{t('signingIn')}
		{:else}
			{t('continueWithGoogle')}
		{/if}
	</button>

	<p class="links">
		<a href="/auth/register">{t('dontHaveAccount')} {t('register')}</a>
		<a href="/auth/reset-password">{t('forgotPassword')}</a>
	</p>
</div>

<style>
	.login-form {
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

	.google-btn {
		background: #4285f4;
	}

	.divider {
		text-align: center;
		margin: 1rem 0;
		position: relative;
	}

	.divider::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		height: 1px;
		background: #ddd;
	}

	.divider span {
		background: white;
		padding: 0 1rem;
		color: #666;
	}

	.links {
		text-align: center;
	}

	.links a {
		display: block;
		margin: 0.5rem 0;
		color: #007bff;
		text-decoration: none;
	}

	.links a:hover {
		text-decoration: underline;
	}
</style>