import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Authentication instance & Google Provider
export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Firestore Database instance (using databaseId specified in config)
export const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId || undefined);

// Super admin email designated by system owner
export const SUPER_ADMIN_EMAIL = 'mohamedmaged3g@gmail.com';
