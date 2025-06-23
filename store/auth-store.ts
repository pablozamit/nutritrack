import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types";
import { auth } from "@/lib/firebase";
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
          const user: User = {
            id: fbUser.uid,
            username: fbUser.displayName || email,
            email: fbUser.email || email,
            points: 0,
            streak: 0,
            joinedAt: fbUser.metadata.creationTime || new Date().toISOString(),
          };
          set({ user, isAuthenticated: true, isLoading: false });
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
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (e: any) {
          set({ error: e.message, isLoading: false });
        }
      },
      logout: async () => {
        await signOut(auth);
        set({ user: null, isAuthenticated: false });
      },
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      }
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
