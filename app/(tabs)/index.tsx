import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import { PlusCircle, User, CheckCircle, Circle } from "lucide-react-native";
import moment from "moment";
import {
  database,
  DATABASE_ID,
  COLLECTION_ID_TASKS,
  COLLECTION_ID_CHAT,
} from "../../services/appwrite";
import AddTaskModal from "../../components/AddTaskModal";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [allTasks, setAllTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  useEffect(() => {
    filterTasks();
  }, [selectedDate, allTasks]);

  const fetchTasks = async () => {
    try {
      const response = await database.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_TASKS
      );
      setAllTasks(response.documents || []);
    } catch (error) {
      console.error("❌ Error fetching tasks:", error.message || error);
    }
  };

  const filterTasks = () => {
    const filteredTasks = allTasks.filter(
      (task) => task.due_date?.split("T")[0] === selectedDate
    );
    setTasks(filteredTasks);
  };

  const addTask = async (newTask) => {
    if (!newTask.title || !newTask.dueDate) {
      Alert.alert(
        "Missing Fields",
        "Please enter valid details before adding."
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
      setModalVisible(false);
      fetchTasks();
    } catch (error) {
      console.error("❌ Error adding task:", error.message || error);
    }
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold text-gray-900">{selectedDate}</Text>
        <TouchableOpacity>
          <User size={28} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-lg shadow-md p-3 mb-4">
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: "#007AFF" },
            ...allTasks.reduce((acc, task) => {
              acc[task.due_date.split("T")[0]] = {
                marked: true,
                dotColor: "#007AFF",
                selected: task.due_date.split("T")[0] === selectedDate,
                selectedColor: "#007AFF",
              };
              return acc;
            }, {}),
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
          renderItem={({ item }) => (
            <View
              className={`bg-white p-4 rounded-lg shadow-sm mb-2 border ${
                item.completed ? "border-green-500" : "border-gray-200"
              }`}
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-900 font-medium">{item.title}</Text>
                {item.completed ? (
                  <CheckCircle size={20} color="green" />
                ) : (
                  <Circle size={20} color="gray" />
                )}
              </View>
              <Text className="text-gray-500 text-sm">{item.description}</Text>
              <Text className="text-gray-500 text-sm">
                Due: {moment(item.due_date).format("MMM D, YYYY [at] h:mm A")}
              </Text>
            </View>
          )}
        />
      )}

      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          position: "absolute",
          bottom: 20,
          right: 20,
          zIndex: 10,
        }}
      >
        <TouchableOpacity
          className="absolute bottom-4 right-4 bg-blue-500 p-3 rounded-full shadow-lg"
          onPress={() => {
            animateButton();
            setModalVisible(true);
          }}
        >
          <PlusCircle size={30} color="white" />
        </TouchableOpacity>
      </Animated.View>

      <AddTaskModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        addTask={addTask}
        defaultDueDate={selectedDate}
      />
    </SafeAreaView>
  );
};

export default Index;
