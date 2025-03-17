import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { BlurView } from "expo-blur";

const AddTaskModal = ({ modalVisible, setModalVisible, addTask }) => {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
  });

  return (
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-center items-center px-4">
          {/* Blurred Background */}
          <BlurView
            intensity={30}
            tint="dark"
            className="absolute top-0 left-0 right-0 bottom-0"
          />

          {/* Keyboard Avoiding View to Prevent Overlap */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="w-full items-center"
          >
            {/* Floating Task Modal */}
            <View className="bg-white p-6 rounded-2xl w-80 shadow-xl border border-gray-300">
              <Text className="text-lg font-bold text-gray-900 mb-4 text-center">
                Add New Task
              </Text>

              {/* Task Title Input */}
              <TextInput
                className="border border-gray-300 rounded-md p-3 mb-2 w-full text-gray-900 bg-gray-100"
                placeholder="Task Title"
                value={newTask.title}
                onChangeText={(text) => setNewTask({ ...newTask, title: text })}
              />

              {/* Task Description Input */}
              <TextInput
                className="border border-gray-300 rounded-md p-3 mb-2 w-full text-gray-900 bg-gray-100"
                placeholder="Task Description"
                value={newTask.description}
                onChangeText={(text) =>
                  setNewTask({ ...newTask, description: text })
                }
              />

              {/* Due Date Input */}
              <TextInput
                className="border border-gray-300 rounded-md p-3 mb-2 w-full text-gray-900 bg-gray-100"
                placeholder="Due Date (YYYY-MM-DD)"
                value={newTask.dueDate}
                onChangeText={(text) =>
                  setNewTask({ ...newTask, dueDate: text })
                }
              />

              {/* Due Time Input */}
              <TextInput
                className="border border-gray-300 rounded-md p-3 mb-4 w-full text-gray-900 bg-gray-100"
                placeholder="Due Time (HH:MM AM/PM)"
                value={newTask.dueTime}
                onChangeText={(text) =>
                  setNewTask({ ...newTask, dueTime: text })
                }
              />

              {/* Buttons */}
              <View className="flex-row justify-between mt-2">
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="p-3 px-4 bg-gray-300 rounded-md active:opacity-70"
                >
                  <Text className="text-gray-700 font-semibold">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    addTask(newTask);
                    setNewTask({
                      title: "",
                      description: "",
                      dueDate: "",
                      dueTime: "",
                    }); // ✅ Reset after adding
                  }}
                  className="p-3 px-4 bg-blue-500 rounded-md active:opacity-80"
                >
                  <Text className="text-white font-semibold">Add Task</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddTaskModal;
