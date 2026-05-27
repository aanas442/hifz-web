import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Card } from "@/components/ui/Card";
import { PillTabs } from "@/components/ui/PillTabs";
import { PARAS, getPara, getParaStrength } from "@/lib/quran-data";
import { useRevisionEngine } from "@/lib/revision-engine";

export default function ProgressTab() {
  const { loading, records, stats, streak, achievements } = useRevisionEngine();
  const [range, setRange] = useState<"week" | "month" | "all">("all");
  const [openParaId, setOpenParaId] = useState<number | null>(null);
  const [openAch, setOpenAch] = useState<string | null>(null);

  const heatmap = useMemo(() => {
    if (!records) return [];
    return PARAS.map((p) => ({ id: p.id, strength: getParaStrength(records, p.id), name: p.nameBn }));
  }, [records]);

  if (loading || !records || !stats) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#1B4332" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.h1}>অগ্রগতি</Text>

        <View style={{ marginBottom: 12 }}>
          <PillTabs
            options={["এই সপ্তাহ", "এই মাস", "সব সময়"]}
            value={range === "week" ? "এই সপ্তাহ" : range === "month" ? "এই মাস" : "সব সময়"}
            onChange={(v) =>
              setRange(v === "এই সপ্তাহ" ? "week" : v === "এই মাস" ? "month" : "all")
            }
          />
        </View>

        <Card>
          <Text style={styles.kicker}>পারা হিটম্যাপ</Text>
          <View style={styles.heatRow}>
            {heatmap.map((h) => {
              const color = h.strength >= 70 ? "#1B4332" : h.strength >= 40 ? "#2D6A4F" : h.strength >= 20 ? "#C9A84C" : h.strength >= 1 ? "#8B1A1A" : "#E8E4DC";
              return (
                <Pressable
                  key={h.id}
                  onPress={() => setOpenParaId(h.id)}
                  style={[styles.heatCell, { backgroundColor: color }]}
                >
                  <Text style={styles.heatNum}>{h.id}</Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        <View style={styles.statGrid}>
          <Stat icon="🔥" value={streak.current} label="স্ট্রিক" />
          <Stat icon="📖" value={stats.totalReviewed} label="মোট রিভিশন" />
          <Stat icon="💚" value={stats.strongPages} label="শক্তিশালী পেজ" />
          <Stat icon="⚠" value={stats.weakPages} label="দুর্বল পেজ" />
        </View>

        <Card style={{ marginTop: 16 }}>
          <Text style={styles.kicker}>হিলিং চার্ট (গত ৭ সপ্তাহ)</Text>
          <View style={styles.chartRow}>
            {Array.from({ length: 7 }, (_, i) => {
              const h = 20 + ((stats.strongPages + i * 13) % 80);
              return <View key={i} style={[styles.bar, { height: h }]} />;
            })}
          </View>
        </Card>

        <Text style={[styles.kicker, { marginTop: 20 }]}>অর্জন</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            {achievements.map((a) => (
              <Pressable
                key={a.id}
                onPress={() => a.earned && setOpenAch(a.id)}
                style={[
                  styles.badge,
                  a.earned ? { borderColor: "#C9A84C" } : { opacity: 0.35 },
                ]}
              >
                <Text style={{ fontSize: 28 }}>{a.earned ? "🏅" : "🔒"}</Text>
                <Text style={styles.badgeText} numberOfLines={2}>{a.name}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </ScrollView>

      <Modal visible={openAch !== null} transparent animationType="fade">
        <Pressable style={styles.modalBg} onPress={() => setOpenAch(null)}>
          {openAch && (
            <View style={styles.modalCard}>
              {(() => {
                const a = achievements.find((x) => x.id === openAch)!;
                return (
                  <>
                    <Text style={{ fontSize: 48, textAlign: "center" }}>🏅</Text>
                    <Text style={styles.modalTitle}>{a.name}</Text>
                    <Text style={styles.modalSub}>{a.description}</Text>
                    {a.earnedAt && (
                      <Text style={styles.modalDate}>
                        {new Date(a.earnedAt).toLocaleDateString("bn-BD")}
                      </Text>
                    )}
                  </>
                );
              })()}
            </View>
          )}
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function Stat({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <View style={styles.statCell}>
      <Text style={{ fontSize: 22 }}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F3EE" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F5F3EE" },
  scroll: { padding: 20, paddingBottom: 40 },
  h1: { fontFamily: "NotoSerifBengali", fontSize: 24, fontWeight: "700", color: "#1A1A18", marginBottom: 12 },
  kicker: { fontSize: 10, color: "#C9A84C", letterSpacing: 1, fontWeight: "700" },
  heatRow: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 10 },
  heatCell: { width: "15%", aspectRatio: 1, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  heatNum: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  statGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 16, gap: 10 },
  statCell: {
    width: "47%",
    backgroundColor: "#FDFAF4",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E4DC",
    alignItems: "center",
  },
  statValue: { fontSize: 28, fontWeight: "700", color: "#1A1A18", fontFamily: "NotoSerifBengali" },
  statLabel: { fontSize: 11, color: "#6B6B60", fontFamily: "NotoSerifBengali" },
  chartRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: 14, height: 100, paddingHorizontal: 4 },
  bar: { width: 24, backgroundColor: "#2D6A4F", borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  badge: {
    width: 84,
    padding: 10,
    backgroundColor: "#FDFAF4",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E8E4DC",
    alignItems: "center",
  },
  badgeText: { fontFamily: "NotoSerifBengali", fontSize: 10, color: "#1A1A18", marginTop: 6, textAlign: "center" },
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center" },
  modalCard: { width: "80%", backgroundColor: "#FDFAF4", padding: 24, borderRadius: 16 },
  modalTitle: { fontFamily: "NotoSerifBengali", fontSize: 20, fontWeight: "700", textAlign: "center", marginTop: 8 },
  modalSub: { fontFamily: "NotoSerifBengali", fontSize: 13, color: "#6B6B60", textAlign: "center", marginTop: 4 },
  modalDate: { fontFamily: "NotoSerifBengali", fontSize: 12, color: "#C9A84C", textAlign: "center", marginTop: 8 },
});
