import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Card } from "@/components/ui/Card";
import { PillTabs } from "@/components/ui/PillTabs";
import {
  PARAS,
  SURAHS,
  SAJDAH_AYAHS,
  getSurah,
  getPara,
  PAGES,
  getPage,
} from "@/lib/quran-data";
import { KEYS } from "@/lib/storage-keys";

type Tab = "map" | "openings" | "chains" | "sajdah";

const SURAH_OPENING_CLUSTERS: { cluster: string; surahIds: number[] }[] = [
  { cluster: "الم", surahIds: [2, 3, 29, 30, 31, 32] },
  { cluster: "المص", surahIds: [7] },
  { cluster: "المر", surahIds: [13] },
  { cluster: "الر", surahIds: [10, 11, 12, 14, 15] },
  { cluster: "حم", surahIds: [40, 41, 42, 43, 44, 45, 46] },
  { cluster: "طسم", surahIds: [26, 28] },
  { cluster: "طس", surahIds: [27] },
  { cluster: "كهيعص", surahIds: [19] },
  { cluster: "يس", surahIds: [36] },
  { cluster: "ص", surahIds: [38] },
  { cluster: "ق", surahIds: [50] },
  { cluster: "ن", surahIds: [68] },
];

export default function Junction() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("map");

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable onPress={() => router.back()} style={{ padding: 16, paddingBottom: 0 }}>
        <Text style={{ fontFamily: "NotoSerifBengali", color: "#1B4332" }}>← ফিরে যান</Text>
      </Pressable>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <PillTabs
            options={["পারা-সূরা ম্যাপ", "সূরার শুরু", "সংযোগ চেইন", "সেজদাহ"]}
            value={
              tab === "map" ? "পারা-সূরা ম্যাপ"
                : tab === "openings" ? "সূরার শুরু"
                : tab === "chains" ? "সংযোগ চেইন"
                : "সেজদাহ"
            }
            onChange={(v) =>
              setTab(
                v === "পারা-সূরা ম্যাপ" ? "map"
                  : v === "সূরার শুরু" ? "openings"
                  : v === "সংযোগ চেইন" ? "chains"
                  : "sajdah",
              )
            }
          />
        </ScrollView>
      </View>

      {tab === "map" && <ParaMapTab />}
      {tab === "openings" && <OpeningsTab />}
      {tab === "chains" && <ChainsTab />}
      {tab === "sajdah" && <SajdahTab />}
    </SafeAreaView>
  );
}

