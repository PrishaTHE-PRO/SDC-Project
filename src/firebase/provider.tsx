'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
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
  const [app, setApp] = useState<FirebaseApp | null>(firebaseApp);
  const [authInstance, setAuthInstance] = useState<Auth | null>(auth);
  const [firestoreInstance, setFirestoreInstance] = useState<Firestore | null>(
    firestore
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setApp(firebaseApp);
    setAuthInstance(auth);
    setFirestoreInstance(firestore);
    setIsLoading(false);
  }, [firebaseApp, auth, firestore]);

  return (
    <FirebaseContext.Provider
      value={{
        app,
        auth: authInstance,
        firestore: firestoreInstance,
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
