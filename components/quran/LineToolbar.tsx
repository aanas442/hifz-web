import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const ACTIONS = [
  { id: "play", icon: "▶", label: "Play" },
  { id: "copy", icon: "📋", label: "Copy" },
  { id: "share", icon: "🔗", label: "Share" },
  { id: "tajweed", icon: "📖", label: "Tajweed" },
  { id: "bookmark", icon: "🔖", label: "Bookmark" },
  { id: "mark", icon: "⊕", label: "Mark" },
] as const;

export type ToolbarAction = (typeof ACTIONS)[number]["id"];

interface Props {
  onAction: (a: ToolbarAction) => void;
}

export function LineToolbar({ onAction }: Props) {
  return (
    <View style={styles.bar}>
      {ACTIONS.map((a) => (
        <Pressable key={a.id} onPress={() => onAction(a.id)} style={styles.btn}>
          <Text style={styles.icon}>{a.icon}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: "#1B4332",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    gap: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  btn: { padding: 8 },
  icon: { color: "#FFFFFF", fontSize: 18 },
});
