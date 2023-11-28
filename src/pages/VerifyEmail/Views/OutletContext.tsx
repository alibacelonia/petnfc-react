// OutletContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';

interface OutletContextType {
  isSuccess: boolean;
}

const OutletContext = createContext<OutletContextType | undefined>(undefined);

export const OutletProvider: React.FC<{ value: OutletContextType; children: ReactNode }> = ({ value, children }) => (
  <OutletContext.Provider value={value}>{children}</OutletContext.Provider>
);

export const useOutletContext = () => {
  const context = useContext(OutletContext);
  if (!context) {
    throw new Error('useOutletContext must be used within an OutletProvider');
  }
  return context;
};
