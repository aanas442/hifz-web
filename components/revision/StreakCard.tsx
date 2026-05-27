import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "../ui/Card";
import { StreakData } from "@/lib/revision-engine";

interface Props {
  streak: StreakData;
}

export function StreakCard({ streak }: Props) {
  // Build last-7-days dots (oldest -> today)
  const dots = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().slice(0, 10);
    const isToday = i === 6;
    const done = streak.history.includes(iso);
    return { isToday, done };
  });

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.flame}>🔥</Text>
        <View>
          <Text style={styles.num}>{streak.current}</Text>
          <Text style={styles.label}>দিন</Text>
        </View>
      </View>
      <View style={styles.right}>
        {dots.map((d, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              d.done && { backgroundColor: "#C9A84C", borderColor: "#C9A84C" },
              d.isToday && !d.done && { backgroundColor: "#FFFFFF", borderColor: "#FFFFFF" },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1B4332",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: { flexDirection: "row", alignItems: "center", gap: 10 },
  flame: { fontSize: 32 },
  num: { color: "#C9A84C", fontSize: 48, fontWeight: "700", lineHeight: 52 },
  label: { color: "#FFFFFF", fontSize: 14, fontFamily: "NotoSerifBengali" },
  right: { flexDirection: "row", gap: 6 },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.6)",
    backgroundColor: "transparent",
  },
});
