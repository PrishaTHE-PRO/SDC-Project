
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// This component is responsible for catching permission errors and throwing
// them in a way that the Next.js development overlay can display them.
export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: Error) => {
      if (error instanceof FirestorePermissionError) {
        // Throwing the error here will cause it to be displayed in the
        // Next.js development error overlay, which is exactly what we want
        // for debugging security rules.
        throw error;
      }
    };

    errorEmitter.on('permission-error', handleError);

    // No cleanup function is needed as the emitter lives for the app's lifetime.
    // However, if this component could unmount, you'd want to add a cleanup.
  }, []);

  // This component does not render anything.
  return null;
}
