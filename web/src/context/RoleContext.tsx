import React, { createContext, useContext, useState } from 'react';
import { Role } from '../types';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('rider');
  const [activeTab, setActiveTab] = useState<string>('Home');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        isSearchOpen,
        setIsSearchOpen,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
