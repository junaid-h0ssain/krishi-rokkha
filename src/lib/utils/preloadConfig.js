/**
 * Configuration for preloading critical resources
 * These resources are essential for initial page load and should be preloaded
 */

/**
 * Critical resources to preload on application startup
 * @type {Object}
 */
export const criticalResources = {
	// Firebase SDK - essential for authentication
	firebase: [
		'https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js',
		'https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js',
		'https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js'
	],
	// Fonts - improve perceived performance
	fonts: [
		// Add font URLs here if using web fonts
	],
	// Critical CSS - inline or preload
	styles: []
};

/**
 * Resources to prefetch for faster navigation
 * These are loaded after critical resources
 * @type {Object}
 */
export const prefetchResources = {
	// Route bundles for common navigation paths
	routes: [
		'/weather',
		'/ai-scanner',
		'/profile'
	],
	// Component bundles
	components: []
};

/**
 * Get critical resources for preloading
 * @returns {string[]} - Array of resource URLs
 */
export function getCriticalResources() {
	return Object.values(criticalResources).flat();
}

/**
 * Get prefetch resources
 * @returns {string[]} - Array of resource URLs
 */
export function getPrefetchResources() {
	return Object.values(prefetchResources).flat();
}

/**
 * Initialize preloading of critical resources
 * Call this in the root layout or app initialization
 * @returns {void}
 */
export function initializePreloading() {
	if (typeof window === 'undefined') return;

	// Preload critical resources
	const critical = getCriticalResources();
	critical.forEach((url) => {
		const link = document.createElement('link');
		link.rel = 'preload';
		link.as = 'script';
		link.href = url;
		document.head.appendChild(link);
	});

	// Prefetch route bundles
	const prefetch = getPrefetchResources();
	prefetch.forEach((url) => {
		const link = document.createElement('link');
		link.rel = 'prefetch';
		link.href = url;
		document.head.appendChild(link);
	});
}
