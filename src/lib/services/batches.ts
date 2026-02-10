import { getFirestore, collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { Batch } from '$lib/stores/batches';
import { browser } from '$app/environment';

let db: ReturnType<typeof getFirestore> | undefined = undefined;
let auth: ReturnType<typeof getAuth> | undefined = undefined;

function getDb() {
	if (!db) db = getFirestore();
	return db!;
}

function getAuthInstance() {
	if (!auth) auth = getAuth();
	return auth!;
}

export async function createBatch(batchData: Omit<Batch, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
	if (!browser) throw new Error('createBatch must be called in the browser');
	const authInst = getAuthInstance();
	const user = authInst.currentUser;
	if (!user) throw new Error('User not authenticated');

	const batch: Omit<Batch, 'id'> = {
		...batchData,
		createdAt: new Date(),
		updatedAt: new Date()
	};

	const docRef = await addDoc(collection(getDb(), 'batches'), {
		...batch,
		userId: user.uid
	});

	return docRef.id;
}

export async function getUserBatches(): Promise<Batch[]> {
	if (!browser) throw new Error('getUserBatches must be called in the browser');
	const authInst = getAuthInstance();
	const user = authInst.currentUser;
	if (!user) throw new Error('User not authenticated');

	const q = query(
		collection(getDb(), 'batches'),
		where('userId', '==', user.uid),
		orderBy('createdAt', 'desc')
	);

	const querySnapshot = await getDocs(q);
	const batches: Batch[] = [];

	querySnapshot.forEach((docSnap) => {
		const data = docSnap.data() as any;
		const createdAt = data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt)) : new Date();
		const updatedAt = data.updatedAt ? (data.updatedAt.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)) : new Date();

		batches.push({
			id: docSnap.id,
			name: data.name,
			cropType: data.cropType,
			healthStatus: data.healthStatus,
			riskLevel: data.riskLevel,
			location: data.location,
			createdAt,
			updatedAt
		});
	});

	return batches;
}

export async function updateBatch(batchId: string, updates: Partial<Omit<Batch, 'id' | 'createdAt'>>): Promise<void> {
	if (!browser) throw new Error('updateBatch must be called in the browser');
	const authInst = getAuthInstance();
	const user = authInst.currentUser;
	if (!user) throw new Error('User not authenticated');

	const batchRef = doc(getDb(), 'batches', batchId);
	await updateDoc(batchRef, {
		...updates,
		updatedAt: new Date()
	});
}

export async function deleteBatch(batchId: string): Promise<void> {
	if (!browser) throw new Error('deleteBatch must be called in the browser');
	const authInst = getAuthInstance();
	const user = authInst.currentUser;
	if (!user) throw new Error('User not authenticated');

	const batchRef = doc(getDb(), 'batches', batchId);
	await deleteDoc(batchRef);
}
