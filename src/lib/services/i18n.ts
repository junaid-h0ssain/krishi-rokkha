import { languageStore } from '$lib/stores/language';

// Translation dictionaries
const translations = {
	en: {
		// Authentication
		login: 'Login',
		register: 'Register',
		email: 'Email',
		password: 'Password',
		confirmPassword: 'Confirm Password',
		fullName: 'Full Name',
		loginToKrishiRokkha: 'Login to KrishiRokkha',
		createAccount: 'Create Account',
		continueWithGoogle: 'Continue with Google',
		dontHaveAccount: 'Don\'t have an account?',
		alreadyHaveAccount: 'Already have an account?',
		forgotPassword: 'Forgot password?',
		resetPassword: 'Reset Password',
		sendResetLink: 'Send Reset Link',
		passwordResetEmailSent: 'Password reset email sent! Check your inbox.',
		allFieldsRequired: 'All fields are required',
		passwordsDoNotMatch: 'Passwords do not match',
		passwordMinLength: 'Password must be at least 6 characters',
		loggingIn: 'Logging in...',
		creatingAccount: 'Creating account...',
		signingIn: 'Signing in...',
		sendingResetLink: 'Sending...',

		// Placeholders
		enterFullName: 'Enter your full name',
		enterEmail: 'Enter your email',
		createPassword: 'Create a password',
		confirmYourPassword: 'Confirm your password',
		registrationFailed: 'Registration failed',
		googleRegistrationFailed: 'Google registration failed',
		failedToSendResetEmail: 'Failed to send reset email',
		backToLogin: 'Back to Login',
		resetPasswordDescription: 'Enter your email address and we\'ll send you a link to reset your password.',
		or: 'or',

		// Navigation
		dashboard: 'Dashboard',
		weather: 'Weather',
		aiScanner: 'AI Scanner',
		profile: 'Profile',

		// Common
		loading: 'Loading...',
		error: 'Error',
		success: 'Success',
		cancel: 'Cancel',
		save: 'Save',
		delete: 'Delete',
		edit: 'Edit',
		view: 'View',
		close: 'Close',
		back: 'Back',
		next: 'Next',
		submit: 'Submit',
		reset: 'Reset',
		search: 'Search',
		filter: 'Filter',
		sort: 'Sort',
		export: 'Export',

		// Dashboard
		welcome: 'Welcome',
		yourBatches: 'Your Batches',
		addBatch: 'Add Batch',
		batchName: 'Batch Name',
		cropType: 'Crop Type',
		healthStatus: 'Health Status',
		riskLevel: 'Risk Level',
		location: 'Location',
		created: 'Created',
		updated: 'Updated',
		statistics: 'Statistics',
		alerts: 'Alerts',
		noBatches: 'No batches found',
		batchCreated: 'Batch created successfully',
		batchUpdated: 'Batch updated successfully',
		batchDeleted: 'Batch deleted successfully',

		// Weather
		currentWeather: 'Current Weather',
		forecast: 'Forecast',
		temperature: 'Temperature',
		humidity: 'Humidity',
		windSpeed: 'Wind Speed',
		precipitation: 'Precipitation',
		selectLocation: 'Select Location',
		locationRequired: 'Location is required',

		// AI Scanner
		uploadImage: 'Upload Image',
		scanResults: 'Scan Results',
		diseaseDetected: 'Disease Detected',
		noDiseaseDetected: 'No disease detected',
		confidence: 'Confidence',
		recommendations: 'Recommendations',
		saveResult: 'Save Result',
		imageRequired: 'Please select an image',
		scanning: 'Scanning...',

		// Profile
		personalInfo: 'Personal Information',
		phoneNumber: 'Phone Number',
		verifyPhone: 'Verify Phone',
		phoneVerified: 'Phone Verified',
		sendOTP: 'Send OTP',
		enterOTP: 'Enter OTP',
		verify: 'Verify',
		otpSent: 'OTP sent to your phone',
		invalidOTP: 'Invalid OTP',
		language: 'Language',
		english: 'English',
		bengali: 'বাংলা',

		// Errors
		networkError: 'Network error. Please check your connection.',
		serverError: 'Server error. Please try again later.',
		validationError: 'Please check your input and try again.',
		unauthorized: 'You are not authorized to perform this action.',
		notFound: 'The requested resource was not found.',
		unknownError: 'An unknown error occurred. Please try again.'
	},
	bn: {
		// Authentication
		login: 'লগইন',
		register: 'রেজিস্টার',
		email: 'ইমেইল',
		password: 'পাসওয়ার্ড',
		confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
		fullName: 'পুরো নাম',
		loginToKrishiRokkha: 'কৃষি রক্ষা-তে লগইন করুন',
		createAccount: 'অ্যাকাউন্ট তৈরি করুন',
		continueWithGoogle: 'গুগল দিয়ে চালিয়ে যান',
		dontHaveAccount: 'অ্যাকাউন্ট নেই?',
		alreadyHaveAccount: 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
		forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
		resetPassword: 'পাসওয়ার্ড রিসেট করুন',
		sendResetLink: 'রিসেট লিঙ্ক পাঠান',
		passwordResetEmailSent: 'পাসওয়ার্ড রিসেট ইমেইল পাঠানো হয়েছে! আপনার ইনবক্স চেক করুন।',
		allFieldsRequired: 'সব ফিল্ড প্রয়োজন',
		passwordsDoNotMatch: 'পাসওয়ার্ড মিলছে না',
		passwordMinLength: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে',
		loggingIn: 'লগইন হচ্ছে...',
		creatingAccount: 'অ্যাকাউন্ট তৈরি হচ্ছে...',
		signingIn: 'সাইন ইন হচ্ছে...',
		sendingResetLink: 'পাঠানো হচ্ছে...',

		// Placeholders
		enterFullName: 'আপনার পুরো নাম লিখুন',
		enterEmail: 'আপনার ইমেইল লিখুন',
		createPassword: 'পাসওয়ার্ড তৈরি করুন',
		confirmYourPassword: 'আপনার পাসওয়ার্ড নিশ্চিত করুন',
		registrationFailed: 'রেজিস্ট্রেশন ব্যর্থ হয়েছে',
		googleRegistrationFailed: 'গুগল রেজিস্ট্রেশন ব্যর্থ হয়েছে',
		failedToSendResetEmail: 'রিসেট ইমেইল পাঠাতে ব্যর্থ হয়েছে',
		backToLogin: 'লগইনে ফিরে যান',
		resetPasswordDescription: 'আপনার ইমেইল ঠিকানা লিখুন এবং আমরা আপনাকে পাসওয়ার্ড রিসেট করার জন্য একটি লিঙ্ক পাঠাব।',
		or: 'অথবা',

		// Navigation
		dashboard: 'ড্যাশবোর্ড',
		weather: 'আবহাওয়া',
		aiScanner: 'এআই স্ক্যানার',
		profile: 'প্রোফাইল',

		// Common
		loading: 'লোড হচ্ছে...',
		error: 'ত্রুটি',
		success: 'সফল',
		cancel: 'বাতিল',
		save: 'সংরক্ষণ',
		delete: 'মুছুন',
		edit: 'সম্পাদনা',
		view: 'দেখুন',
		close: 'বন্ধ',
		back: 'পিছনে',
		next: 'পরবর্তী',
		submit: 'জমা দিন',
		reset: 'রিসেট',
		search: 'অনুসন্ধান',
		filter: 'ফিল্টার',
		sort: 'সাজান',
		export: 'এক্সপোর্ট',

		// Dashboard
		welcome: 'স্বাগতম',
		yourBatches: 'আপনার ব্যাচগুলি',
		addBatch: 'ব্যাচ যোগ করুন',
		batchName: 'ব্যাচের নাম',
		cropType: 'ফসলের ধরন',
		healthStatus: 'স্বাস্থ্য অবস্থা',
		riskLevel: 'ঝুঁকির মাত্রা',
		location: 'অবস্থান',
		created: 'তৈরি হয়েছে',
		updated: 'আপডেট হয়েছে',
		statistics: 'পরিসংখ্যান',
		alerts: 'সতর্কতা',
		noBatches: 'কোন ব্যাচ পাওয়া যায়নি',
		batchCreated: 'ব্যাচ সফলভাবে তৈরি হয়েছে',
		batchUpdated: 'ব্যাচ সফলভাবে আপডেট হয়েছে',
		batchDeleted: 'ব্যাচ সফলভাবে মুছে ফেলা হয়েছে',

		// Weather
		currentWeather: 'বর্তমান আবহাওয়া',
		forecast: 'পূর্বাভাস',
		temperature: 'তাপমাত্রা',
		humidity: 'আর্দ্রতা',
		windSpeed: 'বাতাসের গতি',
		precipitation: 'বৃষ্টিপাত',
		selectLocation: 'অবস্থান নির্বাচন করুন',
		locationRequired: 'অবস্থান প্রয়োজন',

		// AI Scanner
		uploadImage: 'ছবি আপলোড করুন',
		scanResults: 'স্ক্যান ফলাফল',
		diseaseDetected: 'রোগ শনাক্ত হয়েছে',
		noDiseaseDetected: 'কোন রোগ শনাক্ত হয়নি',
		confidence: 'আত্মবিশ্বাস',
		recommendations: 'সুপারিশ',
		saveResult: 'ফলাফল সংরক্ষণ করুন',
		imageRequired: 'অনুগ্রহ করে একটি ছবি নির্বাচন করুন',
		scanning: 'স্ক্যান হচ্ছে...',

		// Profile
		personalInfo: 'ব্যক্তিগত তথ্য',
		phoneNumber: 'ফোন নম্বর',
		verifyPhone: 'ফোন যাচাই করুন',
		phoneVerified: 'ফোন যাচাই হয়েছে',
		sendOTP: 'OTP পাঠান',
		enterOTP: 'OTP লিখুন',
		verify: 'যাচাই করুন',
		otpSent: 'আপনার ফোনে OTP পাঠানো হয়েছে',
		invalidOTP: 'অবৈধ OTP',
		language: 'ভাষা',
		english: 'English',
		bengali: 'বাংলা',

		// Errors
		networkError: 'নেটওয়ার্ক ত্রুটি। অনুগ্রহ করে আপনার সংযোগ চেক করুন।',
		serverError: 'সার্ভার ত্রুটি। অনুগ্রহ করে পরে আবার চেষ্টা করুন।',
		validationError: 'অনুগ্রহ করে আপনার ইনপুট চেক করে আবার চেষ্টা করুন।',
		unauthorized: 'আপনার এই কাজটি করার অনুমতি নেই।',
		notFound: 'অনুরোধকৃত রিসোর্স পাওয়া যায়নি।',
		unknownError: 'একটি অজানা ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
	}
};

