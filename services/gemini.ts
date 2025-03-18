import { GoogleGenerativeAI } from "@google/generative-ai";
import { database } from "./appwrite";
import { Query } from "react-native-appwrite";

// ✅ Load API Key
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// ✅ Configure AI Model for Task Extraction + Normal Chatting
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
  systemInstruction: `You are an AI assistant. 
- If the user **asks a general question**, respond like a normal chatbot.
- If the user **describes an event**, extract task details and return them in JSON.

Example event input:
"I have a meeting on Friday at 3 PM at Starbucks."

**Expected JSON Output:**
\`\`\`json
{
  "title": "Meeting",
  "dueDate": "2025-03-22",
  "dueTime": "15:00:00",
  "location": "Starbucks"
}
\`\`\`

If the input **isn't a task**, respond normally.`,
});

// ✅ Chat Session Storage
let chatSession = model.startChat({
  generationConfig: {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  },
});

/** ✅ Load Chat History from Appwrite */
export const loadChatHistory = async () => {
  try {
    console.log("📡 Fetching chat history from Appwrite...");

    const response = await database.listDocuments(
      process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.EXPO_PUBLIC_APPWRITE_CHAT_COLLECTION_ID!,
      [Query.orderAsc("timestamp")]
    );

    if (response.documents.length > 0) {
      const pastMessages = response.documents.map((doc) => ({
        role: doc.role,
        text: doc.message,
      }));

      // ✅ Initialize new chat session with history
      chatSession = model.startChat({
        history: pastMessages.map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        })),
      });

      console.log("✅ Chat history restored in Gemini:", pastMessages);
    }
  } catch (error) {
    console.error("❌ Error loading chat history:", error);
  }
};

/** ✅ Send Message to Gemini (Fixing Chat History Issue) */
export const sendToGemini = async (userMessage: string) => {
  try {
    console.log("📩 Sending request to Gemini:", userMessage);

    // ✅ Get AI Response
    const result = await chatSession.sendMessage(userMessage);
    const response = await result.response;
    const aiResponse = await response.text();

    console.log("🤖 Gemini Raw Response:", aiResponse);

    // ✅ Try Parsing JSON (Task Extraction)
    try {
      const parsedResponse = JSON.parse(aiResponse);

      if (parsedResponse.title && parsedResponse.dueDate) {
        console.log("✅ Extracted Task Data:", parsedResponse);
        return parsedResponse; // ✅ Return structured task
      }
    } catch (error) {
      console.log(
        "⚠ No structured task detected, returning normal chat response."
      );
      return aiResponse; // ✅ Normal chat response
    }

    return aiResponse; // ✅ Fallback
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    return "❌ Error processing request.";
  }
};
