import { GoogleGenAI } from "@google/genai";
import firebaseConfig from "../../firebase-applet-config.json";

const ai = new GoogleGenAI({ apiKey: firebaseConfig.apiKey });

export async function analyzeImage(imageBase64: string, mimeType: string) {
  const prompt = `Analyze this roofing photo as a Senior Forensic Adjuster.
1. Identify roofing components (e.g., ridge cap, valley, flashing) with confidence scores.
2. Identify damage markers (e.g., hail impact, granule loss, mechanical damage) with confidence scores.
3. Return JSON: { 
  "components": [{ "name": string, "confidence": number }], 
  "damage_markers": [{ "type": string, "confidence": number }], 
  "hail_hits": number, 
  "claim_ready": boolean, 
  "confidence": number 
}`;

  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [
      {
        parts: [
          { inlineData: { data: imageBase64, mimeType: mimeType } },
          { text: prompt }
        ]
      }
    ]
  });

  return JSON.parse(response.text);
}
