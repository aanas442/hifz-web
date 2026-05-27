import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { PillTabs } from "@/components/ui/PillTabs";
import { PAGES, PARAS, getPara, getParaSurahs, getParaStrength, getPage, getSurah } from "@/lib/quran-data";
import { useRevisionEngine } from "@/lib/revision-engine";

const SCREEN_W = Dimensions.get("window").width;
const CELL = (SCREEN_W - 24) / 10;

const STRENGTH_COLOR = ["#E8E4DC", "#8B1A1A", "#C97A3A", "#C9A84C", "#2D6A4F", "#1B4332"];

export default function QuranTab() {
  const [view, setView] = useState<"para" | "page">("para");
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <PillTabs
          options={["পারা ভিউ", "পেজ গ্রিড"]}
          value={view === "para" ? "পারা ভিউ" : "পেজ গ্রিড"}
          onChange={(v) => setView(v === "পারা ভিউ" ? "para" : "page")}
        />
      </View>
      {view === "para" ? <ParaView /> : <PageGrid />}
    </SafeAreaView>
  );
}

// ---------- Para view ----------

function ParaView() {
  const router = useRouter();
  const { loading, records } = useRevisionEngine();
  const [filter, setFilter] = useState<"all" | "weak" | "untouched">("all");
  const [openParaId, setOpenParaId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!records) return [];
    return PARAS.filter((p) => {
      const s = getParaStrength(records, p.id);
      if (filter === "weak") return s > 0 && s < 40;
      if (filter === "untouched") return s === 0;
      return true;
    });
  }, [records, filter]);

  if (loading || !records) return <Loader />;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
        <PillTabs
          options={["সব", "দুর্বল", "হয়নি"]}
          value={filter === "all" ? "সব" : filter === "weak" ? "দুর্বল" : "হয়নি"}
          onChange={(v) =>
            setFilter(v === "সব" ? "all" : v === "দুর্বল" ? "weak" : "untouched")
          }
        />
        <Pressable onPress={() => router.push("/junction")} style={styles.junctionBtn}>
          <Text style={styles.junctionText}>জাংশন →</Text>
        </Pressable>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(p) => String(p.id)}
        numColumns={3}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => {
          const s = getParaStrength(records, item.id);
          const border = s >= 70 ? "#1B4332" : s >= 40 ? "#C9A84C" : s >= 1 ? "#8B1A1A" : "#D4D0C8";
          return (
            <Pressable
              onPress={() => setOpenParaId(item.id)}
              style={[styles.paraCard, { borderBottomColor: border }]}
            >
              <Text style={styles.paraNum}>{item.id}</Text>
              <Text style={styles.paraAr} numberOfLines={1}>{item.nameAr}</Text>
              <Text style={styles.paraBn} numberOfLines={1}>{item.nameBn}</Text>
            </Pressable>
          );
        }}
      />

      <BottomSheet visible={openParaId !== null} onClose={() => setOpenParaId(null)}>
        {openParaId !== null && (
          <ParaDetail
            paraId={openParaId}
            strength={getParaStrength(records, openParaId)}
            onRevise={() => {
              setOpenParaId(null);
              router.push(`/session?paraId=${openParaId}`);
            }}
          />
        )}
      </BottomSheet>
    </View>
  );
}

