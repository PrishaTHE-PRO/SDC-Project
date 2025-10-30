
'use client';

import {
  createContext,
  useContext,
  ReactNode,
} from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
  isLoading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(
  undefined
);

export const FirebaseProvider = ({
  children,
  firebaseApp,
  auth,
  firestore,
}: {
  children: ReactNode;
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}) => {
  // isLoading is true if any of the core Firebase services are not yet available.
  const isLoading = !firebaseApp || !auth || !firestore;

  return (
    <FirebaseContext.Provider
      value={{
        app: firebaseApp,
        auth: auth,
        firestore: firestore,
        isLoading,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const useFirebaseApp = () => {
  const { app, isLoading } = useFirebase();
  return { app, isLoading };
};

export const useAuth = () => {
  const { auth, isLoading } = useFirebase();
  return { auth, isLoading };
};

export const useFirestore = () => {
  const { firestore, isLoading } = useFirebase();
  return { firestore, isLoading };
};
