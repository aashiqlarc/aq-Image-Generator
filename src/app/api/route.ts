import { GoogleGenAI, Modality } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const parts = result?.candidates?.[0]?.content?.parts ?? [];

    const imagePart = parts.find((part: any) => part.inlineData);
    const imageBase64 = imagePart?.inlineData?.data ?? "";

    return NextResponse.json({ image: `data:image/png;base64,${imageBase64}` });
  } catch (err) {
    console.error("Error generating image:", err);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}