// ---------- Tab 1 ----------
function ParaMapTab() {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
      {PARAS.map((p) => {
        const surahsHere = SURAHS.filter((s) => !(s.endPage < p.startPage || s.startPage > p.endPage));
        const totalSpan = p.endPage - p.startPage + 1;
        return (
          <Pressable key={p.id} onPress={() => setOpenId(openId === p.id ? null : p.id)}>
            <Card>
              <Text style={styles.rowTitle}>পারা {p.id} • {p.nameBn}</Text>
              <View style={styles.ratioRow}>
                {surahsHere.map((s, i) => {
                  const from = Math.max(p.startPage, s.startPage);
                  const to = Math.min(p.endPage, s.endPage);
                  const span = to - from + 1;
                  const flex = Math.max(1, span);
                  const colors = ["#1B4332", "#2D6A4F", "#C9A84C", "#8B1A1A", "#C97A3A"];
                  return (
                    <View
                      key={s.id}
                      style={{ flex, backgroundColor: colors[i % colors.length], height: 14 }}
                    />
                  );
                })}
              </View>
              {openId === p.id && (
                <View style={{ marginTop: 10, gap: 4 }}>
                  {surahsHere.map((s) => (
                    <Text key={s.id} style={styles.sub}>
                      {s.nameBn} • পেজ {Math.max(p.startPage, s.startPage)}–{Math.min(p.endPage, s.endPage)}
                    </Text>
                  ))}
                </View>
              )}
            </Card>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

// ---------- Tab 2 ----------
function OpeningsTab() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={styles.notice}>
        ⚠ উৎস: তাওজীহুল কুরআন (মুফতি তাকি উসমানি)। যাচাই-যোগ্য তথ্য না থাকলে ম্যানুয়াল ইনপুট প্লেসহোল্ডার দেখানো হবে।
      </Text>
      {SURAH_OPENING_CLUSTERS.map((cluster) => (
        <Card key={cluster.cluster}>
          <Text style={styles.cluster}>{cluster.cluster}</Text>
          <View style={{ marginTop: 8, gap: 8 }}>
            {cluster.surahIds.map((sid) => {
              const s = getSurah(sid);
              if (!s) return null;
              return (
                <View key={sid} style={styles.openingRow}>
                  <Text style={{ fontFamily: "ScheherazadeNew", fontSize: 18, color: "#1B4332" }}>{s.nameAr}</Text>
                  <Text style={{ fontFamily: "NotoSerifBengali", fontSize: 13, color: "#1A1A18", flex: 1, marginLeft: 8 }}>
                    {s.nameBn}
                  </Text>
                </View>
              );
            })}
            <View style={styles.manualPlaceholder}>
              <Text style={styles.manualText}>
                [ ম্যানুয়াল ইনপুট প্রয়োজন: ২য় আয়াত পার্থক্য + ব্যাখ্যা ]
              </Text>
            </View>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

// ---------- Tab 3 ----------
function ChainsTab() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const list = useMemo(() => {
    return Array.from({ length: 610 }, (_, i) => i + 1).filter((n) => !query || String(n).includes(query));
  }, [query]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <TextInput
          placeholder="পেজ নম্বর খুঁজুন"
          value={query}
          onChangeText={setQuery}
          keyboardType="number-pad"
          style={styles.search}
          placeholderTextColor="#A0A095"
        />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 0, gap: 8 }}>
        {list.slice(0, 80).map((n) => {
          const a = getPage(n);
          const b = getPage(n + 1);
          if (!a || !b) return null;
          const sA = getSurah(a.surahIds[a.surahIds.length - 1]);
          const sB = getSurah(b.surahIds[0]);
          return (
            <Pressable key={n} onPress={() => router.push(`/mushaf/${n}`)}>
              <Card>
                <Text style={styles.rowTitle}>পেজ {n} → পেজ {n + 1}</Text>
                <Text style={styles.sub}>শেষ: {sA?.nameBn ?? "—"} • শুরু: {sB?.nameBn ?? "—"}</Text>
                <Text style={{ fontFamily: "NotoSerifBengali", fontSize: 11, color: "#C9A84C", marginTop: 4 }}>
                  Arabic লাইন: ইমেজভিত্তিক — মুসহাফে দেখুন
                </Text>
              </Card>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ---------- Tab 4 ----------
function SajdahTab() {
  const [done, setDone] = useState<Record<number, boolean>>({});
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(KEYS.SAJDAH_DONE);
      if (raw) setDone(JSON.parse(raw));
    })();
  }, []);

  const toggle = async (id: number) => {
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    await AsyncStorage.setItem(KEYS.SAJDAH_DONE, JSON.stringify(next));
  };

  const reset = () =>
    Alert.alert("রিসেট", "সব checkmark মুছবেন?", [
      { text: "বাতিল", style: "cancel" },
      {
        text: "মুছুন",
        onPress: async () => {
          setDone({});
          await AsyncStorage.removeItem(KEYS.SAJDAH_DONE);
        },
      },
    ]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 8 }}>
      <Text style={styles.notice}>
        Arabic টেক্সট: ম্যানুয়াল ইনপুট প্রয়োজন। মুসহাফ থেকে যাচাই করুন।
      </Text>
      {SAJDAH_AYAHS.map((s) => {
        const surah = getSurah(s.surahId);
        return (
          <Card key={s.id}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>
                  {surah?.nameBn ?? "—"} • আয়াত {s.ayahNum}
                </Text>
                <Text style={styles.sub}>পারা {s.paraId}</Text>
                <View style={styles.manualPlaceholder}>
                  <Text style={styles.manualText}>[ Arabic text — manual input ]</Text>
                </View>
              </View>
              <Pressable
                onPress={() => toggle(s.id)}
                style={[
                  styles.check,
                  done[s.id] && { backgroundColor: "#2D6A4F", borderColor: "#2D6A4F" },
                ]}
              >
                {done[s.id] && <Text style={{ color: "#FFFFFF" }}>✓</Text>}
              </Pressable>
            </View>
          </Card>
        );
      })}
      <Pressable onPress={reset} style={styles.resetBtn}>
        <Text style={{ color: "#8B1A1A", fontFamily: "NotoSerifBengali" }}>সব reset করুন</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F3EE" },
  rowTitle: { fontFamily: "NotoSerifBengali", fontSize: 15, color: "#1A1A18", fontWeight: "600" },
  sub: { fontFamily: "NotoSerifBengali", fontSize: 12, color: "#6B6B60", marginTop: 2 },
  ratioRow: { flexDirection: "row", marginTop: 10, borderRadius: 7, overflow: "hidden" },
  cluster: { fontFamily: "ScheherazadeNew", fontSize: 32, color: "#1B4332", textAlign: "center" },
  openingRow: { flexDirection: "row", alignItems: "center", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#F0EDE3" },
  notice: {
    fontFamily: "NotoSerifBengali",
    fontSize: 12,
    color: "#7A4A1F",
    backgroundColor: "#FFF3E0",
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#C97A3A",
  },
  manualPlaceholder: { backgroundColor: "#FFF7D6", padding: 8, borderRadius: 6, marginTop: 6 },
  manualText: { fontFamily: "NotoSerifBengali", fontSize: 11, color: "#7A6A1F" },
  search: {
    fontFamily: "NotoSerifBengali",
    fontSize: 14,
    backgroundColor: "#FDFAF4",
    borderWidth: 1,
    borderColor: "#E8E4DC",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#1A1A18",
  },
  check: {
    width: 32, height: 32, borderRadius: 8,
    borderWidth: 1.5, borderColor: "#D4D0C8",
    alignItems: "center", justifyContent: "center",
  },
  resetBtn: { alignSelf: "center", padding: 12, marginTop: 8 },
});
