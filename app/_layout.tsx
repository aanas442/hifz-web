import "../global.css";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { KEYS } from "@/lib/storage-keys";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ScheherazadeNew: require("../assets/fonts/ScheherazadeNew-Regular.ttf"),
    NotoSerifBengali: require("../assets/fonts/NotoSerifBengali-Regular.ttf"),
  });

  const [onboarded, setOnboarded] = useState<boolean | null>(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    (async () => {
      try {
        const done = await AsyncStorage.getItem(KEYS.ONBOARDING);
        // যদি অনবোর্ডিং ডেটা না থাকে, তবে টেস্ট করার জন্য সরাসরি ট্রু বা ফলস দিন
        setOnboarded(done === "true");
      } catch (e) {
        setOnboarded(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (fontsLoaded && onboarded !== null) {
      setTimeout(() => {
        SplashScreen.hideAsync().catch(() => {});
      }, 500); // আইফোনের সেফ রেন্ডারিংয়ের জন্য ৫০০ মিলিগ্রাম ডিলে
    }
  }, [fontsLoaded, onboarded]);

  useEffect(() => {
    if (onboarded === null || !fontsLoaded) return;
    
    const inAuth = segments[0] === "(auth)";
    
    // রাউটিং সেফগার্ড: কোনো পেজ খুঁজে না পেলে জোর করে হোম ট্যাবে পাঠাবে
    if (!onboarded && !inAuth) {
      router.replace("/(tabs)"); // সাময়িকভাবে সরাসরি হোমে পাঠাচ্ছি জ্যাম কাটানোর জন্য
    } else if (onboarded && inAuth) {
      router.replace("/(tabs)");
    }
  }, [onboarded, segments, fontsLoaded]);

  if (!fontsLoaded || onboarded === null) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#F5F3EE" } }} />
    </GestureHandlerRootView>
  );
}