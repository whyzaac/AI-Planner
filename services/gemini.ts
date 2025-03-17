import { GoogleGenerativeAI } from "@google/generative-ai";
import { database } from "./appwrite";
import { Query } from "react-native-appwrite";

// ✅ Load API Key
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// ✅ Configure AI Model with Dual Behavior
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
  systemInstruction: `You are an AI assistant. 
- **If the user provides a general query**, respond normally like a chatbot.  
- **If the user describes an event**, extract the details and return them in **JSON format**.

Example event input:
"I have a meeting on Friday at 3 PM at Starbucks."

**Expected JSON Output:**
\`\`\`json
{
  "title": "Meeting",
  "dueDate": "2025-03-22",
  "dueTime": "15:00",
  "location": "Starbucks"
}
\`\`\`

If the input is **not an event, respond normally.**`,
});

// ✅ Chat Configuration
const chat = model.startChat({
  generationConfig: {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  },
  history: [],
});

const CHAT_HISTORY_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_CHAT_COLLECTION_ID!;
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;

/** ✅ Load Chat History from Appwrite */
export const loadChatHistory = async () => {
  try {
    console.log("📡 Fetching chat history from Appwrite...");

    const response = await database.listDocuments(
      DATABASE_ID,
      CHAT_HISTORY_COLLECTION_ID,
      [Query.orderAsc("timestamp")]
    );

    if (response.documents.length > 0) {
      const pastMessages = response.documents.map((doc) => ({
        role: doc.role,
        text: doc.message,
      }));

      // ✅ Repopulate Gemini memory
      chat.history = pastMessages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      console.log("✅ Chat history restored in Gemini:", chat.history);
    }
  } catch (error) {
    console.error("❌ Error loading chat history:", error);
  }
};

/** ✅ Send Message to Gemini (Handles Chat + Task Extraction) */
export const sendToGemini = async (userMessage: string) => {
  try {
    console.log("📩 Sending request to Gemini:", userMessage);

    // ✅ Add user message to chat history
    chat.history.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    // ✅ Get AI Response
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const aiResponse = await response.text();

    console.log("🤖 Gemini Raw Response:", aiResponse);

    // ✅ Try Parsing JSON (Task Extraction)
    try {
      const parsedResponse = JSON.parse(aiResponse);

      // ✅ Ensure the response contains a structured task
      if (parsedResponse.title && parsedResponse.dueDate) {
        console.log("✅ Parsed Task Data:", parsedResponse);
        return parsedResponse;
      }
    } catch (error) {
      console.log("⚠ No structured task detected, returning raw text.");
      return aiResponse; // ✅ Regular conversation response
    }

    return aiResponse; // ✅ Fallback in case of incomplete extraction
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    return "❌ Error processing request.";
  }
};
