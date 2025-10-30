'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, query, collection, type DocumentData, type Query, type CollectionReference } from 'firebase/firestore';
import { useFirestore } from '../provider';

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


export function useCollection<T>(q: Query | CollectionReference | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!q) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data = querySnapshot.docs.map(doc => snapshotToData<T>(doc));
        setData(data);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching collection:", err);
        setError(err);
        setIsLoading(false);
        setData(null);
      }
    );

    return () => unsubscribe();
  }, [q]);

  return { data, isLoading, error };
}
