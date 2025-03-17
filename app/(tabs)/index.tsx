import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { PlusCircle, User } from "lucide-react-native";
import {
  database,
  DATABASE_ID,
  COLLECTION_ID_TASKS,
  COLLECTION_ID_CHAT,
} from "../../services/appwrite";
import AddTaskModal from "../../components/AddTaskModal";

const Index = () => {
  // 📅 State Management
  const [selectedDate, setSelectedDate] = useState("2025-03-15");
  const [allTasks, setAllTasks] = useState([]); // Store all tasks from DB
  const [tasks, setTasks] = useState([]); // Store filtered tasks for selected date
  const [modalVisible, setModalVisible] = useState(false);

  /** ✅ Fetch all tasks ONCE when the app loads */
  useEffect(() => {
    fetchTasks();
  }, []);

  /** 🔄 Update task list when selectedDate changes */
  useEffect(() => {
    filterTasks();
  }, [selectedDate, allTasks]);

  /** ✅ Fetch Tasks from Appwrite */
  const fetchTasks = async () => {
    console.log("📡 Fetching tasks from Collection ID:", COLLECTION_ID_TASKS);
    try {
      const response = await database.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_TASKS
      );
      if (!response || !response.documents) {
        console.warn("⚠ No tasks found.");
        setAllTasks([]);
        return;
      }

      console.log("✅ Tasks fetched successfully:", response.documents);
      setAllTasks(response.documents);
    } catch (error) {
      console.error("❌ Error fetching tasks:", error.message || error);
    }
  };

  /** 🔄 Filter tasks for the selected date */
  const filterTasks = () => {
    console.log("🔄 Filtering tasks for date:", selectedDate);

    const filteredTasks = allTasks.filter((task) => {
      if (!task.due_date) return false;

      // Extract YYYY-MM-DD from task.due_date
      const taskDate = task.due_date.split("T")[0];
      return taskDate === selectedDate;
    });

    console.log("✅ Filtered tasks:", filteredTasks);
    setTasks(filteredTasks);
  };

  /** ➕ Add a new task to Appwrite */
  const addTask = async (newTask) => {
    if (!newTask.title || !newTask.description || !newTask.dueDate) {
      Alert.alert(
        "Missing Fields",
        "Please enter a valid due date before adding the task."
      );
      return;
    }

    try {
      const formattedDueDate = `${newTask.dueDate}T${
        newTask.dueTime || "00:00"
      }:00.000+00:00`;

      await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID_TASKS,
        "unique()",
        {
          title: newTask.title,
          description: newTask.description,
          due_date: formattedDueDate,
          completed: false,
        }
      );

      console.log("✅ Task added successfully!");
      setModalVisible(false);
      fetchTasks(); // Refresh tasks after adding
    } catch (error) {
      console.error("❌ Error adding task:", error.message || error);
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

      {/* Calendar ✅ */}
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
              <Text className="text-gray-500 text-sm">
                Due: {item.due_date.replace("T", " at ").replace("+00:00", "")}
              </Text>
            </View>
          )}
        />
      )}

      {/* Floating Add Task Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-blue-500 p-4 rounded-full shadow-lg"
        onPress={() => setModalVisible(true)}
      >
        <PlusCircle size={36} color="white" />
      </TouchableOpacity>

      {/* Add Task Modal */}
      <AddTaskModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        addTask={addTask}
        defaultDueDate={selectedDate} // Pass selected calendar date
      />
    </SafeAreaView>
  );
};

export default Index;
