import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserSupplement } from "@/types";
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import * as Notifications from "expo-notifications";
import { db } from "@/lib/firestore";
import { useAuthStore } from "./auth-store";
import { usePointsStore } from "./points-store";

interface SupplementState {
  userSupplements: UserSupplement[];
  isLoading: boolean;
  error: string | null;
  notificationIds: Record<string, string[]>;
  addSupplement: (supplement: Omit<UserSupplement, 'id'>) => Promise<void>;
  updateSupplement: (id: string, data: Partial<UserSupplement>) => Promise<void>;
  deleteSupplement: (id: string) => Promise<void>;
  getUserSupplements: (uid: string) => Promise<void>;
  subscribeToUserSupplements: (uid: string) => () => void;
  markSupplementTaken: (id: string) => Promise<void>;
  scheduleNotifications: (
    id: string,
    name: string,
    time: string,
    days: number[]
  ) => Promise<void>;
  cancelNotifications: (id: string) => Promise<void>;
}

export const useSupplementStore = create<SupplementState>()(
  persist(
    (set, get) => ({
      userSupplements: [],
      isLoading: false,
      error: null,
      notificationIds: {},
      

      addSupplement: async (supplement) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        const docRef = await addDoc(collection(db, `users/${user.id}/supplements`), {
          ...supplement,
          createdAt: new Date().toISOString(),
          lastTakenAt: [],
        });
        const id = docRef.id;
        set((state) => ({
          userSupplements: [
            ...state.userSupplements,
            { ...supplement, id, createdAt: new Date().toISOString(), lastTakenAt: [] },
          ],
        }));
        await get().scheduleNotifications(id, supplement.name, supplement.time, supplement.days);
      },

      deleteSupplement: async (id) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        await deleteDoc(doc(db, `users/${user.id}/supplements/${id}`));
        await get().cancelNotifications(id);
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
      },

      updateSupplement: async (id, data) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        await updateDoc(doc(db, `users/${user.id}/supplements/${id}`), data);
        set((state) => ({
          userSupplements: state.userSupplements.map((s) =>
            s.id === id ? { ...s, ...data } : s
          ),
        }));
        if (data.time || data.days || data.name) {
          const supp = get().userSupplements.find((s) => s.id === id);
          const name = data.name || supp?.name || "";
          const time = data.time || supp?.time || "00:00";
          const days = data.days || supp?.days || [];
          await get().cancelNotifications(id);
          await get().scheduleNotifications(id, name, time, days);
        }
      },

      scheduleNotifications: async (id: string, name: string, time: string, days: number[]) => {
        const [hour, minute] = time.split(":").map(Number);
        const notifIds: string[] = [];
        for (const d of days) {
          const trigger: any = { type: 'calendar', hour, minute, weekday: d + 1, repeats: true };
          const nid = await Notifications.scheduleNotificationAsync({
            content: {
              title: "Es hora de tomar tu suplemento:",
              body: name,
            },
            trigger,
          });
          notifIds.push(nid);
        }
        set((state) => ({
          notificationIds: { ...state.notificationIds, [id]: notifIds },
        }));
      },

      cancelNotifications: async (id: string) => {
        const ids = get().notificationIds[id] || [];
        for (const nid of ids) {
          try {
            await Notifications.cancelScheduledNotificationAsync(nid);
          } catch {}
        }
        set((state) => {
          const copy = { ...state.notificationIds };
          delete copy[id];
          return { notificationIds: copy };
        });
      },
    }),
    {
      name: "supplement-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
