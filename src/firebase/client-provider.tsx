
'use client';

import { useEffect, useState } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

// This provider is responsible for initializing Firebase on the client-side.
// It should be used as a wrapper around the main layout or app component.
export const FirebaseClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [firebase, setFirebase] = useState<{
    firebaseApp: FirebaseApp | null;
    auth: Auth | null;
    firestore: Firestore | null;
  }>({ firebaseApp: null, auth: null, firestore: null });

  useEffect(() => {
    // This effect runs once on the client after the component mounts.
    const { firebaseApp, auth, firestore } = initializeFirebase();
    setFirebase({ firebaseApp, auth, firestore });
  }, []);

  if (!firebase.firebaseApp) {
    // You can render a loading spinner here if you'd like.
    // For now, we'll just return null to prevent the app from rendering
    // before Firebase is ready.
    return null;
  }
  
  return (
    <FirebaseProvider
      firebaseApp={firebase.firebaseApp}
      auth={firebase.auth}
      firestore={firebase.firestore}
    >
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
};
