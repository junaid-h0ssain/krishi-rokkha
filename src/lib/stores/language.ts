import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Language = 'en' | 'bn';

const initial: Language = (browser && localStorage.getItem('language') === 'bn') ? 'bn' : 'en';
export const languageStore = writable<Language>(initial);

// Persist language preference only in the browser
if (browser) {
	languageStore.subscribe((value) => localStorage.setItem('language', value));
}