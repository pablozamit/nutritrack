import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserSupplement } from "@/types";
import { collection, addDoc, deleteDoc, getDocs, onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import { useAuthStore } from './auth-store';

interface SupplementState {
  userSupplements: UserSupplement[];
  isLoading: boolean;
  error: string | null;
  addSupplement: (supplement: Omit<UserSupplement, 'id'>) => Promise<void>;
  deleteSupplement: (id: string) => Promise<void>;
  getUserSupplements: (uid: string) => Promise<void>;
  subscribeToUserSupplements: (uid: string) => () => void;
}

export const useSupplementStore = create<SupplementState>()(
  persist(
    (set, get) => ({
      userSupplements: [],
      isLoading: false,
      error: null,
      

      addSupplement: async (supplement) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        const docRef = await addDoc(collection(db, `users/${user.id}/supplements`), {
          ...supplement,
          createdAt: new Date().toISOString(),
        });
        set(state => ({
          userSupplements: [...state.userSupplements, { ...supplement, id: docRef.id, createdAt: new Date().toISOString() }]
        }));
      },

      deleteSupplement: async (id) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        await deleteDoc(doc(db, `users/${user.id}/supplements/${id}`));
        set(state => ({
          userSupplements: state.userSupplements.filter(s => s.id !== id)
        }));
      },

      getUserSupplements: async (uid) => {
        const snap = await getDocs(collection(db, `users/${uid}/supplements`));
        const data = snap.docs.map(d => ({ ...(d.data() as any), id: d.id }));
        set({ userSupplements: data });
      },

      subscribeToUserSupplements: (uid) => {
        const unsub = onSnapshot(collection(db, `users/${uid}/supplements`), (snap) => {
          const data = snap.docs.map(d => ({ ...(d.data() as any), id: d.id }));
          set({ userSupplements: data });
        });
        return unsub;
      }
    }),
    {
      name: "supplement-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
