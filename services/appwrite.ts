import { Client, Databases } from "react-native-appwrite";

const client = new Client();

// ✅ Load environment variables from .env (Expo built-in support)
const APPWRITE_ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
export const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
export const COLLECTION_ID_TASKS =
  process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!; // Tasks Collection
export const COLLECTION_ID_CHAT =
  process.env.EXPO_PUBLIC_APPWRITE_CHAT_COLLECTION_ID!; // Chat History Collection

console.log("📡 Appwrite Config:");
console.log("EXPO_PUBLIC_APPWRITE_ENDPOINT:", APPWRITE_ENDPOINT);
console.log("EXPO_PUBLIC_APPWRITE_PROJECT_ID:", PROJECT_ID);
console.log("EXPO_PUBLIC_APPWRITE_DATABASE_ID:", DATABASE_ID);
console.log("EXPO_PUBLIC_APPWRITE_COLLECTION_ID (Tasks):", COLLECTION_ID_TASKS);
console.log(
  "EXPO_PUBLIC_APPWRITE_CHAT_COLLECTION_ID (Chat):",
  COLLECTION_ID_CHAT
);

// ✅ Initialize Appwrite Client
client.setEndpoint(APPWRITE_ENDPOINT).setProject(PROJECT_ID);

// ✅ Initialize Database instance
export const database = new Databases(client);

export default client;
