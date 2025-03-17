import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  FlatList,
} from "react-native";
import { BlurView } from "expo-blur";
import dayjs from "dayjs";

const DateTimePickerModal = ({
  visible,
  onClose,
  mode,
  selectedValue,
  onConfirm,
}) => {
  const [tempValue, setTempValue] = useState(selectedValue || new Date());

  const generateNumbers = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      className="p-3 text-center"
      onPress={() => setTempValue(item)}
    >
      <Text
        className={`text-lg ${
          item === tempValue ? "text-blue-500 font-bold" : "text-gray-700"
        }`}
      >
        {mode === "date"
          ? dayjs(item).format("ddd, MMM D YYYY")
          : dayjs(item).format("h:mm A")}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <SafeAreaView className="flex-1 justify-end bg-black bg-opacity-50">
        <BlurView
          intensity={30}
          tint="dark"
          className="absolute top-0 left-0 right-0 bottom-0"
        />

        <View className="bg-white rounded-t-2xl p-5">
          <Text className="text-lg font-bold text-center mb-2">
            Select {mode === "date" ? "Date" : "Time"}
          </Text>

          <FlatList
            data={
              mode === "date"
                ? generateNumbers(0, 30).map((d) =>
                    dayjs().add(d, "day").toDate()
                  )
                : generateNumbers(0, 23).map((h) =>
                    dayjs().hour(h).minute(0).toDate()
                  )
            }
            keyExtractor={(item) => item.toISOString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />

          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              onPress={onClose}
              className="p-3 px-4 bg-gray-300 rounded-lg"
            >
              <Text className="text-gray-700 font-semibold">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onConfirm(tempValue)}
              className="p-3 px-4 bg-blue-500 rounded-lg"
            >
              <Text className="text-white font-semibold">Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default DateTimePickerModal;
