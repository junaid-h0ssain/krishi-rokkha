<script>
	import { lazyLoad } from '$lib/utils/lazyLoad.js';

	/**
	 * @type {string}
	 */
	export let src = '';

	/**
	 * @type {string}
	 */
	export let alt = '';

	/**
	 * @type {string}
	 */
	export let placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3C/svg%3E';

	/**
	 * @type {string}
	 */
	export let width = '';

	/**
	 * @type {string}
	 */
	export let height = '';

	/**
	 * @type {string}
	 */
	export let className = '';

	/**
	 * @type {Object}
	 */
	export let lazyOptions = {
		rootMargin: '50px',
		threshold: 0.01
	};

	let imgElement;
	let isLoaded = false;

	function handleLoad() {
		isLoaded = true;
	}
</script>

<img
	bind:this={imgElement}
	use:lazyLoad={lazyOptions}
	data-src={src}
	src={placeholder}
	{alt}
	{width}
	{height}
	class={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-75'} ${className}`}
	on:load={handleLoad}
	on:error
/>

<style>
	img {
		display: block;
		max-width: 100%;
		height: auto;
	}
</style>
