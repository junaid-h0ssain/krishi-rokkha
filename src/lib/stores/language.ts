import { writable } from 'svelte/store';

export type Language = 'en' | 'bn';

const stored = localStorage.getItem('language');
export const languageStore = writable<Language>(stored === 'bn' ? 'bn' : 'en');

languageStore.subscribe(value => localStorage.setItem('language', value));