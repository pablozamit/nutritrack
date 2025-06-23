import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Review, User } from "@/types";
import { useAuthStore } from "./auth-store";
import { usePointsStore } from "./points-store";
import { useReviewsStore } from "./reviews-store";
import {
  collection,
  collectionGroup,
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
        await useReviewsStore
          .getState()
          .submitReview(supplementId, { rating, comment });
      },
      
      updateReview: () => {},
      deleteReview: () => {},

        loadReviews: async () => {
          const q = query(collectionGroup(db, "reviews"));
          const snap = await getDocs(q);
          const data = snap.docs.map((d) => ({
            ...(d.data() as Omit<Review, "id" | "supplementId">),
            id: d.id,
            supplementId: d.ref.parent.parent?.id || "",
          }));
          set({ reviews: data });
        },
      
      getReviewsBySupplementId: (supplementId) => {
        return get().reviews.filter(review => review.supplementId === supplementId);
      },
      
        getReviewsByUserId: (userId) => {
          return get().reviews.filter(review => review.uid === userId);
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
