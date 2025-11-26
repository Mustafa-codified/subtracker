import { GoogleGenAI, Type } from "@google/genai";
import { Subscription } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const detectSubscriptions = async (text: string): Promise<Omit<Subscription, 'id' | 'status'>[]> => {
  const model = "gemini-2.5-flash";
  const today = new Date().toISOString().split('T')[0];

  const prompt = `
    Analyze the following text (which could be a bank statement, email dump, or list of expenses) and extract any recurring subscriptions.
    Today's date is ${today}.
    
    For each subscription found, estimate the next renewal date based on typical billing cycles if not explicitly stated.
    If the currency symbol is $, assume USD.
    
    Text to analyze:
    "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Name of the service (e.g. Netflix, Spotify)" },
              cost: { type: Type.NUMBER, description: "Cost per cycle" },
              currency: { type: Type.STRING, description: "Currency code (e.g. USD, EUR)" },
              billingCycle: { type: Type.STRING, enum: ["Monthly", "Yearly", "Weekly"] },
              nextRenewalDate: { type: Type.STRING, description: "ISO date string YYYY-MM-DD for next payment" },
              category: { type: Type.STRING, description: "Category (Entertainment, Utilities, Software, etc.)" },
              isTrial: { type: Type.BOOLEAN, description: "Whether it appears to be a free trial" }
            },
            required: ["name", "cost", "currency", "billingCycle", "nextRenewalDate", "category", "isTrial"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Failed to parse subscriptions with Gemini:", error);
    throw new Error("Failed to analyze text. Please try again.");
  }
};

export const generateCancellationEmail = async (subName: string): Promise<string> => {
    const model = "gemini-2.5-flash";
    const prompt = `Write a polite but firm cancellation email for a subscription to "${subName}". Keep it concise.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt
        });
        return response.text || "Could not generate email.";
    } catch (error) {
        console.error("Error generating email", error);
        return "Subject: Cancellation Request\n\nPlease cancel my subscription immediately.";
    }
}
