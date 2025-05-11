import { GoogleGenAI,Modality } from "@google/genai";
import { error } from "console";
import { NextResponse } from "next/server";

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!
});

export async function POST(req:Request) {
    try {
        const {prompt} = await req.json();

        const result = await genAI.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
        })
        const parts = result.candidates?.[0]?.content?.parts;
        const imagePart = parts?.find((p:any)=>p.inlineData);
        if(!imagePart){
            return NextResponse.json({error:"No Image Generated"},{status:500})
        }
        const base64Image = `data:image/pang;base64,${imagePart.inlineData?.data}`;
        return NextResponse.json({image:base64Image})
    } catch (error) {
            console.log("generation error",error)
    }
}