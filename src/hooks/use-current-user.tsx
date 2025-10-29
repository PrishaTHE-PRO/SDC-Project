'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { User } from '@/lib/types';

interface CurrentUserContextType {
  user: User | null;
}

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

export const CurrentUserProvider = ({ children, user }: { children: ReactNode; user: User | null }) => {
  return (
    <CurrentUserContext.Provider value={{ user }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);
  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a CurrentUserProvider');
  }
  return context;
};
