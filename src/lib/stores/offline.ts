import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface SyncAction {
	id: string;
	type: 'create' | 'update' | 'delete';
	collection: string;
	data: any;
	timestamp: Date;
}

export interface OfflineState {
	isOnline: boolean;
	syncQueue: SyncAction[];
	cachedData: Record<string, any>;
}

export const offlineStore = writable<OfflineState>({
	isOnline: browser ? navigator.onLine : true,
	syncQueue: [],
	cachedData: {}
});

// Track online/offline status only in the browser
if (browser) {
	window.addEventListener('online', () => {
		offlineStore.update(state => ({ ...state, isOnline: true }));
	});

	window.addEventListener('offline', () => {
		offlineStore.update(state => ({ ...state, isOnline: false }));
	});
}

// Sync queue management functions
export function addToSyncQueue(action: Omit<SyncAction, 'id' | 'timestamp'>) {
	const syncAction: SyncAction = {
		...action,
		id: Date.now().toString(),
		timestamp: new Date()
	};

	offlineStore.update(state => ({
		...state,
		syncQueue: [...state.syncQueue, syncAction]
	}));
}

export function removeFromSyncQueue(actionId: string) {
	offlineStore.update(state => ({
		...state,
		syncQueue: state.syncQueue.filter(action => action.id !== actionId)
	}));
}

export function clearSyncQueue() {
	offlineStore.update(state => ({
		...state,
		syncQueue: []
	}));
}

export function cacheData(key: string, data: any) {
	offlineStore.update(state => ({
		...state,
		cachedData: { ...state.cachedData, [key]: data }
	}));
}

export function getCachedData(key: string) {
	let cached: any = null;
	offlineStore.subscribe(state => {
		cached = state.cachedData[key];
	})();
	return cached;
}

export function clearCache() {
	offlineStore.update(state => ({
		...state,
		cachedData: {}
	}));
}