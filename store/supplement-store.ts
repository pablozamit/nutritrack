import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserSupplement } from "@/types";
import { collection, addDoc, deleteDoc, getDocs, onSnapshot, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import { useAuthStore } from './auth-store';
import { usePointsStore } from './points-store';

interface SupplementState {
  userSupplements: UserSupplement[];
  isLoading: boolean;
  error: string | null;
  addSupplement: (supplement: Omit<UserSupplement, 'id'>) => Promise<void>;
  deleteSupplement: (id: string) => Promise<void>;
  getUserSupplements: (uid: string) => Promise<void>;
  subscribeToUserSupplements: (uid: string) => () => void;
  markSupplementTaken: (id: string) => Promise<void>;
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
          lastTakenAt: [],
        });
        set(state => ({
          userSupplements: [...state.userSupplements, { ...supplement, id: docRef.id, createdAt: new Date().toISOString(), lastTakenAt: [] }]
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
      },

      markSupplementTaken: async (id) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        const timestamp = new Date().toISOString();
        await updateDoc(doc(db, `users/${user.id}/supplements/${id}`), {
          lastTakenAt: arrayUnion(timestamp),
        });
        set((state) => ({
          userSupplements: state.userSupplements.map((s) =>
            s.id === id
              ? { ...s, lastTakenAt: [...(s.lastTakenAt || []), timestamp] }
              : s
          ),
        }));
        await usePointsStore.getState().processDailyAdherence();
      }
    }),
    {
      name: "supplement-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
