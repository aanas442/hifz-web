import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StreakCard } from "@/components/revision/StreakCard";
import { useRevisionEngine, buildDailySession } from "@/lib/revision-engine";
import { KEYS } from "@/lib/storage-keys";
import { getPara } from "@/lib/quran-data";

export default function Home() {
  const router = useRouter();
  const { loading, records, streak, stats } = useRevisionEngine();
  const [profile, setProfile] = useState<{ name: string; dailyMinutes: number } | null>(null);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(KEYS.PROFILE);
      setProfile(raw ? JSON.parse(raw) : { name: "ভাই", dailyMinutes: 25 });
    })();
  }, []);

  if (loading || !profile) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#1B4332" />
      </View>
    );
  }

  // ডাটাবেজ খালি থাকলেও যেন ক্র্যাশ না করে, তাই সেফগার্ড ডিফাইন করা হলো
  const safeRecords = records || [];
  
  const plan = buildDailySession(safeRecords, profile.dailyMinutes);
  
  // plan এবং plan.pageIds আছে কি না তা সেফলি চেক করা হলো যেন TypeError না আসে
  const safePageIds = plan && plan.pageIds ? plan.pageIds : [];
  const firstPara = safePageIds[0] ? getPara(safePageIds[0]) : null;

  const totalPages = safeRecords.length || 1;

  // আপনার অরিজিনাল রিভিশন ইঞ্জিনের ভ্যালু নেম (strongCount, mediumCount, weakCount) হুবহু ব্যবহার করা হলো
  const strongPct = stats ? Math.round((stats.strongCount / totalPages) * 100) : 0;
  const mediumPct = stats ? Math.round((stats.mediumCount / totalPages) * 100) : 0;
  const weakPct = stats ? Math.round((stats.weakCount / totalPages) * 100) : 0;
  const overdueCount = stats ? stats.overdueCount : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.salam}>আস-সালামু আলাইকুম</Text>
        <Text style={styles.name}>{profile.name}</Text>

        <View style={{ marginTop: 20 }}>
          <StreakCard streak={streak} />
        </View>

        <Card style={{ marginTop: 16 }} leftAccent="#1B4332">
          <Text style={styles.kicker}>আজকের রিভিশন</Text>
          {firstPara && <Text style={styles.paraAr}>{firstPara.nameAr}</Text>}
          <Text style={styles.metaLine}>
            {firstPara ? `পারা ${firstPara.id} • ` : ""}
            পেজ {safePageIds[0] ?? "—"}–{safePageIds.at(-1) ?? "—"} • {plan?.estimatedMinutes ?? 0} মিনিট
          </Text>
          <View style={{ marginTop: 12 }}>
            <Button onPress={() => router.push("/session")}>রিভিশন শুরু করো →</Button>
          </View>
        </Card>

        <Card style={{ marginTop: 16 }}>
          <Text style={styles.kicker}>স্মৃতির অবস্থা</Text>
          <BarRow label="শক্তিশালী" value={strongPct} color="#1B4332" />
          <BarRow label="মাঝারি" value={mediumPct} color="#C9A84C" />
          <BarRow label="দুর্বল" value={weakPct} color="#8B1A1A" />
        </Card>

        {overdueCount > 0 && (
          <Pressable onPress={() => router.push("/(tabs)/revision")}>
            <View style={styles.alert}>
              <Text style={styles.alertText}>
                ⚠ {overdueCount}টি পেজ অনেকদিন হয়নি → দেখুন
              </Text>
            </View>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function BarRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={{ marginTop: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontFamily: "NotoSerifBengali", fontSize: 13, color: "#1A1A18", width: 70 }}>
          {label}
        </Text>
        <View style={{ flex: 1 }}>
          <ProgressBar value={value} color={color} />
        </View>
        <Text style={{ fontFamily: "NotoSerifBengali", fontSize: 13, color: "#6B6B60", width: 40, textAlign: "right" }}>
          {value}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F3EE" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F5F3EE" },
  scroll: { padding: 20, paddingBottom: 40 },
  salam: { fontFamily: "ScheherazadeNew", fontSize: 16, color: "#2D6A4F" },
  name: { fontFamily: "NotoSerifBengali", fontSize: 24, fontWeight: "700", color: "#1A1A18" },
  kicker: { fontSize: 10, color: "#C9A84C", letterSpacing: 1, fontWeight: "700" },
  paraAr: { fontFamily: "ScheherazadeNew", fontSize: 22, color: "#1B4332", textAlign: "right", marginTop: 6 },
  metaLine: { fontFamily: "NotoSerifBengali", fontSize: 13, color: "#6B6B60", marginTop: 4 },
  alert: {
    backgroundColor: "#FFF3E0",
    borderLeftWidth: 3,
    borderLeftColor: "#C97A3A",
    padding: 12,
    paddingHorizontal: 14,
    marginTop: 16,
    borderRadius: 6,
  },
  alertText: { fontFamily: "NotoSerifBengali", color: "#7A4A1F", fontSize: 13 },
});