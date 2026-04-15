import { GoogleGenAI, Type } from "@google/genai";
import { getGeminiClient, getApiKey } from "../lib/gemini";
import { db, collection, addDoc, getDocs, query, where, updateDoc, doc, setDoc, deleteDoc } from "../lib/firebase";

export interface InsurancePlan {
  id?: string;
  name: string;
  company: string;
  category: string;
  sumAssured: string;
  premium: string;
  csr: string; // Claim Settlement Ratio
  keyFeatures: string[];
  lastUpdated: string;
  isReal: boolean;
}

const INSURANCE_PLAN_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Name of the insurance plan." },
      company: { type: Type.STRING, description: "Insurance company name." },
      category: { type: Type.STRING, description: "Category (e.g., Term Life, Health, Motor, Travel)." },
      sumAssured: { type: Type.STRING, description: "Typical sum assured or coverage limit." },
      premium: { type: Type.STRING, description: "Approximate annual premium for a standard profile." },
      csr: { type: Type.STRING, description: "Claim Settlement Ratio percentage." },
      keyFeatures: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "Top 3-4 key features of the plan."
      },
    },
    required: ["name", "company", "category", "csr"],
  },
};

export async function fetchRealInsurancePlans(count: number = 15, category?: string): Promise<InsurancePlan[]> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key missing");
  const ai = getGeminiClient();

  const categoryPrompt = category ? ` specifically in the ${category} category` : "";
  const prompt = `Fetch details for ${count} real and popular insurance plans currently available in India${categoryPrompt}. 
  Include plans for Term Life, Health (Family Floater), and Motor insurance. 
  Provide accurate names, companies, and latest metrics like CSR (Claim Settlement Ratio). 
  Ensure the data is accurate as of early 2026.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: INSURANCE_PLAN_SCHEMA,
      tools: [{ googleSearch: {} }],
    },
  });

  const plans: InsurancePlan[] = JSON.parse(response.text || "[]");
  return plans.map(p => ({
    ...p,
    lastUpdated: new Date().toISOString(),
    isReal: true,
  }));
}

export async function getAllInsurancePlansFromFirestore(): Promise<InsurancePlan[]> {
  const plansCollection = collection(db, "insurance-plans");
  const querySnapshot = await getDocs(plansCollection);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as InsurancePlan));
}

export async function saveInsurancePlansToFirestore(plans: InsurancePlan[]) {
  const plansCollection = collection(db, "insurance-plans");
  for (const plan of plans) {
    const q = query(plansCollection, where("name", "==", plan.name));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      await addDoc(plansCollection, plan);
    } else {
      const planDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, "insurance-plans", planDoc.id), { ...plan });
    }
  }
}

export async function deleteInsurancePlanFromFirestore(id: string) {
  await deleteDoc(doc(db, "insurance-plans", id));
}

export async function verifyInsurancePlanData(plan: InsurancePlan): Promise<{ isValid: boolean; reason: string; correctedData?: InsurancePlan }> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key missing");
  const ai = getGeminiClient();

  const prompt = `Verify the following insurance plan data for accuracy as of 2026:
  ${JSON.stringify(plan)}
  
  If the data is accurate, return isValid: true.
  If any data (Premium, CSR, Sum Assured) is outdated or incorrect, return isValid: false, a reason, and the correctedData object.
  Ensure the correctedData follows the InsurancePlan interface.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isValid: { type: Type.BOOLEAN },
          reason: { type: Type.STRING },
          correctedData: { 
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              company: { type: Type.STRING },
              category: { type: Type.STRING },
              sumAssured: { type: Type.STRING },
              premium: { type: Type.STRING },
              csr: { type: Type.STRING },
              keyFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
            }
          }
        }
      },
      tools: [{ googleSearch: {} }],
    }
  });

  const result = JSON.parse(response.text || "{}");
  if (result.correctedData) {
    result.correctedData = {
      ...plan,
      ...result.correctedData,
      lastUpdated: new Date().toISOString(),
      isReal: true
    };
  }
  return result;
}
