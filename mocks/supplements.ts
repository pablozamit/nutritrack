import { Supplement } from "@/types";

export const supplements: Supplement[] = [
  {
    id: "1",
    name: "Vitamina D3",
    description: "Vitamina esencial para la función inmune y la salud ósea.",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    priceLevel: 2,
    pillsRemaining: 60,
    totalPills: 60,
    dosage: "1000 UI",
    category: "Vitaminas",
    benefits: ["Apoyo inmunológico", "Salud ósea", "Regulación del estado de ánimo"],
    sideEffects: ["Raros en dosis normales"],
    rating: 4.5,
    reviewCount: 128
  },
  {
    id: "2",
    name: "Omega-3 Aceite de Pescado",
    description: "Apoya la salud del corazón y el cerebro con ácidos grasos esenciales.",
    imageUrl: "https://images.unsplash.com/photo-1577460551100-907fc6e6d955?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    priceLevel: 3,
    pillsRemaining: 90,
    totalPills: 90,
    dosage: "1000mg",
    category: "Ácidos Grasos",
    benefits: ["Salud cardiovascular", "Función cerebral", "Apoyo articular"],
    sideEffects: ["Regusto a pescado", "Problemas digestivos leves"],
    rating: 4.2,
    reviewCount: 95
  },
  {
    id: "3",
    name: "Magnesio Glicinato",
    description: "Forma altamente absorbible de magnesio para relajación y sueño.",
    imageUrl: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    priceLevel: 3,
    pillsRemaining: 120,
    totalPills: 120,
    dosage: "400mg",
    category: "Minerales",
    benefits: ["Calidad del sueño", "Relajación muscular", "Reducción del estrés"],
    sideEffects: ["Heces sueltas en dosis altas"],
    rating: 4.7,
    reviewCount: 203
  },
  {
    id: "4",
    name: "Zinc",
    description: "Mineral esencial para la función inmune y la producción de testosterona.",
    imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    priceLevel: 1,
    pillsRemaining: 100,
    totalPills: 100,
    dosage: "50mg",
    category: "Minerales",
    benefits: ["Apoyo inmunológico", "Apoyo a la testosterona", "Salud de la piel"],
    sideEffects: ["Náuseas si se toma con el estómago vacío"],
    rating: 4.3,
    reviewCount: 87
  },
  {
    id: "5",
    name: "Ashwagandha",
    description: "Hierba adaptógena para reducción del estrés y equilibrio hormonal.",
    imageUrl: "https://images.unsplash.com/photo-1611071536243-eaf5b5e4b1e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    priceLevel: 3,
    pillsRemaining: 60,
    totalPills: 60,
    dosage: "600mg",
    category: "Hierbas",
    benefits: ["Reducción del estrés", "Equilibrio hormonal", "Energía"],
    sideEffects: ["Somnolencia", "Malestar digestivo"],
    rating: 4.6,
    reviewCount: 156
  },
  {
    id: "6",
    name: "Creatina Monohidrato",
    description: "Potenciador del rendimiento para fuerza muscular y recuperación.",
    imageUrl: "https://images.unsplash.com/photo-1579722821273-0f6c1b5d0e51?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    priceLevel: 2,
    pillsRemaining: 200,
    totalPills: 200,
    dosage: "5g",
    category: "Rendimiento",
    benefits: ["Fuerza muscular", "Recuperación", "Función cognitiva"],
    sideEffects: ["Retención de agua", "Problemas digestivos"],
    rating: 4.8,
    reviewCount: 312
  },
  {
    id: "7",
    name: "Complejo de Vitamina B",
    description: "Vitaminas B esenciales para energía y salud del sistema nervioso.",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    priceLevel: 2,
    pillsRemaining: 90,
    totalPills: 90,
    dosage: "Varía",
    category: "Vitaminas",
    benefits: ["Producción de energía", "Sistema nervioso", "Metabolismo"],
    sideEffects: ["Orina de color amarillo brillante", "Náuseas"],
    rating: 4.4,
    reviewCount: 78
  },
  {
    id: "8",
    name: "Probióticos",
    description: "Bacterias beneficiosas para la salud intestinal y función inmune.",
    imageUrl: "https://images.unsplash.com/photo-1586880244406-556ebe35f282?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    priceLevel: 4,
    pillsRemaining: 30,
    totalPills: 30,
    dosage: "10 mil millones UFC",
    category: "Salud Digestiva",
    benefits: ["Salud intestinal", "Apoyo inmunológico", "Regulación del estado de ánimo"],
    sideEffects: ["Hinchazón inicial", "Gases"],
    rating: 4.1,
    reviewCount: 143
  }
];

export const symptoms = [
  { id: "1", name: "Fatiga", supplements: ["1", "7", "3"] },
  { id: "2", name: "Estrés", supplements: ["5", "3", "8"] },
  { id: "3", name: "Mal sueño", supplements: ["3", "5"] },
  { id: "4", name: "Poca energía", supplements: ["7", "1", "6"] },
  { id: "5", name: "Dolor articular", supplements: ["2"] },
  { id: "6", name: "Baja inmunidad", supplements: ["1", "4", "8"] },
  { id: "7", name: "Problemas digestivos", supplements: ["8"] },
  { id: "8", name: "Desequilibrio hormonal", supplements: ["5", "4"] }
];

export const goals = [
  { id: "1", name: "Aumentar energía", supplements: ["7", "1", "6"] },
  { id: "2", name: "Mejorar sueño", supplements: ["3", "5"] },
  { id: "3", name: "Reducir estrés", supplements: ["5", "3"] },
  { id: "4", name: "Reforzar inmunidad", supplements: ["1", "4", "8"] },
  { id: "5", name: "Mejorar concentración", supplements: ["7", "6", "2"] },
  { id: "6", name: "Crecimiento muscular", supplements: ["6", "4"] },
  { id: "7", name: "Apoyo a la testosterona", supplements: ["4", "5"] },
  { id: "8", name: "Salud cardiovascular", supplements: ["2"] }
];
