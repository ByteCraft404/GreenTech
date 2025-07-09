import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Greenhouse {
  id: string;
  name: string;
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  greenhouses: Greenhouse[];
}

interface AppContextType {
  selectedFarm: Farm | null;
  selectedGreenhouse: Greenhouse | null;
  setSelectedFarm: (farm: Farm | null) => void;
  setSelectedGreenhouse: (greenhouse: Greenhouse | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState<Greenhouse | null>(null);

  return (
    <AppContext.Provider value={{
      selectedFarm,
      selectedGreenhouse,
      setSelectedFarm,
      setSelectedGreenhouse
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};