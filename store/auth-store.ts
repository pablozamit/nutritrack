import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types";
import { auth } from "@/lib/firebase";
import { useSupplementStore } from "./supplement-store";
import { usePointsStore } from "./points-store";
import { db } from "@/lib/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const cred = await signInWithEmailAndPassword(auth, email, password);
          const fbUser = cred.user;
          const userRef = doc(db, "users", fbUser.uid);
          const snap = await getDoc(userRef);
          let user: User;
          if (snap.exists()) {
            user = { ...(snap.data() as User), id: fbUser.uid };
          } else {
            user = {
              id: fbUser.uid,
              username: fbUser.displayName || email,
              email: fbUser.email || email,
              points: 0,
              streak: 0,
              joinedAt: fbUser.metadata.creationTime || new Date().toISOString(),
            };
            await setDoc(userRef, user);
            await setDoc(doc(db, `users/${fbUser.uid}/meta`), { points: 0 }, { merge: true });
          }
          set({ user, isAuthenticated: true, isLoading: false });
          await useSupplementStore.getState().getUserSupplements(user.id);
          await usePointsStore.getState().fetchPoints();
        } catch (e: any) {
          set({ error: e.message, isLoading: false });
        }
      },
      register: async (username, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const cred = await createUserWithEmailAndPassword(auth, email, password);
          if (auth.currentUser) {
            await updateProfile(auth.currentUser, { displayName: username });
          }
          const fbUser = cred.user;
          const user: User = {
            id: fbUser.uid,
            username,
            email: fbUser.email || email,
            points: 0,
            streak: 0,
            joinedAt: fbUser.metadata.creationTime || new Date().toISOString(),
          };
          await setDoc(doc(db, "users", fbUser.uid), user);
          await setDoc(doc(db, `users/${fbUser.uid}/meta`), { points: 0 }, { merge: true });
          set({ user, isAuthenticated: true, isLoading: false });
          await useSupplementStore.getState().getUserSupplements(user.id);
        } catch (e: any) {
          set({ error: e.message, isLoading: false });
        }
      },
      logout: async () => {
        await signOut(auth);
        set({ user: null, isAuthenticated: false });
        useSupplementStore.setState({ userSupplements: [] });
      },
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
        if (user) {
          useSupplementStore.getState().getUserSupplements(user.id);
          usePointsStore.getState().fetchPoints();
        } else {
          useSupplementStore.setState({ userSupplements: [] });
        }
      },
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          const updated = { ...currentUser, ...userData };
          set({ user: updated });
          setDoc(doc(db, "users", currentUser.id), updated, { merge: true });
        }
      }
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
