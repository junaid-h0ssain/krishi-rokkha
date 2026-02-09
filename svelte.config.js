import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		// Code splitting configuration - routes are automatically code-split by SvelteKit
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self'],
				'script-src': ['self', 'unsafe-inline'],
				'style-src': ['self', 'unsafe-inline']
			}
		},
		// Environment variables configuration
		env: {
			publicPrefix: 'VITE_'
		}
	}
};

export default config;
