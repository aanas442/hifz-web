import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#1B4332",
          borderTopWidth: 0,
          height: 60,
        },
        tabBarActiveTintColor: "#C9A84C",
        tabBarInactiveTintColor: "rgba(255,255,255,0.4)",
        tabBarIcon: ({ focused, color }) => {
          const size = focused ? 26 : 22;
          const map: Record<string, keyof typeof Ionicons.glyphMap> = {
            index: "home",
            quran: "book",
            revision: "repeat",
            progress: "stats-chart",
            settings: "settings",
          };
          return <Ionicons name={map[route.name] ?? "ellipse"} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="quran" />
      <Tabs.Screen name="revision" />
      <Tabs.Screen name="progress" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
