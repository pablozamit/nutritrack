import { create } from "zustand";
import { Review } from "@/types";
import { db } from "@/lib/firestore";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useAuthStore } from "./auth-store";
import { usePointsStore } from "./points-store";

interface ReviewsState {
  reviews: Record<string, Review[]>;
  subscribeToReviews: (supplementId: string) => () => void;
  submitReview: (
    supplementId: string,
    data: { rating: number; comment: string }
  ) => Promise<void>;
  deleteReview: (supplementId: string) => Promise<void>;
}

export const useReviewsStore = create<ReviewsState>((set, get) => ({
  reviews: {},

  subscribeToReviews: (supplementId) => {
    const q = query(
      collection(db, `supplements/${supplementId}/reviews`),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        ...(d.data() as Omit<Review, "id" | "supplementId">),
        id: d.id,
        supplementId,
      }));
      set((state) => ({ reviews: { ...state.reviews, [supplementId]: list } }));
    });
    return unsub;
  },

  submitReview: async (supplementId, data) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const reviewsRef = collection(db, `supplements/${supplementId}/reviews`);
    const q = query(reviewsRef, where("uid", "==", user.id));
    const snap = await getDocs(q);
    if (snap.empty) {
      await addDoc(reviewsRef, {
        uid: user.id,
        userName: user.username,
        rating: data.rating,
        comment: data.comment,
        createdAt: new Date().toISOString(),
      });
      await usePointsStore.getState().addPoints(10);
    } else {
      const id = snap.docs[0].id;
      await updateDoc(doc(db, `supplements/${supplementId}/reviews/${id}`), {
        rating: data.rating,
        comment: data.comment,
        createdAt: new Date().toISOString(),
        userName: user.username,
      });
    }
  },

  deleteReview: async (supplementId) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    const reviewsRef = collection(db, `supplements/${supplementId}/reviews`);
    const q = query(reviewsRef, where("uid", "==", user.id));
    const snap = await getDocs(q);
    for (const d of snap.docs) {
      await deleteDoc(doc(db, `supplements/${supplementId}/reviews/${d.id}`));
    }
  },
}));
