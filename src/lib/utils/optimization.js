/**
 * Build optimization utilities
 * Handles performance optimizations like preloading and lazy loading
 */

/**
 * Initialize performance optimizations
 * Should be called in the root layout
 * @returns {void}
 */
export function initializeOptimizations() {
	if (typeof window === 'undefined') return;

	// Preload critical resources
	preloadCriticalResources();

	// Setup lazy loading for images
	setupLazyLoading();

	// Setup prefetch on link hover
	setupPrefetchOnHover();
}

/**
 * Preload critical resources for faster initial load
 * @returns {void}
 */
function preloadCriticalResources() {
	// Preload Firebase SDK
	const firebaseScripts = [
		'https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js',
		'https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js',
		'https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js'
	];

	firebaseScripts.forEach((url) => {
		const link = document.createElement('link');
		link.rel = 'preload';
		link.as = 'script';
		link.href = url;
		document.head.appendChild(link);
	});

	// Prefetch common route bundles
	const commonRoutes = ['/weather', '/ai-scanner', '/profile'];
	commonRoutes.forEach((route) => {
		const link = document.createElement('link');
		link.rel = 'prefetch';
		link.href = route;
		document.head.appendChild(link);
	});
}

/**
 * Setup lazy loading for images with data-src attribute
 * @returns {void}
 */
function setupLazyLoading() {
	if (!('IntersectionObserver' in window)) {
		// Fallback for older browsers
		const images = document.querySelectorAll('img[data-src]');
		images.forEach((img) => {
			img.src = img.dataset.src;
			img.removeAttribute('data-src');
		});
		return;
	}

	const imageObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const img = entry.target;
				if (img.dataset.src) {
					img.src = img.dataset.src;
					img.removeAttribute('data-src');
					imageObserver.unobserve(img);
				}
			}
		});
	}, {
		rootMargin: '50px',
		threshold: 0.01
	});

	// Observe all images with data-src
	document.querySelectorAll('img[data-src]').forEach((img) => {
		imageObserver.observe(img);
	});

	// Observe new images added dynamically
	const mutationObserver = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			mutation.addedNodes.forEach((node) => {
				if (node.nodeType === 1) {
					const images = node.querySelectorAll?.('img[data-src]') || [];
					images.forEach((img) => {
						imageObserver.observe(img);
					});
				}
			});
		});
	});

	mutationObserver.observe(document.body, {
		childList: true,
		subtree: true
	});
}

/**
 * Setup prefetch on link hover for faster navigation
 * @returns {void}
 */
function setupPrefetchOnHover() {
	document.addEventListener('mouseover', (e) => {
		const link = e.target.closest('a[href]');
		if (link && link.href && !link.href.includes('http')) {
			const prefetchLink = document.createElement('link');
			prefetchLink.rel = 'prefetch';
			prefetchLink.href = link.href;
			document.head.appendChild(prefetchLink);
		}
	});
}

/**
 * Report bundle size metrics (for development/monitoring)
 * @returns {void}
 */
export function reportBundleMetrics() {
	if (typeof window === 'undefined' || !window.performance) return;

	// Report when page is fully loaded
	window.addEventListener('load', () => {
		const perfData = window.performance.timing;
		const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

		console.log(`Page load time: ${pageLoadTime}ms`);

		// Report to analytics if available
		if (window.gtag) {
			window.gtag('event', 'page_load_time', {
				value: pageLoadTime
			});
		}
	});
}

/**
 * Monitor Core Web Vitals
 * @returns {void}
 */
export function monitorWebVitals() {
	if (typeof window === 'undefined') return;

	// Largest Contentful Paint (LCP)
	if ('PerformanceObserver' in window) {
		try {
			const lcpObserver = new PerformanceObserver((list) => {
				const entries = list.getEntries();
				const lastEntry = entries[entries.length - 1];
				console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
			});
			lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
		} catch (e) {
			// LCP not supported
		}
	}

	// First Input Delay (FID) / Interaction to Next Paint (INP)
	if ('PerformanceObserver' in window) {
		try {
			const fidObserver = new PerformanceObserver((list) => {
				const entries = list.getEntries();
				entries.forEach((entry) => {
					console.log('FID:', entry.processingDuration);
				});
			});
			fidObserver.observe({ entryTypes: ['first-input'] });
		} catch (e) {
			// FID not supported
		}
	}

	// Cumulative Layout Shift (CLS)
	if ('PerformanceObserver' in window) {
		try {
			const clsObserver = new PerformanceObserver((list) => {
				const entries = list.getEntries();
				let clsValue = 0;
				entries.forEach((entry) => {
					if (!entry.hadRecentInput) {
						clsValue += entry.value;
					}
				});
				console.log('CLS:', clsValue);
			});
			clsObserver.observe({ entryTypes: ['layout-shift'] });
		} catch (e) {
			// CLS not supported
		}
	}
}
