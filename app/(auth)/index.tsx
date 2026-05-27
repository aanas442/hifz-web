import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { Button } from "@/components/ui/Button";

export default function Welcome() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Text style={styles.hafez}>حافظ</Text>
        <Text style={styles.title}>হিফজ কম্পেনিয়ন</Text>
        <Text style={styles.sub}>কম সময়ে, সারাজীবন মজবুত হিফজ</Text>
      </View>
      <View style={styles.bottom}>
        <Button variant="gold" size="lg" onPress={() => router.push("/(auth)/onboarding")}>
          শুরু করি →
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#1B4332", paddingHorizontal: 24 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  hafez: { fontFamily: "ScheherazadeNew", fontSize: 80, color: "#C9A84C", marginBottom: 12 },
  title: { fontFamily: "NotoSerifBengali", fontSize: 28, color: "#FFFFFF" },
  sub: {
    fontFamily: "NotoSerifBengali",
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    marginTop: 10,
    textAlign: "center",
  },
  bottom: { paddingBottom: 24 },
});
