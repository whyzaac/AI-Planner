import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { PlusCircle, User } from "lucide-react-native";
import { database, DATABASE_ID, COLLECTION_ID } from "../../services/appwrite";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState("2025-03-15");
  const [allTasks, setAllTasks] = useState([]); // Store all tasks once
  const [tasks, setTasks] = useState([]); // Store tasks for selected date

  /** ✅ Fetch all tasks ONCE when component mounts */
  useEffect(() => {
    fetchTasks();
  }, []);

  /** ✅ Filtering Logic: Runs when `selectedDate` or `allTasks` change */
  useEffect(() => {
    console.log("🔄 Filtering tasks for date:", selectedDate);
    console.log("📋 All tasks before filtering:", allTasks);

    // Extract only `YYYY-MM-DD` from `selectedDate`
    const formattedDate = selectedDate.split("T")[0];

    const filteredTasks = allTasks.filter((task) => {
      if (!task.due_date) return false;

      const taskDate = task.due_date.split("T")[0];

      console.log(
        `🔍 Checking Task: ${task.title} (Due: ${taskDate}) vs Selected: ${formattedDate}`
      );

      return taskDate === formattedDate;
    });

    console.log("✅ Filtered tasks after fixing date matching:", filteredTasks);
    setTasks(filteredTasks);
  }, [selectedDate, allTasks]);

  /** ✅ Fetch All Tasks From Appwrite */
  const fetchTasks = async () => {
    console.log("📡 Fetching tasks from Collection ID:", COLLECTION_ID);

    try {
      const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID);

      if (!response || !response.documents) {
        console.warn("⚠ No tasks found.");
        setAllTasks([]);
        return;
      }

      console.log(
        "📄 Raw response before processing:",
        JSON.stringify(response, null, 2)
      );

      // ✅ Absolute Fix: Ensure response is converted into a clean JSON object
      const clonedTasks = response.documents.map((task) =>
        JSON.parse(JSON.stringify(task))
      );

      console.log("✅ Tasks fetched successfully:", clonedTasks);

      setAllTasks(clonedTasks);
    } catch (error) {
      console.error(
        "❌ Error fetching tasks from Appwrite:",
        error.message || error
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold text-gray-900">{selectedDate}</Text>
        <TouchableOpacity>
          <User size={28} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      {/* Calendar */}
      <View className="bg-white rounded-lg shadow-md p-3 mb-4">
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: "#007AFF" },
          }}
          theme={{
            calendarBackground: "#FFFFFF",
            textSectionTitleColor: "#333333",
            selectedDayBackgroundColor: "#007AFF",
            selectedDayTextColor: "#FFFFFF",
            todayTextColor: "#4A90E2",
            dayTextColor: "#333333",
            arrowColor: "#007AFF",
            monthTextColor: "#333333",
          }}
        />
      </View>

      {/* Task List */}
      <Text className="text-lg font-bold text-gray-900 mb-2">
        Today's Tasks
      </Text>

      {tasks.length === 0 ? (
        <Text className="text-gray-500 text-center">
          No tasks for this date.
        </Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.$id}
          extraData={tasks} // ✅ Ensures UI updates when tasks change
          renderItem={({ item }) => (
            <View className="bg-white p-4 rounded-lg shadow-sm mb-2 border border-gray-200">
              <Text className="text-gray-900 font-medium">{item.title}</Text>
              <Text className="text-gray-500 text-sm">{item.description}</Text>
            </View>
          )}
        />
      )}

      {/* Floating Add Task Button */}
      <TouchableOpacity className="absolute bottom-6 right-6 bg-blue-500 p-4 rounded-full shadow-lg">
        <PlusCircle size={36} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Index;
