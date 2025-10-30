'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User, getAuth } from 'firebase/auth';
import { useFirebaseApp } from '../provider';

export function useUser() {
  const { app: firebaseApp } = useFirebaseApp();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!firebaseApp) {
      // Firebase app might still be initializing
      setIsLoading(true);
      return;
    }
    
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [firebaseApp]);

  return { user, isLoading };
}
