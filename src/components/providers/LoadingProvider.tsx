'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import LoadingScreen from '@/components/ui/LoadingScreen';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export default function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Initial app loading
  useEffect(() => {
    if (isInitialLoad) {
      // Simulate initial app loading time
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
        setIsLoading(false);
      }, 4000); // 4 seconds for the beautiful loading animation

      return () => clearTimeout(timer);
    }
  }, [isInitialLoad]);

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const value = {
    isLoading,
    setIsLoading,
    showLoading,
    hideLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      <LoadingScreen 
        isLoading={isLoading} 
        onLoadingComplete={handleLoadingComplete}
      />
      {!isLoading && children}
    </LoadingContext.Provider>
  );
}