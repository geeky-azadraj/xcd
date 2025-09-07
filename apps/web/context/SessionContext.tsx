'use client';

import { createContext, useContext, useState } from 'react';

export interface User {
  id: string;
  email?: string;
  phone_number?: string;
  username?: string;
  full_name?: string;
  roles: string;
}

export interface SessionContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isOnline: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const SessionContext = createContext<
  | {
      session: SessionContextType;
      setSession: React.Dispatch<React.SetStateAction<SessionContextType>>;
    }
  | undefined
>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionData, setSessionData] = useState<SessionContextType>({
    isAuthenticated: false,
    isLoading: true,
    isOnline: true,
    user: null,
    accessToken: null,
    refreshToken: null,
  });

  return (
    <SessionContext.Provider
      value={{ session: sessionData, setSession: setSessionData }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
