
// IMPORTANT: This file is only intended for server-side code.
// It is NOT supposed to be used on the client.

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// This function should only be called from server-side code.
export function initializeServerFirebase(): {
  firebaseApp: FirebaseApp,
  firestore: Firestore,
} {
  // Use getApps() to check if Firebase has already been initialized.
  // This is important for Next.js which can re-run server-side code.
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const firestore = getFirestore(app);

  return { firebaseApp: app, firestore };
}
