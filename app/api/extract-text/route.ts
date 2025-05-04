import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { imageUrl } = await req.json();

  if (!imageUrl) {
    return NextResponse.json(
      { error: "imageUrl is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_VISION_API_KEY;
  const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

  const payload = {
    requests: [
      {
        image: { source: { imageUri: imageUrl } },
        features: [{ type: "TEXT_DETECTION" }],
      },
    ],
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: data.error?.message || "Vision API error" },
      { status: 500 }
    );
  }

  const text = data.responses?.[0]?.fullTextAnnotation?.text || "";

  return NextResponse.json({ text });
}
