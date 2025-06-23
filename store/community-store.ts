import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Review } from "@/types";
import { reviews, users } from "@/mocks/users";
import { useAuthStore } from "./auth-store";

interface CommunityState {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  
  addReview: (supplementId: string, rating: number, comment: string) => void;
  updateReview: (reviewId: string, rating: number, comment: string) => void;
  deleteReview: (reviewId: string) => void;
  getReviewsBySupplementId: (supplementId: string) => Review[];
  getReviewsByUserId: (userId: string) => Review[];
  getTopUsers: (limit?: number) => typeof users;
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      reviews: [...reviews],
      isLoading: false,
      error: null,
      
      addReview: (supplementId, rating, comment) => {
        const user = useAuthStore.getState().user;
        if (!user) {
          set({ error: "Usuario no autenticado" });
          return;
        }
        
        const newReview: Review = {
          id: String(get().reviews.length + 1),
          userId: user.id,
          username: user.username,
          supplementId,
          rating,
          comment,
          createdAt: new Date().toISOString()
        };
        
        set(state => ({
          reviews: [...state.reviews, newReview]
        }));
        
        // Añadir puntos por dejar una reseña
        useAuthStore.setState({
          user: {
            ...user,
            points: user.points + 10
          }
        });
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
      
      getReviewsBySupplementId: (supplementId) => {
        return get().reviews.filter(review => review.supplementId === supplementId);
      },
      
      getReviewsByUserId: (userId) => {
        return get().reviews.filter(review => review.userId === userId);
      },
      
      getTopUsers: (limit = 10) => {
        return [...users]
          .sort((a, b) => b.points - a.points)
          .slice(0, limit);
      }
    }),
    {
      name: "community-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
