import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Session-wide quota tracking
let isQuotaExceeded = false;

export function checkQuotaStatus() {
  return isQuotaExceeded;
}

export async function generateArticleImage(title: string, category: string): Promise<string | null> {
  if (isQuotaExceeded) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Create a professional, high-quality editorial illustration or photorealistic image for a financial article.
            
            Article Title: "${title}"
            Category: "${category}"
            
            Style Guidelines:
            - Professional, clean, and modern aesthetic suitable for a premium financial news platform (like Bloomberg or The Economist).
            - Use a sophisticated color palette (deep blues, sky blues, or charcoal grays with gold/primary accents).
            - The composition should be balanced and visually striking.
            - Avoid any text, labels, or watermarks in the image.
            - Focus on symbolic representations of the topic (e.g., bull/bear markets, digital growth, wealth building, secure futures).
            - High resolution, sharp details, and cinematic lighting.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    return null;
  } catch (error: any) {
    const errorMsg = error.message || String(error);
    if (errorMsg.includes('429') || errorMsg.toLowerCase().includes('quota')) {
      if (!isQuotaExceeded) {
        console.warn("Gemini API Quota Exceeded. Switching to fallback mode for this session.");
      }
      isQuotaExceeded = true;
    } else {
      console.error("Error generating image:", error);
    }
    return null;
  }
}
