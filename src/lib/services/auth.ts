import { authStore, type User } from '$lib/stores/auth';
import { signUpWithEmail, signInWithEmail, signInWithGoogle, signOutUser as firebaseSignOut, sendPasswordReset as firebaseSendPasswordReset, onAuthStateChanged,
	updateUserProfile, sendPhoneOTP as firebaseSendPhoneOTP, verifyPhoneOTP as firebaseVerifyPhoneOTP, setDocument, getCurrentUser as getFirebaseCurrentUser } from './firebase';
import { goto } from '$app/navigation';

// Initialize auth state listener
onAuthStateChanged((firebaseUser) => {
	if (firebaseUser) {
		const user: User = {
			uid: firebaseUser.uid,
			email: firebaseUser.email || '',
			displayName: firebaseUser.displayName || '',
			phoneNumber: firebaseUser.phoneNumber || undefined,
			photoURL: firebaseUser.photoURL || undefined,
			emailVerified: firebaseUser.emailVerified,
			phoneVerified: !!firebaseUser.phoneNumber
		};
		authStore.set({ user, isLoading: false, error: null });
	} else {
		authStore.set({ user: null, isLoading: false, error: null });
	}
});

export async function loginWithEmail(email: string, password: string): Promise<User> {
	try {
		authStore.update(state => ({ ...state, isLoading: true, error: null }));
		const user = await signInWithEmail(email, password);
		return user;
	} catch (error: any) {
		const errorMessage = error.message || 'Login failed';
		authStore.update(state => ({ ...state, isLoading: false, error: errorMessage }));
		throw error;
	}
}

export async function registerWithEmail(email: string, password: string, displayName: string): Promise<User> {
	try {
		authStore.update(state => ({ ...state, isLoading: true, error: null }));
		const user = await signUpWithEmail(email, password, displayName);
		return user;
	} catch (error: any) {
		const errorMessage = error.message || 'Registration failed';
		authStore.update(state => ({ ...state, isLoading: false, error: errorMessage }));
		throw error;
	}
}

export async function loginWithGoogle(): Promise<User> {
	try {
		authStore.update(state => ({ ...state, isLoading: true, error: null }));
		const user = await signInWithGoogle();
		return user;
	} catch (error: any) {
		const errorMessage = error.message || 'Google sign-in failed';
		authStore.update(state => ({ ...state, isLoading: false, error: errorMessage }));
		throw error;
	}
}

export async function logout(): Promise<void> {
	try {
		await firebaseSignOut();
		goto('/auth/login');
	} catch (error: any) {
		console.error('Logout error:', error);
		throw error;
	}
}

export async function resetPassword(email: string): Promise<void> {
	try {
		await firebaseSendPasswordReset(email);
	} catch (error: any) {
		throw error;
	}
}

export async function verifyPhoneOTP(phoneNumber: string, otp: string): Promise<void> {
	// Deprecated: use verifyPhoneOTPWithId which accepts verificationId + code.
	throw new Error('Use verifyPhoneOTPWithId(verificationId, code) instead');
}

export async function sendPhoneOTP(phoneNumber: string, recaptchaContainerId = 'recaptcha-container'): Promise<string> {
	try {
		return await firebaseSendPhoneOTP(phoneNumber, recaptchaContainerId);
	} catch (error: any) {
		throw error;
	}
}

export async function verifyPhoneOTPWithId(verificationId: string, code: string): Promise<void> {
	try {
		await firebaseVerifyPhoneOTP(verificationId, code);
	} catch (error: any) {
		throw error;
	}
}

export async function updateProfileData(updates: { displayName?: string; photoURL?: string; language?: string; }): Promise<void> {
	try {
		await updateUserProfile({ displayName: updates.displayName, photoURL: updates.photoURL });
		const fbUser = getFirebaseCurrentUser();
		if (fbUser) {
			// Persist profile fields to Firestore users collection
			const docData: Record<string, any> = {};
			if (updates.displayName !== undefined) docData.displayName = updates.displayName;
			if (updates.language !== undefined) docData.language = updates.language;
			if (Object.keys(docData).length > 0) {
				await setDocument('users', fbUser.uid, docData, true);
			}
		}
	} catch (error: any) {
		throw error;
	}
}

export function getCurrentUser(): User | null {
	let user: User | null = null;
	authStore.subscribe(state => {
		user = state.user;
	})();
	return user;
}