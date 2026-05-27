import React, { useEffect, useState } from "react";
import {
  Modal,
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

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PillTabs } from "@/components/ui/PillTabs";
import { SIMILAR_PAIRS, SimilarPair } from "@/lib/quran-data";
import { KEYS } from "@/lib/storage-keys";

type Mode = "list" | "study" | "quiz";

export default function DrillScreen() {
  const router = useRouter();
  const [pairs, setPairs] = useState<SimilarPair[]>(SIMILAR_PAIRS);
  const [filter, setFilter] = useState<"all" | "সহজ" | "মধ্যম" | "কঠিন">("all");
  const [mode, setMode] = useState<Mode>("list");
  const [active, setActive] = useState<SimilarPair | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(KEYS.CUSTOM_PAIRS);
      if (raw) setPairs([...SIMILAR_PAIRS, ...JSON.parse(raw)]);
    })();
  }, []);

  const visible =
    filter === "all" ? pairs : pairs.filter((p) => p.difficulty === filter);

  if (mode === "study" && active) {
    return <StudyMode pair={active} onClose={() => setMode("list")} onQuiz={() => setMode("quiz")} />;
  }
  if (mode === "quiz" && active) {
    return <QuizMode pair={active} pool={pairs} onClose={() => setMode("list")} />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable onPress={() => router.back()} style={{ padding: 16 }}>
        <Text style={{ fontFamily: "NotoSerifBengali", color: "#1B4332" }}>← ফিরে যান</Text>
      </Pressable>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0 }}>
        <Text style={styles.h1}>অনুরূপ আয়াত drill</Text>
        <View style={{ marginTop: 10 }}>
          <PillTabs
            options={["সব", "সহজ", "মধ্যম", "কঠিন"]}
            value={filter === "all" ? "সব" : filter}
            onChange={(v) => setFilter(v === "সব" ? "all" : (v as any))}
          />
        </View>

        <View style={{ marginTop: 16, gap: 12 }}>
          {visible.map((pair) => (
            <Pressable
              key={pair.id}
              onPress={() => {
                setActive(pair);
                setMode("study");
              }}
            >
              <Card>
                <Text style={styles.ref}>{pair.refA}  ↔  {pair.refB}</Text>
                <Text style={styles.snippet} numberOfLines={1}>{pair.ayahA}</Text>
                <Text style={styles.snippet} numberOfLines={1}>{pair.ayahB}</Text>
                <Text style={styles.diff}>{pair.difficulty}{pair.custom ? " • নিজের" : ""}</Text>
              </Card>
            </Pressable>
          ))}
        </View>

        <View style={{ marginTop: 18 }}>
          <Button variant="outline" onPress={() => setAddOpen(true)}>
            + নিজের pair যোগ করুন
          </Button>
        </View>
      </ScrollView>

      <AddPairModal
        visible={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={async (p) => {
          const next = [...pairs, p];
          setPairs(next);
          const customs = next.filter((x) => x.custom);
          await AsyncStorage.setItem(KEYS.CUSTOM_PAIRS, JSON.stringify(customs));
          setAddOpen(false);
        }}
      />
    </SafeAreaView>
  );
}

