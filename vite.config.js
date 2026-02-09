import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	build: {
		// Optimize bundle size - use default minifier (esbuild)
		minify: 'esbuild',
		// Code splitting configuration
		rollupOptions: {
			output: {
				// Manual chunks for vendor libraries
				manualChunks: {
					// Vendor libraries
					vendor: ['svelte']
				}
			}
		},
		// Chunk size warnings
		chunkSizeWarningLimit: 500,
		// Source maps for production debugging
		sourcemap: false,
		// CSS code splitting
		cssCodeSplit: true,
		// Report compressed size
		reportCompressedSize: true
	},
	// Optimization for development
	optimizeDeps: {
		include: ['firebase/app', 'firebase/auth', 'firebase/firestore']
	}
});
