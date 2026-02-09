<script lang="ts">
	import { registerWithEmail, loginWithGoogle } from '$lib/services/auth';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let displayName = $state('');
	let isSubmitting = $state(false);
	let error = $state('');

	function validateForm() {
		if (!email || !password || !displayName) {
			error = 'All fields are required';
			return false;
		}
		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return false;
		}
		if (password.length < 6) {
			error = 'Password must be at least 6 characters';
			return false;
		}
		return true;
	}

	async function handleEmailRegister() {
		if (!validateForm()) return;

		isSubmitting = true;
		error = '';
		try {
			await registerWithEmail(email, password, displayName);
			goto('/profile'); // Redirect to profile setup
		} catch (err: any) {
			error = err.message || 'Registration failed';
		} finally {
			isSubmitting = false;
		}
	}

	async function handleGoogleRegister() {
		isSubmitting = true;
		error = '';
		try {
			await loginWithGoogle();
			goto('/profile'); // Redirect to profile setup
		} catch (err: any) {
			error = err.message || 'Google registration failed';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="register-form">
	<h2>Create Account</h2>

	<form on:submit|preventDefault={handleEmailRegister}>
		<div class="form-group">
			<label for="displayName">Full Name</label>
			<input
				type="text"
				id="displayName"
				bind:value={displayName}
				required
				placeholder="Enter your full name"
			/>
		</div>

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

		<div class="form-group">
			<label for="password">Password</label>
			<input
				type="password"
				id="password"
				bind:value={password}
				required
				placeholder="Create a password"
				minlength="6"
			/>
		</div>

		<div class="form-group">
			<label for="confirmPassword">Confirm Password</label>
			<input
				type="password"
				id="confirmPassword"
				bind:value={confirmPassword}
				required
				placeholder="Confirm your password"
			/>
		</div>

		{#if error}
			<div class="error-message">{error}</div>
		{/if}

		<button type="submit" disabled={isSubmitting}>
			{#if isSubmitting}
				Creating account...
			{:else}
				Create Account
			{/if}
		</button>
	</form>

	<div class="divider">
		<span>or</span>
	</div>

	<button class="google-btn" on:click={handleGoogleRegister} disabled={isSubmitting}>
		{#if isSubmitting}
			Signing up...
		{:else}
			Continue with Google
		{/if}
	</button>

	<p class="links">
		<a href="/auth/login">Already have an account? Login</a>
	</p>
</div>

<style>
	.register-form {
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
		background: #28a745;
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

	.error-message {
		color: #dc3545;
		font-size: 0.9rem;
		margin-bottom: 1rem;
		padding: 0.5rem;
		background: #f8d7da;
		border: 1px solid #f5c6cb;
		border-radius: 4px;
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
		color: #007bff;
		text-decoration: none;
	}

	.links a:hover {
		text-decoration: underline;
	}
</style>