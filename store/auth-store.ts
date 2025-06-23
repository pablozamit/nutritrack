import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types";
import { users } from "@/mocks/users";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
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
          // Simular llamada a API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Buscar usuario en datos simulados
          const user = users.find(u => u.email === email);
          
          if (user) {
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            set({ error: "Credenciales inválidas", isLoading: false });
          }
        } catch (error) {
          set({ error: "Error al iniciar sesión", isLoading: false });
        }
      },
      register: async (username, email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simular llamada a API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Comprobar si el usuario ya existe
          const existingUser = users.find(u => u.email === email);
          
          if (existingUser) {
            set({ error: "El usuario ya existe", isLoading: false });
            return;
          }
          
          // Crear nuevo usuario
          const newUser: User = {
            id: String(users.length + 1),
            username,
            email,
            points: 0,
            streak: 0,
            joinedAt: new Date().toISOString()
          };
          
          // En una aplicación real, guardaríamos en el backend
          // Para la simulación, solo establecemos el estado
          set({ user: newUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: "Error al registrarse", isLoading: false });
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
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
