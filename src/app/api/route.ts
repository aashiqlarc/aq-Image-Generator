import { GoogleGenAI, Modality } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

type InlineDataPart = {
  inlineData?: {
    data: string;
  };
  text?: string;
};

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

    const imagePart = (parts as InlineDataPart[]).find(
      (part) => part.inlineData && part.inlineData.data
    );

    const imageBase64 = imagePart?.inlineData?.data ?? "";

    return NextResponse.json({ image: `data:image/png;base64,${imageBase64}` });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error("Unknown error", err);
    }
    return new Response("Something went wrong", { status: 500 });
  }
}
