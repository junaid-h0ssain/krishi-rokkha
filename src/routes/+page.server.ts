import type { PageLoad } from './$types';

export const load: PageLoad = async ({ depends }) => {
	// For now, data loading is handled client-side
	// In a full implementation, this would load batches server-side
	// using Firebase Admin SDK and user session

	depends('app:batches');

	return {
		batches: [] // Placeholder - actual loading happens in component
	};
};