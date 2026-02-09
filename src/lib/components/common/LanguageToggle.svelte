<script lang="ts">
	import { languageStore } from '$lib/stores/language';
	import { setLanguage, getSupportedLanguages, t } from '$lib/services/i18n';

	let { class: className = '' } = $props();

	const languages = getSupportedLanguages();

	function handleLanguageChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		setLanguage(target.value as 'en' | 'bn');
	}
</script>

<div class="language-toggle {className}">
	<label for="language-select" class="sr-only">{t('language')}</label>
	<select
		id="language-select"
		value={$languageStore}
		onchange={handleLanguageChange}
		class="language-select"
	>
		{#each languages as lang}
			<option value={lang.code}>{lang.nativeName}</option>
		{/each}
	</select>
</div>

<style>
	.language-toggle {
		display: inline-block;
	}

	.language-select {
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		background: white;
		font-size: 0.9rem;
		cursor: pointer;
		min-width: 120px;
	}

	.language-select:focus {
		outline: none;
		border-color: #007bff;
		box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>