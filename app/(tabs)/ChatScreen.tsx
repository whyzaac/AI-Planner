import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Send } from "lucide-react-native";
import { sendToGemini } from "../../services/gemini";
import {
  database,
  DATABASE_ID,
  COLLECTION_ID_CHAT,
  COLLECTION_ID_TASKS,
} from "../../services/appwrite";
import dayjs from "dayjs";
import { Query } from "react-native-appwrite";

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [loading, setLoading] = useState(true);
  const chatHistoryRef = useRef([]); // ✅ Store chat history reference

  /** ✅ Load chat history from Appwrite & Gemini on mount */
  useEffect(() => {
    const fetchChatHistory = async () => {
      console.log("📡 Fetching chat history...");
      console.log("🛠 DATABASE_ID:", DATABASE_ID);
      console.log("🛠 COLLECTION_ID_CHAT:", COLLECTION_ID_CHAT);

      try {
        const response = await database.listDocuments(
          DATABASE_ID,
          COLLECTION_ID_CHAT,
          [Query.orderAsc("timestamp")] // ✅ Orders by timestamp
        );

        if (response && response.documents) {
          const sortedMessages = response.documents.map((doc) => ({
            sender: doc.role === "user" ? "user" : "gemini",
            text: doc.message,
            timestamp: doc.timestamp,
          }));

          setMessages(sortedMessages);
          chatHistoryRef.current = sortedMessages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }],
          }));
        }
      } catch (error) {
        console.error("❌ Error fetching chat history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, []);

  /** ✅ Save a message in Appwrite */
  const saveMessageToAppwrite = async (role: string, message: string) => {
    try {
      await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID_CHAT,
        "unique()",
        {
          role,
          message,
          timestamp: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error("❌ Error saving message:", error);
    }
  };

  /** ✅ Handle message sending */
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    if (isWaiting) return; // Prevents overlapping responses

    const userMessage = {
      sender: "user",
      text: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]); // ✅ Append user message to chat

    setIsWaiting(true);
    setInput(""); // ✅ Clear input field immediately

    try {
      await saveMessageToAppwrite("user", input); // ✅ Save user message to Appwrite

      // ✅ Get AI response
      const aiResponse = await sendToGemini(input);
      let responseText = aiResponse;

      // ✅ If AI response is structured JSON (task data), save it as an event
      if (aiResponse && typeof aiResponse === "object" && aiResponse.title) {
        const { title, dueDate, dueTime, location } = aiResponse;

        let formattedDueDate = null;
        if (dueDate) {
          formattedDueDate = dayjs(
            `${dueDate} ${dueTime}`,
            "YYYY-MM-DD hh:mm A"
          ).toISOString();
        }

        const newTask = {
          title,
          due_date: formattedDueDate,
          location,
          completed: false,
        };

        // ✅ Save extracted task to Appwrite
        await database.createDocument(
          DATABASE_ID,
          COLLECTION_ID_TASKS,
          "unique()",
          newTask
        );
        responseText = `✅ Task added: ${title} on ${dueDate} at ${dueTime} in ${location}`;
      }

      // ✅ Append AI response to chat
      const aiMessage = {
        sender: "gemini",
        text: responseText,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      await saveMessageToAppwrite("assistant", responseText); // ✅ Save AI response to Appwrite
    } catch (error) {
      console.error("❌ Gemini API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "gemini",
          text: "❌ Error processing request.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }

    setIsWaiting(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4">
      <Text className="text-xl font-bold mb-4">Task Assistant</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              className={`p-3 my-1 rounded-lg ${
                item.sender === "user"
                  ? "bg-blue-500 self-end"
                  : "bg-gray-300 self-start"
              }`}
            >
              <Text
                className={item.sender === "user" ? "text-white" : "text-black"}
              >
                {item.text}
              </Text>
            </View>
          )}
        />
      )}

      {/* Input Field */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-row items-center bg-white p-2 rounded-full border border-gray-300 mt-2">
          <TextInput
            className="flex-1 p-2 text-black"
            placeholder="Enter your task..."
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity onPress={handleSendMessage}>
            <Send size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
