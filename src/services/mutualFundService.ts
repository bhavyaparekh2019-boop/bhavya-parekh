import { GoogleGenAI, Type } from "@google/genai";
import { db, collection, addDoc, getDocs, query, where, updateDoc, doc, setDoc, deleteDoc } from "../lib/firebase";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface MutualFund {
  id?: string;
  name: string;
  category: string;
  expenseRatio: string;
  returns1Y: string;
  returns3Y: string;
  returns5Y: string;
  alpha: string;
  beta: string;
  sharpe: string;
  risk: string;
  lastUpdated: string;
  isReal: boolean;
}

const MUTUAL_FUND_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Official name of the mutual fund." },
      category: { type: Type.STRING, description: "Category (e.g., Large Cap, Mid Cap, Debt, Hybrid)." },
      expenseRatio: { type: Type.STRING, description: "Expense ratio as a percentage string." },
      returns1Y: { type: Type.STRING, description: "1-year returns as a percentage string." },
      returns3Y: { type: Type.STRING, description: "3-year returns as a percentage string." },
      returns5Y: { type: Type.STRING, description: "5-year returns as a percentage string." },
      alpha: { type: Type.STRING, description: "Alpha value." },
      beta: { type: Type.STRING, description: "Beta value." },
      sharpe: { type: Type.STRING, description: "Sharpe ratio." },
      risk: { type: Type.STRING, description: "Risk profile (Low, Moderate, High, Very High)." },
    },
    required: ["name", "category", "risk"],
  },
};

export async function fetchRealMutualFunds(count: number = 20, category?: string): Promise<MutualFund[]> {
  const categoryPrompt = category ? ` specifically in the ${category} category` : "";
  const prompt = `Fetch details for ${count} real and popular mutual funds currently available in India${categoryPrompt}. 
  Include their official names, categories, and latest performance metrics (returns, expense ratio, alpha, beta, sharpe). 
  Ensure the data is accurate as of early 2026. 
  Provide a diverse list across different asset management companies (AMCs).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: MUTUAL_FUND_SCHEMA,
    },
  });

  const funds: MutualFund[] = JSON.parse(response.text || "[]");
  return funds.map(f => ({
    ...f,
    lastUpdated: new Date().toISOString(),
    isReal: true,
  }));
}

export async function searchMutualFunds(queryStr: string): Promise<MutualFund[]> {
  const prompt = `Search for real mutual funds in India matching the query: "${queryStr}". 
  Provide details for up to 5 matching funds. 
  Include their official names, categories, and latest performance metrics.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: MUTUAL_FUND_SCHEMA,
    },
  });

  const funds: MutualFund[] = JSON.parse(response.text || "[]");
  return funds.map(f => ({
    ...f,
    lastUpdated: new Date().toISOString(),
    isReal: true,
  }));
}

export async function verifyMutualFundData(fund: MutualFund): Promise<{ isValid: boolean; correctedData?: MutualFund; reason?: string }> {
  const prompt = `Verify the following mutual fund data for accuracy against real-world financial data as of early 2026: ${JSON.stringify(fund)}. 
  Check if the name exists, the category is correct, and the returns/risk metrics are realistic for this specific fund. 
  If any data point is significantly off, mark as invalid and provide corrected data.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isValid: { type: Type.BOOLEAN, description: "Whether the provided data is accurate." },
          correctedData: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              category: { type: Type.STRING },
              expenseRatio: { type: Type.STRING },
              returns1Y: { type: Type.STRING },
              returns3Y: { type: Type.STRING },
              returns5Y: { type: Type.STRING },
              alpha: { type: Type.STRING },
              beta: { type: Type.STRING },
              sharpe: { type: Type.STRING },
              risk: { type: Type.STRING },
            }
          },
          reason: { type: Type.STRING, description: "Reason for invalidity or verification notes." },
        },
        required: ["isValid"],
      },
    },
  });

  const result = JSON.parse(response.text || '{"isValid": false}');
  if (result.correctedData) {
    result.correctedData = {
      ...result.correctedData,
      lastUpdated: new Date().toISOString(),
      isReal: true
    };
  }
  return result;
}

export async function deleteMutualFundFromFirestore(id: string) {
  const fundRef = doc(db, "mutual-funds", id);
  await deleteDoc(fundRef);
}

export async function saveMutualFundsToFirestore(funds: MutualFund[]) {
  const fundsCollection = collection(db, "mutual-funds");
  
  for (const fund of funds) {
    // Check if fund already exists by name
    const q = query(fundsCollection, where("name", "==", fund.name));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      await addDoc(fundsCollection, fund);
    } else {
      // Update existing fund
      const fundDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, "mutual-funds", fundDoc.id), { ...fund });
    }
  }
}

export async function getAllMutualFundsFromFirestore(): Promise<MutualFund[]> {
  const fundsCollection = collection(db, "mutual-funds");
  const querySnapshot = await getDocs(fundsCollection);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as MutualFund));
}
