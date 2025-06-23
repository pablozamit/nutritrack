import { supplements } from "@/mocks/supplements";
import { RecommendedSupplement } from "@/types";

export function getSuggestedSupplements(input: string): RecommendedSupplement[] {
  const text = input.toLowerCase();
  const result: RecommendedSupplement[] = [];

  const addSupps = (ids: string[], reason: string) => {
    ids.forEach((id) => {
      const sup = supplements.find((s) => s.id === id);
      if (sup && !result.find((r) => r.id === id)) {
        result.push({ ...sup, reason });
      }
    });
  };

  const map = [
    { keywords: ["fatiga", "cansancio"], ids: ["3", "5", "7", "1"], reason: "Para combatir la fatiga" },
    { keywords: ["estres", "estrés", "ansiedad"], ids: ["5", "3", "8"], reason: "Para reducir el estrés" },
    { keywords: ["sue\u00f1o", "dormir"], ids: ["3", "5"], reason: "Para mejorar el sue\u00f1o" },
    { keywords: ["energ\u00eda", "energia"], ids: ["7", "1", "6"], reason: "Para incrementar la energ\u00eda" },
    { keywords: ["musculo", "muscular", "masa"], ids: ["6", "4"], reason: "Para ganar masa muscular" },
    { keywords: ["inmunidad", "defensas"], ids: ["1", "4", "8"], reason: "Para reforzar la inmunidad" },
    { keywords: ["digestion", "digestivo"], ids: ["8"], reason: "Para mejorar la digesti\u00f3n" },
    { keywords: ["hormonal", "testosterona"], ids: ["5", "4"], reason: "Para equilibrio hormonal" },
    { keywords: ["cardiovascular", "corazon"], ids: ["2"], reason: "Para salud cardiovascular" },
    { keywords: ["concentracion", "concentraci\u00f3n"], ids: ["7", "6", "2"], reason: "Para mejorar la concentraci\u00f3n" },
  ];

  map.forEach((entry) => {
    if (entry.keywords.some((k) => text.includes(k))) {
      addSupps(entry.ids, entry.reason);
    }
  });

  return result;
}

export async function getSuggestedSupplementsAI(input: string): Promise<RecommendedSupplement[]> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return [];
  }

  const prompt = `Devuelve una lista JSON con los suplementos m\u00e1s recomendados para el siguiente s\u00edntoma u objetivo: ${input}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Eres un asistente experto en suplementos" },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "[]";

  let parsed: any[] = [];
  try {
    parsed = JSON.parse(text);
  } catch {
    return [];
  }

  const result: RecommendedSupplement[] = [];

  parsed.forEach((item) => {
    const sup = supplements.find((s) => s.name.toLowerCase() === String(item.name).toLowerCase());
    if (sup && !result.find((r) => r.id === sup.id)) {
      result.push({ ...sup, reason: String(item.reason || "") });
    }
  });

  return result;
}