function StudyMode({ pair, onClose, onQuiz }: { pair: SimilarPair; onClose: () => void; onQuiz: () => void }) {
  return (
    <SafeAreaView style={styles.safe}>
      <Pressable onPress={onClose} style={{ padding: 16 }}>
        <Text style={{ fontFamily: "NotoSerifBengali", color: "#1B4332" }}>← ফিরে যান</Text>
      </Pressable>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.h1}>স্টাডি</Text>
        <Card style={{ marginTop: 12 }}>
          <Text style={styles.ref}>{pair.refA}</Text>
          <Text style={styles.arabic}>{pair.ayahA}</Text>
        </Card>
        <Card style={{ marginTop: 10 }}>
          <Text style={styles.ref}>{pair.refB}</Text>
          <Text style={styles.arabic}>{pair.ayahB}</Text>
        </Card>
        <Card style={{ marginTop: 10 }}>
          <Text style={styles.kicker}>ব্যাখ্যা</Text>
          <Text style={{ fontFamily: "NotoSerifBengali", color: "#1A1A18", marginTop: 6 }}>
            {pair.explanationBn}
          </Text>
        </Card>
        <View style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
          <View style={{ flex: 1 }}>
            <Button variant="outline" onPress={onClose}>বুঝেছি ✓</Button>
          </View>
          <View style={{ flex: 1 }}>
            <Button onPress={onQuiz}>Quiz করো →</Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuizMode({ pair, pool, onClose }: { pair: SimilarPair; pool: SimilarPair[]; onClose: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  // Pick correct ref + one distractor
  const distractor = pool.find((p) => p.id !== pair.id)?.refB ?? "—";
  const options = [pair.refA, distractor].sort();

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable onPress={onClose} style={{ padding: 16 }}>
        <Text style={{ fontFamily: "NotoSerifBengali", color: "#1B4332" }}>← ফিরে যান</Text>
      </Pressable>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.h1}>Quiz</Text>
        <Card style={{ marginTop: 12 }}>
          <Text style={styles.arabic}>{pair.ayahA}</Text>
        </Card>
        <Text style={[styles.kicker, { marginTop: 16 }]}>এই আয়াতটি কোন স্থান থেকে?</Text>
        <View style={{ gap: 10, marginTop: 10 }}>
          {options.map((opt) => {
            const isCorrect = opt === pair.refA;
            const isPicked = picked === opt;
            return (
              <Pressable
                key={opt}
                disabled={!!picked}
                onPress={() => setPicked(opt)}
                style={[
                  styles.opt,
                  isPicked && (isCorrect ? styles.optCorrect : styles.optWrong),
                ]}
              >
                <Text style={styles.optText}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>
        {picked && (
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontFamily: "NotoSerifBengali", color: "#1A1A18" }}>
              সঠিক উত্তর: {pair.refA}
            </Text>
            <View style={{ marginTop: 12 }}>
              <Button onPress={onClose}>শেষ করো</Button>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function AddPairModal({
  visible,
  onClose,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (p: SimilarPair) => void;
}) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [refA, setRefA] = useState("");
  const [refB, setRefB] = useState("");
  const [exp, setExp] = useState("");
  const [diff, setDiff] = useState<SimilarPair["difficulty"]>("মধ্যম");

  const save = () => {
    if (!a || !b) return;
    onSave({
      id: `c${Date.now()}`,
      ayahA: a,
      ayahB: b,
      refA: refA || "—",
      refB: refB || "—",
      explanationBn: exp,
      difficulty: diff,
      custom: true,
    });
    setA(""); setB(""); setRefA(""); setRefB(""); setExp("");
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
        <View style={styles.modalSheet}>
          <ScrollView>
            <Text style={styles.h1}>নতুন pair</Text>
            <TextInput placeholder="আয়াত ১ (Arabic)" value={a} onChangeText={setA} style={styles.input} placeholderTextColor="#A0A095" />
            <TextInput placeholder="রেফারেন্স ১" value={refA} onChangeText={setRefA} style={styles.input} placeholderTextColor="#A0A095" />
            <TextInput placeholder="আয়াত ২ (Arabic)" value={b} onChangeText={setB} style={styles.input} placeholderTextColor="#A0A095" />
            <TextInput placeholder="রেফারেন্স ২" value={refB} onChangeText={setRefB} style={styles.input} placeholderTextColor="#A0A095" />
            <TextInput placeholder="ব্যাখ্যা" value={exp} onChangeText={setExp} multiline style={[styles.input, { height: 80 }]} placeholderTextColor="#A0A095" />
            <View style={{ marginTop: 8 }}>
              <PillTabs
                options={["সহজ", "মধ্যম", "কঠিন"]}
                value={diff}
                onChange={(v) => setDiff(v as any)}
              />
            </View>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
              <View style={{ flex: 1 }}>
                <Button variant="outline" onPress={onClose}>বাতিল</Button>
              </View>
              <View style={{ flex: 1 }}>
                <Button onPress={save}>সংরক্ষণ</Button>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F3EE" },
  h1: { fontFamily: "NotoSerifBengali", fontSize: 24, fontWeight: "700", color: "#1A1A18" },
  kicker: { fontSize: 10, color: "#C9A84C", letterSpacing: 1, fontWeight: "700" },
  ref: { fontFamily: "ScheherazadeNew", color: "#2D6A4F", fontSize: 14 },
  arabic: { fontFamily: "ScheherazadeNew", fontSize: 22, color: "#1A1A18", textAlign: "right", marginTop: 8, lineHeight: 36 },
  snippet: { fontFamily: "NotoSerifBengali", fontSize: 13, color: "#6B6B60", marginTop: 4 },
  diff: { fontFamily: "NotoSerifBengali", fontSize: 11, color: "#C9A84C", marginTop: 6 },
  opt: { padding: 14, backgroundColor: "#FDFAF4", borderRadius: 10, borderWidth: 1, borderColor: "#E8E4DC" },
  optCorrect: { borderColor: "#2D6A4F", backgroundColor: "#E4F0E6" },
  optWrong: { borderColor: "#8B1A1A", backgroundColor: "#F5E0E0" },
  optText: { fontFamily: "NotoSerifBengali", color: "#1A1A18", fontSize: 14 },
  modalSheet: { maxHeight: "85%", backgroundColor: "#F5F3EE", borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20 },
  input: {
    fontFamily: "NotoSerifBengali",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#E8E4DC",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
    backgroundColor: "#FDFAF4",
    color: "#1A1A18",
  },
});
