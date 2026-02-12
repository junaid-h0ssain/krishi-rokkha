import { writable } from 'svelte/store';
import { queueAction, cacheResource, getCachedResource } from '../services/offline';

import { writable } from 'svelte/store';

export interface Batch {
	id: string;
	name: string;
	cropType: string;
	healthStatus: 'healthy' | 'at-risk' | 'diseased';
	riskLevel: 'low' | 'medium' | 'high';
	location: string;
	createdAt: string | Date;
	updatedAt: string | Date;
}

export interface BatchesState {
	batches: Batch[];
	isLoading: boolean;
	error: string | null;
}

export const batchesStore = writable<BatchesState>({
	batches: [],
	isLoading: false,
	error: null
});

// Load batches from offline cache key `batches`
export function loadBatchesFromCache() {
	const cached = getCachedResource('batches');
	if (cached && Array.isArray(cached)) {
		batchesStore.update(s => ({ ...s, batches: cached }));
	}
}

// Save current batches to cache
export function saveBatchesToCache() {
	let current: BatchesState;
	const unsub = batchesStore.subscribe(s => (current = s));
	unsub();
	cacheResource('batches', current!.batches);
}

// Create a batch while offline: update store and queue the create action
export function createBatchOffline(batch: Omit<Batch, 'id' | 'createdAt' | 'updatedAt'>) {
	const id = Date.now().toString();
	const now = new Date().toISOString();
	const newBatch: Batch = { ...batch, id, createdAt: now, updatedAt: now };

	batchesStore.update(s => ({ ...s, batches: [newBatch, ...s.batches] }));

	// Queue the create action so it will be synced when online
	queueAction({ type: 'create', collection: 'batches', data: newBatch });

	// persist to cache
	saveBatchesToCache();

	return newBatch;
}