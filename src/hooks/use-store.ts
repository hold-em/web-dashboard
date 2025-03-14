import { useState, useEffect } from 'react';

interface Store {
  id: number;
  name: string;
}

export const useStore = () => {
  const [currentStore, setCurrentStore] = useState<Store | null>(null);

  useEffect(() => {
    // In a real implementation, this would fetch from localStorage or context
    // For now, we'll just set a default store
    setCurrentStore({
      id: 1,
      name: 'Default Store'
    });
  }, []);

  return {
    currentStore,
    setCurrentStore
  };
};