function ParaDetail({
  paraId,
  strength,
  onRevise,
}: {
  paraId: number;
  strength: number;
  onRevise: () => void;
}) {
  const p = getPara(paraId)!;
  const surahs = getParaSurahs(paraId);
  const color = strength >= 70 ? "#1B4332" : strength >= 40 ? "#C9A84C" : strength >= 1 ? "#8B1A1A" : "#6B6B60";
  return (
    <ScrollView>
      <Text style={{ fontFamily: "NotoSerifBengali", fontSize: 20, color: "#1A1A18", fontWeight: "700" }}>
        পারা {p.id} — {p.nameBn}
      </Text>
      <Text style={{ fontFamily: "ScheherazadeNew", fontSize: 24, color: "#1B4332", textAlign: "right", marginTop: 4 }}>
        {p.nameAr}
      </Text>
      <View style={[styles.strengthPill, { backgroundColor: color }]}>
        <Text style={{ color: "#FFFFFF", fontFamily: "NotoSerifBengali", fontSize: 12 }}>
          শক্তি {strength}%
        </Text>
      </View>

      <Text style={{ marginTop: 16, fontFamily: "NotoSerifBengali", color: "#6B6B60", fontSize: 12 }}>সূরাসমূহ</Text>
      <View style={{ marginTop: 6, gap: 6 }}>
        {surahs.map((s) => (
          <View key={s.id} style={styles.surahRow}>
            <Text style={{ fontFamily: "ScheherazadeNew", fontSize: 18, color: "#1B4332" }}>{s.nameAr}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "NotoSerifBengali", fontSize: 13, color: "#1A1A18" }}>{s.nameBn}</Text>
              <Text style={{ fontFamily: "NotoSerifBengali", fontSize: 11, color: "#6B6B60" }}>
                পেজ {s.startPage}–{s.endPage}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <View style={{ marginTop: 18 }}>
        <Button onPress={onRevise}>এই পারা রিভিশন করো</Button>
      </View>
    </ScrollView>
  );
}

// ---------- Page grid ----------

function PageGrid() {
  const router = useRouter();
  const { loading, records } = useRevisionEngine();
  const [paraFilter, setParaFilter] = useState<number | "all">("all");
  const [openPage, setOpenPage] = useState<number | null>(null);
  const [speedOpen, setSpeedOpen] = useState(false);

  const pages = useMemo(() => {
    if (paraFilter === "all") return PAGES;
    return PAGES.filter((p) => p.paraId === paraFilter);
  }, [paraFilter]);

  if (loading || !records) return <Loader />;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 50 }} contentContainerStyle={{ paddingHorizontal: 12, gap: 6 }}>
        <Pressable
          onPress={() => setParaFilter("all")}
          style={[styles.paraPill, paraFilter === "all" && styles.paraPillActive]}
        >
          <Text style={[styles.paraPillText, paraFilter === "all" && styles.paraPillTextActive]}>সব</Text>
        </Pressable>
        {PARAS.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => setParaFilter(p.id)}
            style={[styles.paraPill, paraFilter === p.id && styles.paraPillActive]}
          >
            <Text style={[styles.paraPillText, paraFilter === p.id && styles.paraPillTextActive]}>{p.id}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={pages}
        keyExtractor={(p) => String(p.number)}
        numColumns={10}
        contentContainerStyle={{ padding: 12 }}
        getItemLayout={(_, idx) => ({ length: CELL + 3, offset: (CELL + 3) * Math.floor(idx / 10), index: idx })}
        renderItem={({ item }) => {
          const rec = records[item.number - 1];
          const color = STRENGTH_COLOR[rec?.strength ?? 0];
          return (
            <Pressable
              onPress={() => setOpenPage(item.number)}
              style={{
                width: CELL,
                height: CELL,
                margin: 1.5,
                borderRadius: 3,
                backgroundColor: color,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 7, fontWeight: "700" }}>{item.number}</Text>
            </Pressable>
          );
        }}
      />

      <Pressable onPress={() => setSpeedOpen(true)} style={styles.fab}>
        <Text style={{ color: "#1B4332", fontSize: 24 }}>⚡</Text>
      </Pressable>

      <BottomSheet visible={openPage !== null} onClose={() => setOpenPage(null)}>
        {openPage !== null && (
          <View>
            <Text style={{ fontFamily: "NotoSerifBengali", fontWeight: "700", fontSize: 18 }}>
              পেজ {openPage}
            </Text>
            {getPage(openPage)?.surahIds.map((sid) => {
              const s = getSurah(sid);
              if (!s) return null;
              return (
                <Text key={sid} style={{ fontFamily: "NotoSerifBengali", color: "#6B6B60", marginTop: 4 }}>
                  {s.nameBn} • পেজ {s.startPage}–{s.endPage}
                </Text>
              );
            })}
            <View style={{ gap: 8, marginTop: 14 }}>
              <Button
                onPress={() => {
                  const p = openPage;
                  setOpenPage(null);
                  router.push(`/mushaf/${p}`);
                }}
              >
                মুসহাফে দেখো
              </Button>
              <Button variant="outline">দুর্বল করুন</Button>
            </View>
          </View>
        )}
      </BottomSheet>

      <SpeedExposureModal visible={speedOpen} onClose={() => setSpeedOpen(false)} pages={pages} />
    </View>
  );
}

