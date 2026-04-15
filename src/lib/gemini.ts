import { GoogleGenAI } from "@google/genai";

export function getApiKey() {
  // 1. Check localStorage for user-provided key (for self-hosted/exported versions)
  if (typeof window !== 'undefined') {
    const userKey = localStorage.getItem('BHP_GEMINI_API_KEY');
    if (userKey) return userKey;
  }

  // 2. Fallback to environment variable
  return process.env.GEMINI_API_KEY || '';
}

export function getGeminiClient() {
  const apiKey = getApiKey();
  return new GoogleGenAI({ apiKey });
}

// Session-wide quota tracking
let isQuotaExceeded = false;

export function checkQuotaStatus() {
  return isQuotaExceeded;
}

export async function generateArticleImage(title: string, category: string, retryCount = 0): Promise<string | null> {
  if (isQuotaExceeded) return null;

  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Create a professional, high-quality editorial illustration or photorealistic image for a financial article.
            
            Article Title: "${title}"
            Category: "${category}"
            
            Style Guidelines:
            - Professional, clean, and modern aesthetic suitable for a premium financial news platform.
            - Use a sophisticated color palette (deep blues, sky blues, or charcoal grays with gold/primary accents).
            - The composition should be balanced and visually striking.
            - Avoid any text, labels, or watermarks in the image.
            - Focus on symbolic representations of the topic.
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
    
    // Retry logic for transient 500 errors
    if ((errorMsg.includes('500') || errorMsg.includes('UNKNOWN')) && retryCount < 2) {
      console.warn(`Image generation failed with 500/UNKNOWN. Retrying... (Attempt ${retryCount + 1})`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return generateArticleImage(title, category, retryCount + 1);
    }

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

export interface ETFData {
  name: string;
  ticker: string;
  category: string;
  returns1Y: string;
  returns3Y: string;
  expenseRatio: string;
  aum: string;
}

export async function getETFData(): Promise<ETFData[]> {
  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "List top 5 performing Exchange Traded Funds (ETFs) in India across different categories (Equity, Gold, Debt). Include their ticker, 1-year returns, 3-year returns, expense ratio, and AUM (Assets Under Management).",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              ticker: { type: "STRING" },
              category: { type: "STRING" },
              returns1Y: { type: "STRING" },
              returns3Y: { type: "STRING" },
              expenseRatio: { type: "STRING" },
              aum: { type: "STRING" }
            },
            required: ["name", "ticker", "category", "returns1Y", "returns3Y", "expenseRatio", "aum"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error fetching ETF data:", error);
    return [];
  }
}
