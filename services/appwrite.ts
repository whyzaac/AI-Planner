import { Client, Databases } from "react-native-appwrite";

console.log("🚀 APPWRITE ENV CHECK");
console.log(
  "EXPO_PUBLIC_APPWRITE_ENDPOINT:",
  process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT
);
console.log(
  "EXPO_PUBLIC_APPWRITE_PROJECT_ID:",
  process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID
);
console.log(
  "EXPO_PUBLIC_APPWRITE_DATABASE_ID:",
  process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID
);
console.log(
  "EXPO_PUBLIC_APPWRITE_COLLECTION_ID:",
  process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID
);

const client = new Client();

client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

export const database = new Databases(client);
export const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
export const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

export default client;