function SpeedExposureModal({
  visible,
  onClose,
  pages,
}: {
  visible: boolean;
  onClose: () => void;
  pages: ReturnType<typeof PAGES.slice>;
}) {
  const [idx, setIdx] = useState(0);

  React.useEffect(() => {
    if (!visible) {
      setIdx(0);
      return;
    }
    const t = setInterval(() => setIdx((i) => (i + 1) % pages.length), 2000);
    return () => clearInterval(t);
  }, [visible, pages.length]);

  const current = pages[idx];
  if (!current) return null;

  return (
    <Modal visible={visible} transparent={false} animationType="fade">
      <Pressable onPress={() => setIdx((i) => (i + 1) % pages.length)} style={styles.speedScreen}>
        <Pressable onPress={onClose} style={styles.speedClose}>
          <Text style={{ color: "#FFFFFF", fontFamily: "NotoSerifBengali" }}>বন্ধ করো</Text>
        </Pressable>
        <Text style={styles.speedPageNum}>{current.number}</Text>
        <Text style={styles.speedWord}>{current.firstWord}</Text>
      </Pressable>
    </Modal>
  );
}

function Loader() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator color="#1B4332" />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F3EE" },
  header: { padding: 16 },
  junctionBtn: { alignSelf: "flex-end", marginTop: 10 },
  junctionText: { color: "#1B4332", fontFamily: "NotoSerifBengali", fontSize: 13 },
  paraCard: {
    flex: 1,
    margin: 6,
    padding: 12,
    backgroundColor: "#FDFAF4",
    borderWidth: 1,
    borderColor: "#E8E4DC",
    borderRadius: 12,
    borderBottomWidth: 3,
    alignItems: "center",
  },
  paraNum: { fontFamily: "ScheherazadeNew", fontSize: 20, color: "#C9A84C" },
  paraAr: { fontFamily: "ScheherazadeNew", fontSize: 13, color: "#1B4332", textAlign: "right", marginTop: 2 },
  paraBn: { fontFamily: "NotoSerifBengali", fontSize: 10, color: "#6B6B60", marginTop: 2 },
  strengthPill: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, marginTop: 8 },
  surahRow: { flexDirection: "row", gap: 12, alignItems: "center", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#F0EDE3" },
  paraPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E8E4DC",
    backgroundColor: "#FDFAF4",
  },
  paraPillActive: { backgroundColor: "#1B4332", borderColor: "#1B4332" },
  paraPillText: { color: "#6B6B60", fontFamily: "NotoSerifBengali", fontSize: 12 },
  paraPillTextActive: { color: "#FFFFFF" },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#C9A84C",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  speedScreen: {
    flex: 1,
    backgroundColor: "#1B4332",
    alignItems: "center",
    justifyContent: "center",
  },
  speedClose: { position: "absolute", top: 50, right: 20 },
  speedPageNum: { fontFamily: "ScheherazadeNew", fontSize: 80, color: "#C9A84C", fontWeight: "700" },
  speedWord: { fontFamily: "ScheherazadeNew", fontSize: 40, color: "#FFFFFF", marginTop: 20 },
});
