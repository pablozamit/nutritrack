import { create } from "zustand";
import { db } from "@/lib/firestore";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { useAuthStore } from "./auth-store";

export type FeedEntry = {
  id: string;
  type: "review" | "added" | "ranking";
  timestamp: string;
  data: any;
  uid: string;
};

interface FeedState {
  feed: FeedEntry[];
  subscribe: () => () => void;
  addEntry: (type: FeedEntry["type"], data: any) => Promise<void>;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  feed: [],

  subscribe: () => {
    const user = useAuthStore.getState().user;
    const q = query(collection(db, "publicFeed"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        ...(d.data() as Omit<FeedEntry, "id">),
        id: d.id,
      }));
      set({ feed: user ? list.filter((f) => f.uid !== user.id) : list });
    });
    return unsub;
  },

  addEntry: async (type, data) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    await addDoc(collection(db, "publicFeed"), {
      type,
      timestamp: new Date().toISOString(),
      uid: user.id,
      data,
    });
  },
}));
