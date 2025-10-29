'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import type { User } from '@/lib/types';

interface CurrentUserContextType {
  user: User | null;
  isLoading: boolean;
}

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

export const CurrentUserProvider = ({ children, user: initialUser }: { children: ReactNode; user: User | null }) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(initialUser);
    setIsLoading(false);
  }, [initialUser]);

  return (
    <CurrentUserContext.Provider value={{ user, isLoading }}>
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
