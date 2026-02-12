// Minimal offline service: caching, localStorage persistence, sync queue, and conflict resolution stubs
import { offlineStore, addToSyncQueue, removeFromSyncQueue, cacheData } from '../stores/offline';
import { browser } from '$app/environment';

type SyncActionType = 'create' | 'update' | 'delete';

export interface SyncAction {
  id: string;
  type: SyncActionType;
  collection: string;
  data: any;
  timestamp: string;
}

const QUEUE_KEY = 'krishi_offline_sync_queue_v1';
const CACHE_KEY_PREFIX = 'krishi_offline_cache_v1:';

function persistQueue(queue: SyncAction[]) {
  try {
    if (!browser) return;
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.warn('Failed to persist sync queue', e);
  }
}

function loadPersistedQueue(): SyncAction[] {
  try {
    if (!browser) return [];
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Failed to load persisted sync queue', e);
    return [];
  }
}

export function cacheResource(key: string, data: any) {
  try {
    const storageKey = CACHE_KEY_PREFIX + key;
    if (!browser) return;
    localStorage.setItem(storageKey, JSON.stringify({ data, ts: Date.now() }));
    cacheData(key, data);
  } catch (e) {
    console.warn('Failed to cache resource', e);
  }
}

export function getCachedResource(key: string) {
  try {
    const storageKey = CACHE_KEY_PREFIX + key;
    if (!browser) return null;
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const doc = JSON.parse(raw);
    return doc.data;
  } catch (e) {
    console.warn('Failed to get cached resource', e);
    return null;
  }
}

export function queueAction(action: Omit<SyncAction, 'id' | 'timestamp'>) {
  const syncAction: SyncAction = {
    ...action,
    id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
    timestamp: new Date().toISOString()
  };

  // Update store queue and persist
  addToSyncQueue({
    type: syncAction.type,
    collection: syncAction.collection,
    data: syncAction.data
  } as any);

  // persist only in browser
  const persisted = loadPersistedQueue();
  persistQueue([...persisted, syncAction]);

  return syncAction.id;
}

export async function processQueue(processor: (action: SyncAction) => Promise<boolean>) {
  const queue = loadPersistedQueue();
  if (!queue.length) return;

  const remaining: SyncAction[] = [];

  for (const act of queue) {
    try {
      const ok = await processor(act);
      if (ok) {
        removeFromSyncQueue(act.id);
      } else {
        remaining.push(act);
      }
    } catch (e) {
      // keep in queue to retry later
      remaining.push(act);
    }
  }

  persistQueue(remaining);
}

// Very small conflict resolution heuristic: prefer latest timestamp; returns resolved object
export function resolveConflict(local: any, remote: any) {
  try {
    const localTs = local?.updatedAt ? new Date(local.updatedAt).getTime() : 0;
    const remoteTs = remote?.updatedAt ? new Date(remote.updatedAt).getTime() : 0;
    return localTs >= remoteTs ? local : remote;
  } catch (e) {
    return local;
  }
}

// Initialize the offline service: restore persisted queue into store and set up online handler
export function initOfflineService(processor: (action: SyncAction) => Promise<boolean>) {
  if (typeof window === 'undefined') return;

  // restore persisted queue into store
  const persisted = loadPersistedQueue();
  for (const act of persisted) {
    // add to store only if not already present
    addToSyncQueue({ type: act.type as any, collection: act.collection, data: act.data } as any);
  }

  // when back online, try to process queue
  window.addEventListener('online', () => {
    processQueue(processor).catch(err => console.warn('Error processing sync queue', err));
  });

  // attempt initial processing if online
  if (navigator.onLine) {
    processQueue(processor).catch(err => console.warn('Error processing sync queue', err));
  }
}

export default {
  cacheResource,
  getCachedResource,
  queueAction,
  processQueue,
  resolveConflict,
  initOfflineService
};
