import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Review, User } from "@/types";
import { useAuthStore } from "./auth-store";
import { usePointsStore } from "./points-store";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit as limitDocs,
} from "firebase/firestore";
import { db } from "@/lib/firestore";

interface CommunityState {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;

  addReview: (supplementId: string, rating: number, comment: string) => Promise<void>;
  updateReview: (reviewId: string, rating: number, comment: string) => void;
  deleteReview: (reviewId: string) => void;
  getReviewsBySupplementId: (supplementId: string) => Review[];
  getReviewsByUserId: (userId: string) => Review[];
  getTopUsers: (limit?: number) => Promise<User[]>;
  loadReviews: () => Promise<void>;
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      reviews: [],
      isLoading: false,
      error: null,

      addReview: async (supplementId, rating, comment) => {
        const user = useAuthStore.getState().user;
        if (!user) {
          set({ error: "Usuario no autenticado" });
          return;
        }

        const newReview: Omit<Review, "id"> = {
          userId: user.id,
          username: user.username,
          supplementId,
          rating,
          comment,
          createdAt: new Date().toISOString(),
        };

        const docRef = await addDoc(collection(db, "reviews"), newReview);

        set((state) => ({
          reviews: [...state.reviews, { ...newReview, id: docRef.id }],
        }));

        // Añadir puntos por dejar una reseña
        await usePointsStore.getState().addPoints(10);
      },
      
      updateReview: (reviewId, rating, comment) => {
        set(state => ({
          reviews: state.reviews.map(review => 
            review.id === reviewId 
              ? { ...review, rating, comment } 
              : review
          )
        }));
      },
      
      deleteReview: (reviewId) => {
        set(state => ({
          reviews: state.reviews.filter(review => review.id !== reviewId)
        }));
      },

      loadReviews: async () => {
        const snap = await getDocs(collection(db, "reviews"));
        const data = snap.docs.map((d) => ({ ...(d.data() as Review), id: d.id }));
        set({ reviews: data });
      },
      
      getReviewsBySupplementId: (supplementId) => {
        return get().reviews.filter(review => review.supplementId === supplementId);
      },
      
      getReviewsByUserId: (userId) => {
        return get().reviews.filter(review => review.userId === userId);
      },
      
      getTopUsers: async (limit = 10) => {
        const q = query(
          collection(db, "users"),
          orderBy("points", "desc"),
          limitDocs(limit)
        );
        const snap = await getDocs(q);
        return snap.docs.map((d) => ({ ...(d.data() as User), id: d.id }));
      }
    }),
    {
      name: "community-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
