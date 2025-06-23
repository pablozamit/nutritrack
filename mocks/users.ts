import { User, Review, UserSupplement } from "@/types";

export const users: User[] = [
  {
    id: "1",
    username: "saludbuscador",
    email: "health@example.com",
    points: 1250,
    streak: 14,
    joinedAt: "2025-05-01T00:00:00Z"
  },
  {
    id: "2",
    username: "guerrerobienestar",
    email: "wellness@example.com",
    points: 980,
    streak: 7,
    joinedAt: "2025-05-10T00:00:00Z"
  },
  {
    id: "3",
    username: "viajerodevitaminas",
    email: "vitamin@example.com",
    points: 1560,
    streak: 21,
    joinedAt: "2025-04-15T00:00:00Z"
  },
  {
    id: "4",
    username: "sabiosuplementos",
    email: "sage@example.com",
    points: 2100,
    streak: 30,
    joinedAt: "2025-03-22T00:00:00Z"
  },
  {
    id: "5",
    username: "ninjanutricional",
    email: "ninja@example.com",
    points: 890,
    streak: 5,
    joinedAt: "2025-05-18T00:00:00Z"
  }
];

export const reviews: Review[] = [
  {
    id: "1",
    userId: "3",
    supplementId: "1",
    rating: 5,
    comment: "Noté una gran diferencia en mis niveles de energía después de un mes tomándolo.",
    createdAt: "2025-05-15T14:30:00Z",
    username: "viajerodevitaminas"
  },
  {
    id: "2",
    userId: "1",
    supplementId: "2",
    rating: 4,
    comment: "Buena calidad, pero las píldoras son un poco grandes para tragar.",
    createdAt: "2025-05-10T09:15:00Z",
    username: "saludbuscador"
  },
  {
    id: "3",
    userId: "4",
    supplementId: "3",
    rating: 5,
    comment: "El mejor magnesio que he probado. Realmente ayuda con la calidad del sueño.",
    createdAt: "2025-05-05T22:45:00Z",
    username: "sabiosuplementos"
  },
  {
    id: "4",
    userId: "2",
    supplementId: "5",
    rating: 4,
    comment: "Definitivamente me siento más tranquilo después de tomarlo durante unas semanas.",
    createdAt: "2025-05-18T16:20:00Z",
    username: "guerrerobienestar"
  },
  {
    id: "5",
    userId: "5",
    supplementId: "6",
    rating: 5,
    comment: "Mejora notable en mi rendimiento durante el entrenamiento.",
    createdAt: "2025-05-20T11:10:00Z",
    username: "ninjanutricional"
  }
];

export const userSupplements: UserSupplement[] = [
  {
    id: '1',
    name: 'Vitamina D3',
    days: [0,1,2,3,4,5,6],
    time: '08:00',
    quantity: 60,
    createdAt: '2025-05-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Magnesio',
    days: [0,1,2,3,4,5,6],
    time: '22:00',
    quantity: 120,
    createdAt: '2025-05-05T00:00:00Z'
  },
  {
    id: '3',
    name: 'Ashwagandha',
    days: [0,1,2,3,4,5,6],
    time: '20:00',
    quantity: 60,
    createdAt: '2025-05-10T00:00:00Z'
  }
];
