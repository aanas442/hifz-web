import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface Props {
  value: number; // 0..100
  color?: string;
  background?: string;
  height?: number;
}

export function ProgressBar({
  value,
  color = "#1B4332",
  background = "#E8E4DC",
  height = 7,
}: Props) {
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withTiming(Math.max(0, Math.min(100, value)), { duration: 600 });
  }, [value, w]);
  const fill = useAnimatedStyle(() => ({ width: `${w.value}%` }));
  return (
    <View style={[styles.track, { backgroundColor: background, height, borderRadius: height / 2 }]}>
      <Animated.View
        style={[styles.fill, fill, { backgroundColor: color, borderRadius: height / 2 }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: "100%", overflow: "hidden" },
  fill: { height: "100%" },
});
