import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "./auth-store";
import { useSupplementStore } from "./supplement-store";
import { db } from "@/lib/firestore";
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  increment,
  collection,
  collectionGroup,
  getDocs,
  query,
  orderBy,
  limit as limitDocs,
  where,
} from "firebase/firestore";
import { User } from "@/types";

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

interface PointsState {
  points: number;
  lastAdherenceDate: string | null;
  addPoints: (value: number) => Promise<void>;
  processDailyAdherence: () => Promise<void>;
  fetchPoints: () => Promise<void>;
  getRanking: (limit?: number) => Promise<User[]>;
  getUserRank: () => Promise<number | null>;
}

export const usePointsStore = create<PointsState>()(
  persist(
    (set, get) => ({
      points: 0,
      lastAdherenceDate: null,

      addPoints: async (value) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        const metaRef = doc(db, `users/${user.id}/meta`);
        await setDoc(metaRef, { points: 0 }, { merge: true });
        await updateDoc(metaRef, { points: increment(value) });
        const metaSnap = await getDoc(metaRef);
        const points = metaSnap.data()?.points || 0;
        set({ points });
        useAuthStore.getState().updateUser({ points });
        await updateDoc(doc(db, "users", user.id), { points });
      },

      fetchPoints: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        const metaRef = doc(db, `users/${user.id}/meta`);
        const snap = await getDoc(metaRef);
        const points = snap.exists() ? snap.data()?.points || 0 : 0;
        set({ points });
        useAuthStore.getState().updateUser({ points });
      },

      processDailyAdherence: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        const today = formatDate(new Date());
        if (get().lastAdherenceDate === today) return;

        const { userSupplements } = useSupplementStore.getState();
        const allTaken = userSupplements.every((s) => {
          if (!s.days.includes(new Date().getDay())) return true;
          return s.lastTakenAt?.some((t) => t.startsWith(today));
        });
        if (!allTaken) return;

        await get().addPoints(10);
        const yesterday = formatDate(new Date(Date.now() - 86400000));
        const currentStreak =
          get().lastAdherenceDate === yesterday ? (user.streak || 0) + 1 : 1;
        useAuthStore.getState().updateUser({ streak: currentStreak });
        await updateDoc(doc(db, "users", user.id), { streak: currentStreak });
        if (currentStreak % 3 === 0) {
          await get().addPoints(5);
        }
        set({ lastAdherenceDate: today });
      },

      getRanking: async (limit = 10) => {
        const q = query(
          collection(db, "users"),
          orderBy("points", "desc"),
          limitDocs(limit)
        );
        const snap = await getDocs(q);
        return snap.docs.map((d) => ({ ...(d.data() as User), id: d.id }));
      },

      getUserRank: async () => {
        const current = useAuthStore.getState().user;
        if (!current) return null;
        const userSnap = await getDoc(doc(db, "users", current.id));
        const points = userSnap.exists() ? userSnap.data()?.points || 0 : 0;
        const higherQ = query(
          collection(db, "users"),
          where("points", ">", points)
        );
        const higherSnap = await getDocs(higherQ);
        return higherSnap.size + 1;
      },
    }),
    {
      name: "points-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
