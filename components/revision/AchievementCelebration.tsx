import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Modal,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";

interface Props {
  visible: boolean;
  title: string;
  subtitle?: string;
  onDone: () => void;
}

const { width: SW, height: SH } = Dimensions.get("window");
const CONFETTI_COUNT = 24;

export function AchievementCelebration({ visible, title, subtitle, onDone }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const particles = useRef(
    Array.from({ length: CONFETTI_COUNT }, () => ({
      x: Math.random() * SW,
      delay: Math.random() * 400,
      duration: 1800 + Math.random() * 1200,
      y: new Animated.Value(-20),
      rot: new Animated.Value(0),
    })),
  ).current;

  useEffect(() => {
    if (!visible) return;
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();

    particles.forEach((p) => {
      p.y.setValue(-20);
      p.rot.setValue(0);
      Animated.parallel([
        Animated.timing(p.y, {
          toValue: SH + 40,
          duration: p.duration,
          delay: p.delay,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(p.rot, {
          toValue: 1,
          duration: p.duration,
          delay: p.delay,
          useNativeDriver: true,
        }),
      ]).start();
    });

    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [visible, opacity, particles, onDone]);

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View style={[styles.backdrop, { opacity }]}>
        {particles.map((p, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                left: p.x,
                transform: [
                  { translateY: p.y },
                  {
                    rotate: p.rot.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "720deg"],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
        <View style={styles.center}>
          <Text style={styles.trophy}>🏆</Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(27,67,50,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  particle: {
    position: "absolute",
    width: 8,
    height: 14,
    backgroundColor: "#C9A84C",
    borderRadius: 2,
  },
  center: { alignItems: "center", paddingHorizontal: 40 },
  trophy: { fontSize: 64, marginBottom: 12 },
  title: {
    color: "#C9A84C",
    fontSize: 28,
    fontFamily: "NotoSerifBengali",
    textAlign: "center",
  },
  sub: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "NotoSerifBengali",
    textAlign: "center",
    marginTop: 8,
    opacity: 0.85,
  },
});
