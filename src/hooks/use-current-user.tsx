'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { User } from '@/lib/types';

interface CurrentUserContextType {
  user: User | null;
}

const CurrentUserContext = createContext<CurrentUserContextType>({ user: null });

export const CurrentUserProvider = ({ children, user }: { children: ReactNode; user?: User | null }) => {
  const value = { user: user || null };
  // If a user is passed, it's a server component render, we provide it.
  // Otherwise, we expect a parent provider to exist.
  if (user !== undefined) {
    return (
      <CurrentUserContext.Provider value={value}>
        {children}
      </CurrentUserContext.Provider>
    );
  }
  
  // This allows nested client components to use the context without needing a user prop
  return <>{children}</>
};

export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);
  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a CurrentUserProvider');
  }
  return context;
};
