import { RecommendedSupplement, CatalogSupplement } from "@/types";

export function getSuggestedSupplements(
  catalog: CatalogSupplement[],
  input: string
): RecommendedSupplement[] {
  const text = input.toLowerCase();
  const matches = catalog.filter((c) => {
    const inObjectives = c.objectives.some((o) => o.toLowerCase().includes(text));
    return (
      c.name.toLowerCase().includes(text) ||
      c.description.toLowerCase().includes(text) ||
      inObjectives
    );
  });
  return matches.map((m) => ({ ...m, reason: "Coincidencia con la búsqueda" }));
}

export async function getSuggestedSupplementsAI(
  catalog: CatalogSupplement[],
  input: string
): Promise<RecommendedSupplement[]> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return [];
  }

  const prompt = `Devuelve una lista JSON con los suplementos m\u00e1s recomendados para el siguiente s\u00edntoma u objetivo: ${input}`;

  let response: Response;
  try {
    response = await fetch("https://api.openai.com/v1/chat/completions", {
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
    if (!response.ok) {
      console.warn(
        `OpenAI API request failed with status ${response.status}`
      );
      return getSuggestedSupplements(catalog, input);
    }
  } catch (err) {
    console.warn("OpenAI API request failed", err);
    return getSuggestedSupplements(catalog, input);
  }

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
    const sup = catalog.find(
      (s) => s.name.toLowerCase() === String(item.name).toLowerCase()
    );
    if (sup && !result.find((r) => r.id === sup.id)) {
      result.push({ ...sup, reason: String(item.reason || "") });
    }
  });

  return result;
}
