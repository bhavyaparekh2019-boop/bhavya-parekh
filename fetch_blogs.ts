import { GoogleGenAI, Type } from "@google/genai";

async function fetchRealBlogs() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompt = `
    Find the absolute best, most authoritative real-world financial blog posts from the internet (especially focusing on the Indian context but including global wisdom) for the following categories:
    - Wealth Management
    - Market Trends
    - Retirement Tips
    - Corporate Finance
    - Insurance
    - Investment
    - Mutual Funds
    - Stocks
    - Tax

    For each category, provide 2-3 of the best recent articles.
    Return the results as a JSON array of objects matching this TypeScript interface:
    interface Article {
      id: string;
      title: string;
      excerpt: string;
      content: string; // A detailed summary or the first few paragraphs (Markdown/HTML)
      category: string; // Must be one of: 'Wealth Management', 'Market Trends', 'Retirement Tips', 'Corporate Finance', 'Insurance', 'Investment', 'Mutual Funds', 'Stocks', 'Tax'
      author: string;
      date: string;
      readTime: string;
      image: string; // Use a relevant high-quality placeholder image URL or a real one if found
      url: string; // The real URL to the original blog post
    }

    Ensure the blogs are from reputable sources like Zerodha Varsity, Value Research, LiveMint, Economic Times, Investopedia, etc.
    The content should be high quality and "the best" as requested by the user.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            excerpt: { type: Type.STRING },
            content: { type: Type.STRING },
            category: { type: Type.STRING },
            author: { type: Type.STRING },
            date: { type: Type.STRING },
            readTime: { type: Type.STRING },
            image: { type: Type.STRING },
            url: { type: Type.STRING }
          },
          required: ["id", "title", "excerpt", "content", "category", "author", "date", "readTime", "image", "url"]
        }
      }
    }
  });

  console.log(response.text);
}

fetchRealBlogs();
