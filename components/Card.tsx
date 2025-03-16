import React from "react";
import { View } from "react-native";

export const Card = ({ children }) => {
  return <View className="bg-white p-4 rounded-lg shadow">{children}</View>;
};
