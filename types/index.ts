export type User = {
  id: string;
  username: string;
  email: string;
  points: number;
  streak: number;
  joinedAt: string;
};

export type Supplement = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  priceLevel: number; // 1-5
  pillsRemaining: number;
  totalPills: number;
  dosage: string;
  category: string;
  benefits: string[];
  sideEffects: string[];
  rating: number; // 0-5
  reviewCount: number;
};

export type CatalogSupplement = {
  id: string;
  name: string;
  description: string;
  type: string;
  objectives: string[];
  priceEstimate: number;
  baseScore: number; // 0-10
};

export type UserSupplement = {
  id: string;
  name: string;
  days: number[];
  time: string;
  quantity: number;
  createdAt: string;
  lastTakenAt?: string[];
};

export type Schedule = {
  id: string;
  time: string; // Formato HH:MM
  dosage: number;
  days: number[]; // 0-6 (Domingo a Sábado)
};

export type Intake = {
  id: string;
  userSupplementId: string;
  scheduleId: string;
  timestamp: string;
  taken: boolean;
};

export type Review = {
  id: string;
  uid: string;
  userName?: string;
  supplementId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type Symptom = {
  id: string;
  name: string;
  supplements: string[]; // Array de IDs de suplementos
};

export type Goal = {
  id: string;
  name: string;
  supplements: string[]; // Array de IDs de suplementos
};

export type RecommendedSupplement = CatalogSupplement & { reason: string };
