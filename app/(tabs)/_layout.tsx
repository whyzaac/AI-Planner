import React from "react";
import { Tabs } from "expo-router";
import { Home, Calendar, User, BotMessageSquare } from "lucide-react-native"; // ✅ Correct native icon library

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: "#F5F5F5", borderTopWidth: 0 }, // ✅ Light Gray Theme
        tabBarActiveTintColor: "#333333", // ✅ Active color
        tabBarInactiveTintColor: "#777777", // ✅ Inactive color
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ChatScreen"
        options={{
          title: "Task Assistant",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <BotMessageSquare size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default Layout;
