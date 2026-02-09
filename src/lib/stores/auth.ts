import { writable } from 'svelte/store';

export interface User {
	uid: string;
	email: string;
	displayName: string;
	phoneNumber?: string;
	photoURL?: string;
	emailVerified: boolean;
	phoneVerified: boolean;
}

export interface AuthState {
	user: User | null;
	isLoading: boolean;
	error: string | null;
}

export const authStore = writable<AuthState>({
	user: null,
	isLoading: false,
	error: null
});