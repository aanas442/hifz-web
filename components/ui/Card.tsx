import React from "react";
import { View, ViewStyle, StyleSheet } from "react-native";

interface Props {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  borderColor?: string;
  leftAccent?: string;
}

export function Card({ children, style, leftAccent }: Props) {
  return (
    <View
      style={[
        styles.card,
        leftAccent ? { borderLeftWidth: 3, borderLeftColor: leftAccent } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FDFAF4",
    borderWidth: 1,
    borderColor: "#E8E4DC",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#1B4332",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
});
