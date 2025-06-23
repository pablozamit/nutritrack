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

export type UserSupplement = {
  id: string;
  supplementId: string;
  userId: string;
  schedule: Schedule[];
  pillsRemaining: number;
  totalPills: number;
  lowStockThreshold: number;
  startDate: string;
  adherenceRate: number; // 0-100%
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
  userId: string;
  supplementId: string;
  rating: number;
  comment: string;
  createdAt: string;
  username: string;
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
