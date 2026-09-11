// FLUENTRA Firebase Authentication & Cloud Firestore Service
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  Firestore
} from 'firebase/firestore';
import { UserProfile } from '../types/progress';

// Firebase configuration supporting both VITE_FIREBASE_* and FIREBASE_* variable names
const firebaseConfig = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY || (import.meta.env as any).FIREBASE_API_KEY || '').trim(),
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || (import.meta.env as any).FIREBASE_AUTH_DOMAIN || '').trim(),
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID || (import.meta.env as any).FIREBASE_PROJECT_ID || '').trim(),
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || (import.meta.env as any).FIREBASE_STORAGE_BUCKET || '').trim(),
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || (import.meta.env as any).FIREBASE_MESSAGING_SENDER_ID || '').trim(),
  appId: (import.meta.env.VITE_FIREBASE_APP_ID || (import.meta.env as any).FIREBASE_APP_ID || '').trim(),
  measurementId: (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || (import.meta.env as any).FIREBASE_MEASUREMENT_ID || '').trim()
};

// Check if Firebase credentials are fully configured
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY'
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });

    // Safely initialize analytics in browser environment
    if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
      import('firebase/analytics').then(({ getAnalytics, isSupported }) => {
        isSupported().then(supported => {
          if (supported && app) {
            getAnalytics(app);
          }
        }).catch(() => {});
      }).catch(() => {});
    }
  } catch (err) {
    console.warn('Firebase initialization error:', err);
  }
}

export class FirebaseService {
  public isReady(): boolean {
    return isFirebaseConfigured && auth !== null;
  }

  public getAuth(): Auth | null {
    return auth;
  }

  public getDb(): Firestore | null {
    return db;
  }

  /**
   * Real Google OAuth Pop-up Sign-In via Firebase Auth
   */
  public async signInWithGoogle(): Promise<{ user: FirebaseUser; isNewUser: boolean } | null> {
    if (!auth || !googleProvider) {
      console.info('Firebase not configured with API keys. Operating in offline-first mode.');
      return null;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const isNewUser = (result as any)?._tokenResponse?.isNewUser || false;
      return { user: result.user, isNewUser };
    } catch (error: any) {
      console.error('Firebase Google Sign-In Error:', error.message);
      throw error;
    }
  }

  /**
   * Email and password sign up via Firebase Auth
   */
  public async registerWithEmail(email: string, pass: string): Promise<FirebaseUser | null> {
    if (!auth) return null;
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    return cred.user;
  }

  /**
   * Email and password sign in via Firebase Auth
   */
  public async signInWithEmail(email: string, pass: string): Promise<FirebaseUser | null> {
    if (!auth) return null;
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return cred.user;
  }

  /**
   * Sign out from Firebase
   */
  public async signOut(): Promise<void> {
    if (auth) {
      await fbSignOut(auth);
    }
  }

  /**
   * Sync user progress to Cloud Firestore
   */
  public async syncUserProfileToCloud(profile: UserProfile): Promise<void> {
    if (!db || !profile.email) return;

    try {
      const userDocRef = doc(db, 'users', profile.id || profile.email);
      await setDoc(userDocRef, {
        ...profile,
        lastCloudSync: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Failed to sync profile to Firestore:', err);
    }
  }

  /**
   * Fetch cloud profile from Firestore
   */
  public async fetchUserProfileFromCloud(identifier: string): Promise<UserProfile | null> {
    if (!db || !identifier) return null;

    try {
      const userDocRef = doc(db, 'users', identifier);
      const snapshot = await getDoc(userDocRef);
      if (snapshot.exists()) {
        return snapshot.data() as UserProfile;
      }
    } catch (err) {
      console.warn('Failed to fetch profile from Firestore:', err);
    }
    return null;
  }

  /**
   * Listen to Firebase Auth state changes
   */
  public onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    if (!auth) {
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(auth, callback);
  }
}

export const firebaseService = new FirebaseService();
