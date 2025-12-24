
import { GoogleGenAI } from "@google/genai";

export const analyzeWatermark = async (imageDataBase64: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { text: "Analyze this image and identify if there are any watermarks. Describe their location and type (text, logo, translucent). If you were to remove them, what would you need to reconstruct?" },
            {
              inlineData: {
                mimeType: 'image/png',
                data: imageDataBase64,
              },
            },
          ],
        },
      ],
    });

    return response.text || "No watermark detected or analysis failed.";
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return "Analysis unavailable.";
  }
};
