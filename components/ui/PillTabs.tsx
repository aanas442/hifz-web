import React from "react";
import { Pressable, ScrollView, Text, StyleSheet, View } from "react-native";

interface Props {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  scroll?: boolean;
}

export function PillTabs({ options, value, onChange, scroll = false }: Props) {
  const Inner = (
    <View style={styles.row}>
      {options.map((opt) => {
        const active = opt === value;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={[styles.pill, active && styles.active]}
          >
            <Text style={[styles.text, active && styles.activeText]}>{opt}</Text>
          </Pressable>
        );
      })}
    </View>
  );
  return scroll ? (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {Inner}
    </ScrollView>
  ) : (
    Inner
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8 },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E8E4DC",
    backgroundColor: "#FDFAF4",
  },
  active: { backgroundColor: "#1B4332", borderColor: "#1B4332" },
  text: { fontFamily: "NotoSerifBengali", color: "#6B6B60", fontSize: 13 },
  activeText: { color: "#FFFFFF" },
});
