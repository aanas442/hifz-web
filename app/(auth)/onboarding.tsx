import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Button } from "@/components/ui/Button";
import { KEYS } from "@/lib/storage-keys";

type HifzLevel = "full" | "partial";
type Mushaf = "emdadia" | "madina";

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [level, setLevel] = useState<HifzLevel>("full");
  const [partialPara, setPartialPara] = useState("1");
  const [minutes, setMinutes] = useState(25);
  const [mushaf, setMushaf] = useState<Mushaf>("emdadia");
  const router = useRouter();

  const finish = async () => {
    const profile = {
      name: name.trim() || "ভাই",
      level,
      partialPara: level === "partial" ? Number(partialPara) || 1 : null,
      dailyMinutes: minutes,
      mushaf,
      createdAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    await AsyncStorage.setItem(KEYS.ONBOARDING, "true");
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Dots step={step} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {step === 0 && (
          <View>
            <Text style={styles.h1}>আপনার পরিচয়</Text>
            <TextInput
              placeholder="আপনার নাম"
              placeholderTextColor="#A0A095"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <Text style={styles.label}>হিফজ লেভেল</Text>
            <View style={styles.row2}>
              <LevelCard
                title="পূর্ণ হাফেজ"
                sub="৩০ পারা মুখস্থ"
                active={level === "full"}
                onPress={() => setLevel("full")}
              />
              <LevelCard
                title="আংশিক হাফেজ"
                sub={`পারা ১ থেকে পারা ${partialPara}`}
                active={level === "partial"}
                onPress={() => setLevel("partial")}
              />
            </View>
            {level === "partial" && (
              <TextInput
                placeholder="শেষ পারা নম্বর"
                placeholderTextColor="#A0A095"
                value={partialPara}
                keyboardType="number-pad"
                onChangeText={setPartialPara}
                style={styles.input}
              />
            )}
            <Text style={styles.label}>দৈনিক সময়</Text>
            <View style={styles.pills}>
              {[15, 25, 45, 60].map((m) => (
                <Pressable
                  key={m}
                  onPress={() => setMinutes(m)}
                  style={[styles.pill, minutes === m && styles.pillActive]}
                >
                  <Text style={[styles.pillText, minutes === m && styles.pillTextActive]}>
                    {m === 60 ? "১ ঘণ্টা" : `${m} মিনিট`}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {step === 1 && (
          <View>
            <Text style={styles.h1}>মুসহাফ নির্বাচন</Text>
            <View style={{ gap: 12, marginTop: 16 }}>
              <MushafCard
                title="ইমদাদিয়া"
                sub="৬১১ পেজ • চকবাজার ঢাকা"
                badge="রেকমেন্ডেড"
                active={mushaf === "emdadia"}
                onPress={() => setMushaf("emdadia")}
              />
              <MushafCard
                title="মদিনা মুসহাফ"
                sub="৬০৪ পেজ"
                active={mushaf === "madina"}
                onPress={() => setMushaf("madina")}
              />
            </View>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.h1}>প্রস্তুত!</Text>
            <Text style={styles.body}>
              আল্লাহর নামে শুরু করি। আপনার সফর সহজ হোক।
            </Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.foot}>
        {step < 2 ? (
          <Button onPress={() => setStep((s) => s + 1)}>পরবর্তী →</Button>
        ) : (
          <Button variant="gold" onPress={finish}>শুরু করো</Button>
        )}
      </View>
    </SafeAreaView>
  );
}

function Dots({ step }: { step: number }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "center", gap: 8, paddingTop: 12 }}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={{
            width: i === step ? 24 : 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: i === step ? "#1B4332" : "#E8E4DC",
          }}
        />
      ))}
    </View>
  );
}

function LevelCard({
  title,
  sub,
  active,
  onPress,
}: {
  title: string;
  sub: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.levelCard,
        active && { borderColor: "#C9A84C", backgroundColor: "#F0EDE3" },
      ]}
    >
      <Text style={styles.levelTitle}>{title}</Text>
      <Text style={styles.levelSub}>{sub}</Text>
    </Pressable>
  );
}

function MushafCard({
  title,
  sub,
  badge,
  active,
  onPress,
}: {
  title: string;
  sub: string;
  badge?: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.mushafCard,
        active && { borderColor: "#C9A84C", backgroundColor: "#F0EDE3" },
      ]}
    >
      <View>
        <Text style={styles.levelTitle}>{title}</Text>
        <Text style={styles.levelSub}>{sub}</Text>
      </View>
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F3EE" },
  scroll: { padding: 20, gap: 12 },
  h1: { fontFamily: "NotoSerifBengali", color: "#1B4332", fontSize: 22, fontWeight: "700", marginVertical: 12 },
  body: { fontFamily: "NotoSerifBengali", color: "#1A1A18", fontSize: 15, marginTop: 12 },
  input: {
    fontFamily: "NotoSerifBengali",
    fontSize: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E4DC",
    color: "#1A1A18",
    marginTop: 8,
  },
  label: { fontFamily: "NotoSerifBengali", fontSize: 13, color: "#6B6B60", marginTop: 24 },
  row2: { flexDirection: "row", gap: 10, marginTop: 12 },
  levelCard: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E8E4DC",
    borderRadius: 12,
    backgroundColor: "#FDFAF4",
  },
  levelTitle: { fontFamily: "NotoSerifBengali", fontSize: 16, color: "#1A1A18", fontWeight: "600" },
  levelSub: { fontFamily: "NotoSerifBengali", fontSize: 12, color: "#6B6B60", marginTop: 4 },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E8E4DC",
    backgroundColor: "#FDFAF4",
  },
  pillActive: { backgroundColor: "#1B4332", borderColor: "#1B4332" },
  pillText: { fontFamily: "NotoSerifBengali", color: "#6B6B60" },
  pillTextActive: { color: "#FFFFFF" },
  mushafCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8E4DC",
    borderRadius: 12,
    backgroundColor: "#FDFAF4",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#C9A84C",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeText: { color: "#1B4332", fontFamily: "NotoSerifBengali", fontSize: 11, fontWeight: "700" },
  foot: { padding: 20 },
});
