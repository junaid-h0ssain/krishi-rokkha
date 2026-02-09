/**
 * Lazy loading utilities for images and components
 * Implements intersection observer for efficient lazy loading
 */

/**
 * Lazy load images using Intersection Observer
 * @param {HTMLImageElement} img - Image element to lazy load
 * @param {Object} options - Configuration options
 * @returns {void}
 */
export function lazyLoadImage(img, options = {}) {
	const {
		rootMargin = '50px',
		threshold = 0.01
	} = options;

	if (!('IntersectionObserver' in window)) {
		// Fallback for browsers without IntersectionObserver support
		img.src = img.dataset.src;
		img.removeAttribute('data-src');
		return;
	}

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const img = entry.target;
				img.src = img.dataset.src;
				img.removeAttribute('data-src');
				observer.unobserve(img);
			}
		});
	}, {
		rootMargin,
		threshold
	});

	observer.observe(img);
}

/**
 * Lazy load all images with data-src attribute
 * @param {Object} options - Configuration options
 * @returns {void}
 */
export function lazyLoadAllImages(options = {}) {
	const images = document.querySelectorAll('img[data-src]');
	images.forEach((img) => lazyLoadImage(img, options));
}

/**
 * Preload critical resources
 * @param {string[]} urls - Array of resource URLs to preload
 * @param {string} as - Resource type (script, style, image, font, etc.)
 * @returns {void}
 */
export function preloadResource(urls, as = 'script') {
	urls.forEach((url) => {
		const link = document.createElement('link');
		link.rel = 'preload';
		link.as = as;
		link.href = url;
		document.head.appendChild(link);
	});
}

/**
 * Prefetch resources for faster navigation
 * @param {string[]} urls - Array of resource URLs to prefetch
 * @returns {void}
 */
export function prefetchResource(urls) {
	urls.forEach((url) => {
		const link = document.createElement('link');
		link.rel = 'prefetch';
		link.href = url;
		document.head.appendChild(link);
	});
}

/**
 * Dynamically import a component (code splitting)
 * @param {Function} importFn - Dynamic import function
 * @returns {Promise} - Promise that resolves to the component
 */
export async function lazyLoadComponent(importFn) {
	try {
		const module = await importFn();
		return module.default;
	} catch (error) {
		console.error('Failed to load component:', error);
		throw error;
	}
}

/**
 * Svelte action for lazy loading images
 * Usage: <img use:lazyLoad data-src="image.jpg" alt="..." />
 * @param {HTMLImageElement} node - Image element
 * @param {Object} options - Configuration options
 * @returns {Object} - Svelte action lifecycle object
 */
export function lazyLoad(node, options = {}) {
	lazyLoadImage(node, options);

	return {
		destroy() {
			// Cleanup if needed
		}
	};
}

/**
 * Svelte action for preloading resources on hover
 * Usage: <a use:prefetchOnHover href="/page">Link</a>
 * @param {HTMLElement} node - Element to attach prefetch listener
 * @returns {Object} - Svelte action lifecycle object
 */
export function prefetchOnHover(node) {
	const handleMouseEnter = () => {
		const href = node.getAttribute('href');
		if (href) {
			prefetchResource([href]);
		}
	};

	node.addEventListener('mouseenter', handleMouseEnter);

	return {
		destroy() {
			node.removeEventListener('mouseenter', handleMouseEnter);
		}
	};
}
