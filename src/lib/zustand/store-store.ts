import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StoreRestResponse } from '../api';

interface StoreState {
  selectedStore: StoreRestResponse | null;
  setSelectedStore: (store: StoreRestResponse) => void;
  clearSelectedStore: () => void;
}

export const useStoreStore = create<StoreState>()(
  persist(
    (set) => ({
      selectedStore: null,
      setSelectedStore: (store) => set({ selectedStore: store }),
      clearSelectedStore: () => set({ selectedStore: null })
    }),
    {
      name: 'store-storage' // unique name for localStorage
    }
  )
);
