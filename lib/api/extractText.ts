export const extractTextFromImage = async (
  imageUrl: string
): Promise<string | null> => {
  const res = await fetch("/api/extract-text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageUrl }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("OCR kļūda:", data.error);
    return null;
  }

  return data.text as string;
};
