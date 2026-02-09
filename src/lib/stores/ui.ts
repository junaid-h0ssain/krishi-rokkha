import { writable } from 'svelte/store';

export interface Notification {
	id: string;
	type: 'success' | 'error' | 'warning' | 'info';
	message: string;
	duration?: number; // in milliseconds
}

export interface UIState {
	modals: Record<string, boolean>;
	notifications: Notification[];
	isLoading: boolean;
}

export const uiStore = writable<UIState>({
	modals: {},
	notifications: [],
	isLoading: false
});

// Notification management functions
export function addNotification(notification: Omit<Notification, 'id'>) {
	const id = Date.now().toString();
	uiStore.update(state => ({
		...state,
		notifications: [...state.notifications, { ...notification, id }]
	}));

	// Auto-remove after duration
	if (notification.duration) {
		setTimeout(() => removeNotification(id), notification.duration);
	}
}

export function removeNotification(id: string) {
	uiStore.update(state => ({
		...state,
		notifications: state.notifications.filter(n => n.id !== id)
	}));
}

export function clearNotifications() {
	uiStore.update(state => ({
		...state,
		notifications: []
	}));
}

export function setLoading(loading: boolean) {
	uiStore.update(state => ({
		...state,
		isLoading: loading
	}));
}

export function openModal(modalId: string) {
	uiStore.update(state => ({
		...state,
		modals: { ...state.modals, [modalId]: true }
	}));
}

export function closeModal(modalId: string) {
	uiStore.update(state => ({
		...state,
		modals: { ...state.modals, [modalId]: false }
	}));
}