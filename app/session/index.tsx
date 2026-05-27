import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageImage } from "@/components/quran/PageImage";
import { useRevisionEngine, buildDailySession, ReviewResult } from "@/lib/revision-engine";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KEYS } from "@/lib/storage-keys";

type Phase = "plan" | "active" | "done";

const STRENGTH_DOT = ["#E8E4DC", "#8B1A1A", "#C97A3A", "#C9A84C", "#2D6A4F", "#1B4332"];

export default function Session() {
  const { paraId } = useLocalSearchParams<{ paraId?: string }>();
  const router = useRouter();
  const { loading, records, reviewPage, completeSession } = useRevisionEngine();

  const [phase, setPhase] = useState<Phase>("plan");
  const [weakOnly, setWeakOnly] = useState(false);
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [selectedParaId, setSelectedParaId] = useState<number | undefined>(
    paraId ? Number(paraId) : undefined,
  );

  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [counts, setCounts] = useState({ easy: 0, good: 0, hard: 0, forgot: 0 });
  const startTime = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);

  const [dailyMinutes, setDailyMinutes] = useState(25);
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(KEYS.PROFILE);
      if (raw) setDailyMinutes(JSON.parse(raw).dailyMinutes ?? 25);
    })();
  }, []);

  const plan = useMemo(() => {
    if (!records) return null;
    return buildDailySession(records, dailyMinutes, {
      paraId: selectedParaId,
      weakOnly,
      overdueOnly,
    });
  }, [records, dailyMinutes, selectedParaId, weakOnly, overdueOnly]);

  useEffect(() => {
    if (phase !== "active") return;
    const i = setInterval(() => setElapsed(Math.floor((Date.now() - startTime.current) / 1000)), 1000);
    return () => clearInterval(i);
  }, [phase]);

  if (loading || !records || !plan) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#1B4332" />
      </View>
    );
  }

  // ---------- PHASE: PLAN ----------
  if (phase === "plan") {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={styles.h1}>আজকের সেশন</Text>
          <Card style={{ marginTop: 12 }}>
            <Text style={styles.body}>
              {plan.pageNumbers.length} পেজ • ~{plan.estimatedMinutes} মিনিট
            </Text>
            <View style={{ marginTop: 10, gap: 4 }}>
              {plan.pageNumbers.slice(0, 8).map((n) => {
                const rec = records[n - 1];
                return (
                  <View key={n} style={styles.planRow}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: STRENGTH_DOT[rec?.strength ?? 0],
                      }}
                    />
                    <Text style={styles.planText}>পেজ {n}</Text>
                  </View>
                );
              })}
              {plan.pageNumbers.length > 8 && (
                <Text style={[styles.planText, { color: "#6B6B60", marginTop: 4 }]}>
                  + আরো {plan.pageNumbers.length - 8} পেজ
                </Text>
              )}
            </View>
          </Card>

          <Card style={{ marginTop: 12 }}>
            <Text style={styles.kicker}>কাস্টম অপশন</Text>
            <Toggle label="শুধু দুর্বল পেজ" value={weakOnly} onChange={setWeakOnly} />
            <Toggle label="শুধু overdue" value={overdueOnly} onChange={setOverdueOnly} />
          </Card>

          <View style={{ marginTop: 16 }}>
            <Button
              onPress={() => {
                startTime.current = Date.now();
                setPhase("active");
              }}
              disabled={plan.pageNumbers.length === 0}
            >
              শুরু করো →
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ---------- PHASE: ACTIVE ----------
  if (phase === "active") {
    const currentPage = plan.pageNumbers[idx];

    const submit = async (result: ReviewResult) => {
      const label =
        result === "easy"
          ? "আলহামদুলিল্লাহ ✓"
          : result === "forgot"
            ? "আবার আসবে ইনশাআল্লাহ"
            : "ঠিক আছে";
      setFeedback(label);
      await reviewPage(currentPage, result);
      setCounts((c) => ({ ...c, [result]: c[result] + 1 }));
      setTimeout(async () => {
        setFeedback(null);
        if (idx + 1 < plan.pageNumbers.length) {
          setIdx((i) => i + 1);
        } else {
          await completeSession(plan.pageNumbers.length);
          setPhase("done");
        }
      }, 800);
    };

    const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const ss = String(elapsed % 60).padStart(2, "0");

    return (
      <SafeAreaView style={styles.activeSafe}>
        <View style={styles.activeTop}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.exit}>← বের হও</Text>
          </Pressable>
          <Text style={styles.activePage}>পেজ {idx + 1}/{plan.pageNumbers.length}</Text>
          <Text style={styles.timer}>{mm}:{ss}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <PageImage pageNumber={currentPage} />
        </View>

        <View style={styles.feedbackButtons}>
          <FeedbackBtn label="😊 সহজ" color="#D7EAD9" onPress={() => submit("easy")} />
          <FeedbackBtn label="🙂 ঠিকঠাক" color="#DCE7F2" onPress={() => submit("good")} />
          <FeedbackBtn label="😕 কঠিন" color="#F5E8C7" onPress={() => submit("hard")} />
          <FeedbackBtn label="😰 ভুলে গেছি" color="#F5D2D2" onPress={() => submit("forgot")} />
        </View>

        <Modal visible={feedback !== null} transparent animationType="fade">
          <View style={styles.fbBg}>
            <View style={styles.fbCard}>
              <Text style={styles.fbText}>{feedback}</Text>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // ---------- PHASE: DONE ----------
  const totalSec = Math.floor((Date.now() - startTime.current) / 1000);
  const mins = Math.max(1, Math.round(totalSec / 60));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ padding: 24, alignItems: "center" }}>
        <Text style={styles.alham}>الحمد لله</Text>
        <Text style={styles.doneTitle}>সেশন সম্পন্ন হয়েছে</Text>

        <View style={styles.statGrid}>
          <StatBox label="পেজ" value={plan.pageNumbers.length} />
          <StatBox label="সময়" value={`${mins} মি`} />
          <StatBox label="সহজ" value={counts.easy} />
          <StatBox label="ভুলে গেছি" value={counts.forgot} />
        </View>

        <Text style={styles.nextSession}>
          পরের সেশন: আগামীকাল ~{plan.pageNumbers.length} পেজ
        </Text>

        <View style={{ width: "100%", gap: 10, marginTop: 24 }}>
          <Button
            variant="outline"
            onPress={() =>
              Share.share({
                message: `আজ আলহামদুলিল্লাহ ${plan.pageNumbers.length} পেজ রিভিশন করলাম। 🤲`,
              })
            }
          >
            শেয়ার করো
          </Button>
          <Button onPress={() => router.replace("/(tabs)")}>বের হও</Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10 }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 4,
          borderWidth: 1.5,
          borderColor: value ? "#1B4332" : "#D4D0C8",
          backgroundColor: value ? "#1B4332" : "transparent",
          marginRight: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {value && <Text style={{ color: "#FFFFFF", fontSize: 12 }}>✓</Text>}
      </View>
      <Text style={{ fontFamily: "NotoSerifBengali", fontSize: 14, color: "#1A1A18" }}>{label}</Text>
    </Pressable>
  );
}

