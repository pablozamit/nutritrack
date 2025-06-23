import { create } from 'zustand';
import { CatalogSupplement } from '@/types';
import { db } from '@/lib/firestore';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface CatalogState {
  catalog: CatalogSupplement[];
  subscribe: () => () => void;
  add: (data: Omit<CatalogSupplement, 'id'>) => Promise<void>;
  update: (id: string, data: Partial<CatalogSupplement>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useCatalogStore = create<CatalogState>((set) => ({
  catalog: [],

  subscribe: () => {
    const ref = collection(db, 'catalog');
    const unsub = onSnapshot(ref, (snap) => {
      const list = snap.docs.map((d) => ({ ...(d.data() as Omit<CatalogSupplement, 'id'>), id: d.id }));
      set({ catalog: list });
    });
    return unsub;
  },

  add: async (data) => {
    await addDoc(collection(db, 'catalog'), data);
  },

  update: async (id, data) => {
    await updateDoc(doc(db, 'catalog', id), data);
  },

  remove: async (id) => {
    await deleteDoc(doc(db, 'catalog', id));
  },
}));
