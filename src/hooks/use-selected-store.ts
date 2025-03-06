import { useStoreStore } from '@/lib/zustand/store-store';

export const useSelectedStore = () => {
  const { selectedStore, setSelectedStore, clearSelectedStore } =
    useStoreStore();

  return {
    selectedStore,
    setSelectedStore,
    clearSelectedStore,
    // Helper function to check if a store is selected
    hasSelectedStore: !!selectedStore
  };
};