function FeedbackBtn({ label, color, onPress }: { label: string; color: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.fbBtn, { backgroundColor: color }]}
    >
      <Text style={styles.fbBtnText}>{label}</Text>
    </Pressable>
  );
}

function StatBox({ label, value }: { label: string; value: number | string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F3EE" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F5F3EE" },
  h1: { fontFamily: "NotoSerifBengali", fontSize: 24, fontWeight: "700", color: "#1A1A18" },
  body: { fontFamily: "NotoSerifBengali", fontSize: 15, color: "#1A1A18" },
  kicker: { fontSize: 10, color: "#C9A84C", letterSpacing: 1, fontWeight: "700" },
  planRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  planText: { fontFamily: "NotoSerifBengali", fontSize: 14, color: "#1A1A18" },

  activeSafe: { flex: 1, backgroundColor: "#FFFFF8" },
  activeTop: {
    height: 50,
    backgroundColor: "#1B4332",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  exit: { color: "#FFFFFF", fontFamily: "NotoSerifBengali", fontSize: 13 },
  activePage: { color: "#FFFFFF", fontFamily: "NotoSerifBengali", fontWeight: "700" },
  timer: { color: "#C9A84C", fontFamily: "NotoSerifBengali", fontSize: 13 },

  feedbackButtons: {
    flexDirection: "row",
    height: 60,
  },
  fbBtn: { flex: 1, alignItems: "center", justifyContent: "center" },
  fbBtnText: { fontFamily: "NotoSerifBengali", fontSize: 12, color: "#1A1A18" },

  fbBg: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)" },
  fbCard: { backgroundColor: "#FDFAF4", paddingHorizontal: 28, paddingVertical: 18, borderRadius: 12 },
  fbText: { fontFamily: "NotoSerifBengali", fontSize: 16, color: "#1B4332" },

  alham: { fontFamily: "ScheherazadeNew", fontSize: 36, color: "#C9A84C", marginTop: 20 },
  doneTitle: { fontFamily: "NotoSerifBengali", fontSize: 18, color: "#1A1A18", marginTop: 8 },
  statGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 24, width: "100%" },
  statBox: {
    width: "47%",
    backgroundColor: "#FDFAF4",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E4DC",
    alignItems: "center",
  },
  statValue: { fontSize: 28, fontWeight: "700", color: "#1B4332", fontFamily: "NotoSerifBengali" },
  statLabel: { fontSize: 12, color: "#6B6B60", fontFamily: "NotoSerifBengali", marginTop: 2 },
  nextSession: { fontFamily: "NotoSerifBengali", fontSize: 13, color: "#6B6B60", marginTop: 20 },
});
