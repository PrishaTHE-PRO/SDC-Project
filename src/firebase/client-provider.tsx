'use client';

import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';

// This provider is responsible for initializing Firebase on the client-side.
// It should be used as a wrapper around the main layout or app component.
export const FirebaseClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { firebaseApp, auth, firestore } = initializeFirebase();
  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      auth={auth}
      firestore={firestore}
    >
      {children}
    </FirebaseProvider>
  );
};
