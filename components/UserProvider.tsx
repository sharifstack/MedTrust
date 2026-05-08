'use client';

import React, { createContext, useContext, useState } from 'react';

type User = {
  id: string;
  name: string;
  fullName: string;
  email: string;
  avatar: string;
  insurance: string;
  memberId: string;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    lastCheckedDate: string;
    dailyChecks: number;
  };
};

type UserContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children, initialUser }: { children: React.ReactNode; initialUser: User }) {
  const [user, setUser] = useState<User>(initialUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