// Current language (reactive)
let currentLanguage = $state('en');

// Update current language when store changes
$effect(() => {
	currentLanguage = $languageStore;
});

/**
 * Get translated text for a key
 */
export function t(key: string, fallback?: string): string {
	const lang = translations[currentLanguage as keyof typeof translations] || translations.en;
	return lang[key as keyof typeof lang] || fallback || key;
}

/**
 * Get current language
 */
export function getCurrentLanguage(): string {
	return currentLanguage;
}

/**
 * Set language
 */
export function setLanguage(lang: 'en' | 'bn'): void {
	languageStore.set(lang);
}

/**
 * Check if a language is supported
 */
export function isLanguageSupported(lang: string): boolean {
	return lang === 'en' || lang === 'bn';
}

/**
 * Get all supported languages
 */
export function getSupportedLanguages(): Array<{ code: string; name: string; nativeName: string }> {
	return [
		{ code: 'en', name: 'English', nativeName: 'English' },
		{ code: 'bn', name: 'Bengali', nativeName: 'বাংলা' }
	];
}

/**
 * Format a message with placeholders
 * Usage: t('hello', { name: 'John' }) with translation "Hello {name}!"
 */
export function tFormat(key: string, params: Record<string, any> = {}, fallback?: string): string {
	let text = t(key, fallback);

	// Replace placeholders
	for (const [param, value] of Object.entries(params)) {
		text = text.replace(new RegExp(`{${param}}`, 'g'), String(value));
	}

	return text;
}