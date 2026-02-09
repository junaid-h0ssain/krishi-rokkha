import { authStore } from '$lib/stores/auth';
import { redirect } from '@sveltejs/kit';

export async function load({ url, locals }) {
	// For now, we'll handle auth checks in the client-side layout
	// In a full implementation, you'd check server-side session here
	// and pass user data via locals

	return {
		user: null // This would be populated from server-side auth check
	};
}