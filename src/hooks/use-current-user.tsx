'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { User } from '@/lib/types';

interface CurrentUserContextType {
  user: User | null;
}

const CurrentUserContext = createContext<CurrentUserContextType>({ user: null });

export const CurrentUserProvider = ({ children, user }: { children: ReactNode; user?: User | null }) => {
  const value = { user: user || null };
  const parentContext = useContext(CurrentUserContext);

  // If a user is passed via props, we are on the server or at the root, so we provide the value.
  // We also check if a parent context already exists. If it does, we don't need to re-provide.
  if (user !== undefined || !parentContext) {
    return (
      <CurrentUserContext.Provider value={value}>
        {children}
      </CurrentUserContext.Provider>
    );
  }
  
  // This allows nested client components to use the context from a parent provider
  // without re-providing and causing state loss.
  return <>{children}</>;
};

export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);
  if (context === undefined) {
    // This error is a safeguard, but our logic above should prevent it.
    throw new Error('useCurrentUser must be used within a CurrentUserProvider');
  }
  return context;
};
