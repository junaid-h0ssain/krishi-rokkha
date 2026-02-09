import { initializeApp } from 'firebase/app';
import {
	getAuth,
	type Auth,
	type User,
	onAuthStateChanged,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	sendPasswordResetEmail,
	signOut,
	updateProfile,
	GoogleAuthProvider,
	signInWithPopup,
	PhoneAuthProvider,
	signInWithPhoneNumber,
	RecaptchaVerifier,
	updatePhoneNumber,
	linkWithCredential,
	type UserCredential
} from 'firebase/auth';
import {
	getFirestore,
	type Firestore,
	doc,
	setDoc,
	getDoc,
	getDocs,
	collection,
	addDoc,
	query,
	where,
	updateDoc,
	deleteDoc,
	onSnapshot,
	type DocumentSnapshot,
	type QuerySnapshot,
	type Unsubscribe
} from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth: Auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db: Firestore = getFirestore(app);

// Google OAuth Provider
export const googleProvider = new GoogleAuthProvider();

// Phone Auth Provider
export const phoneProvider = new PhoneAuthProvider(auth);

/**
 * Authentication Service Functions
 */

/**
 * Sign up a new user with email and password
 */
export async function signUpWithEmail(
	email: string,
	password: string,
	displayName: string
): Promise<User> {
	const userCredential = await createUserWithEmailAndPassword(auth, email, password);
	await updateProfile(userCredential.user, { displayName });
	return userCredential.user;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string): Promise<User> {
	const userCredential = await signInWithEmailAndPassword(auth, email, password);
	return userCredential.user;
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(): Promise<User> {
	const userCredential = await signInWithPopup(auth, googleProvider);
	return userCredential.user;
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(email: string): Promise<void> {
	await sendPasswordResetEmail(auth, email);
}

/**
 * Sign out the current user
 */
export async function signOutUser(): Promise<void> {
	await signOut(auth);
}

/**
 * Get the current authenticated user
 */
export function getCurrentUser(): User | null {
	return auth.currentUser;
}

/**
 * Listen to authentication state changes
 */
export function onAuthStateChangedListener(callback: (user: User | null) => void): Unsubscribe {
	return onAuthStateChanged(auth, callback);
}

/**
 * Update user profile
 */
export async function updateUserProfile(updates: {
	displayName?: string;
	photoURL?: string;
}): Promise<void> {
	if (auth.currentUser) {
		await updateProfile(auth.currentUser, updates);
	}
}

/**
 * Send OTP to phone number
 */
export async function sendPhoneOTP(
	phoneNumber: string,
	recaptchaContainerId: string
): Promise<string> {
	const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
		size: 'invisible',
		callback: () => {
			// reCAPTCHA solved
		}
	});

	const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
	return confirmationResult.verificationId;
}

/**
 * Verify OTP code
 */
export async function verifyPhoneOTP(verificationId: string, code: string): Promise<UserCredential> {
	const phoneAuthCredential = phoneProvider.credential(verificationId, code);
	return await linkWithCredential(auth.currentUser!, phoneAuthCredential);
}

/**
 * Update phone number for current user
 */
export async function updateUserPhoneNumber(phoneCredential: any): Promise<void> {
	if (auth.currentUser) {
		await updatePhoneNumber(auth.currentUser, phoneCredential);
	}
}

/**
 * Firestore Service Functions
 */

/**
 * Create a new document in a collection
 */
export async function createDocument(
	collectionName: string,
	data: Record<string, any>
): Promise<string> {
	const docRef = await addDoc(collection(db, collectionName), {
		...data,
		createdAt: new Date(),
		updatedAt: new Date()
	});
	return docRef.id;
}

/**
 * Set a document with a specific ID
 */
export async function setDocument(
	collectionName: string,
	docId: string,
	data: Record<string, any>,
	merge = false
): Promise<void> {
	await setDoc(doc(db, collectionName, docId), {
		...data,
		updatedAt: new Date()
	}, { merge });
}

/**
 * Get a single document by ID
 */
export async function getDocument(
	collectionName: string,
	docId: string
): Promise<DocumentSnapshot> {
	return await getDoc(doc(db, collectionName, docId));
}

/**
 * Get all documents from a collection
 */
export async function getDocuments(collectionName: string): Promise<QuerySnapshot> {
	return await getDocs(collection(db, collectionName));
}

/**
 * Query documents with conditions
 */
export async function queryDocuments(
	collectionName: string,
	conditions: Array<[string, string, any]>
): Promise<QuerySnapshot> {
	const queryConstraints = conditions.map(([field, operator, value]) => {
		return where(field, operator as any, value);
	});

	const q = query(collection(db, collectionName), ...queryConstraints);
	return await getDocs(q);
}

/**
 * Update a document
 */
export async function updateDocument(
	collectionName: string,
	docId: string,
	data: Record<string, any>
): Promise<void> {
	await updateDoc(doc(db, collectionName, docId), {
		...data,
		updatedAt: new Date()
	});
}

/**
 * Delete a document
 */
export async function deleteDocument(collectionName: string, docId: string): Promise<void> {
	await deleteDoc(doc(db, collectionName, docId));
}

/**
 * Listen to real-time updates on a document
 */
export function onDocumentSnapshot(
	collectionName: string,
	docId: string,
	callback: (data: any) => void
): Unsubscribe {
	return onSnapshot(doc(db, collectionName, docId), (snapshot) => {
		if (snapshot.exists()) {
			callback(snapshot.data());
		}
	});
}

/**
 * Listen to real-time updates on a collection query
 */
export function onCollectionSnapshot(
	collectionName: string,
	conditions: Array<[string, string, any]> = [],
	callback: (data: any[]) => void
): Unsubscribe {
	const queryConstraints = conditions.map(([field, operator, value]) => {
		return where(field, operator as any, value);
	});

	const q = query(collection(db, collectionName), ...queryConstraints);

	return onSnapshot(q, (snapshot) => {
		const data = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data()
		}));
		callback(data);
	});
}

/**
 * Batch write operations
 */
export async function batchWrite(operations: Array<{
	type: 'set' | 'update' | 'delete';
	collection: string;
	docId: string;
	data?: Record<string, any>;
}>): Promise<void> {
	// Note: For true batch operations, use writeBatch from Firebase
	// This is a simplified version that executes operations sequentially
	for (const op of operations) {
		if (op.type === 'set' && op.data) {
			await setDocument(op.collection, op.docId, op.data);
		} else if (op.type === 'update' && op.data) {
			await updateDocument(op.collection, op.docId, op.data);
		} else if (op.type === 'delete') {
			await deleteDocument(op.collection, op.docId);
		}
	}
}

export default {
	auth,
	db,
	googleProvider,
	phoneProvider,
	signUpWithEmail,
	signInWithEmail,
	signInWithGoogle,
	sendPasswordReset,
	signOutUser,
	getCurrentUser,
	onAuthStateChangedListener,
	updateUserProfile,
	sendPhoneOTP,
	verifyPhoneOTP,
	updateUserPhoneNumber,
	createDocument,
	setDocument,
	getDocument,
	getDocuments,
	queryDocuments,
	updateDocument,
	deleteDocument,
	onDocumentSnapshot,
	onCollectionSnapshot,
	batchWrite
};
