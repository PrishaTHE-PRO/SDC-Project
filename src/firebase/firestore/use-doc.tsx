'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, type DocumentReference, type DocumentData } from 'firebase/firestore';

function snapshotToData<T>(snapshot: DocumentData): T {
    if (!snapshot.exists()) {
        return undefined as T;
    }
    const data = snapshot.data();

    // Convert Firestore Timestamps to ISO strings
    Object.keys(data).forEach(key => {
        if (data[key] instanceof Object && data[key].toDate) { // Check if it's a Timestamp
            data[key] = data[key].toDate().toISOString();
        }
    });

    return { ...data, id: snapshot.id } as T;
}

export function useDoc<T>(ref: DocumentReference | null) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ref) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const unsubscribe = onSnapshot(
      ref,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setData(snapshotToData<T>(docSnapshot));
        } else {
          setData(null); // Document does not exist
        }
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching document:", err);
        setError(err);
        setIsLoading(false);
        setData(null);
      }
    );

    return () => unsubscribe();
  }, [ref]);

  return { data, isLoading, error };
}
