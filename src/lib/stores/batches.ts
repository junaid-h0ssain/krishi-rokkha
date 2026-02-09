import { writable } from 'svelte/store';

export interface Batch {
	id: string;
	name: string;
	cropType: string;
	healthStatus: 'healthy' | 'at-risk' | 'diseased';
	riskLevel: 'low' | 'medium' | 'high';
	location: string;
	createdAt: Date;
	updatedAt: Date;
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