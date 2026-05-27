import React, { useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PillTabs } from "@/components/ui/PillTabs";
import { PARAS, SURAHS, getPara, getSurah } from "@/lib/quran-data";

type Difficulty = "সহজ" | "মধ্যম" | "কঠিন";
type Phase = "intro" | "play" | "done";

interface Question {
  text: string;
  options: string[];
  correctIndex: number;
}

// Build metadata-only question bank — NO Arabic generation.
function generateQuestions(difficulty: Difficulty, weakParaBias = false): Question[] {
  const pool: Question[] = [];

  // Type 1: Which para does surah X start in?
  for (const s of SURAHS.slice(0, 30)) {
    const correct = String(s.paraId);
    const distractors = new Set<string>();
    while (distractors.size < 3) {
      const d = String(1 + Math.floor(Math.random() * 30));
      if (d !== correct) distractors.add(d);
    }
    const options = [correct, ...distractors].sort(() => Math.random() - 0.5);
    pool.push({
      text: `${s.nameBn} সূরা কোন পারায় শুরু হয়?`,
      options,
      correctIndex: options.indexOf(correct),
    });
  }

  // Type 2: Page range of a para
  for (const p of PARAS) {
    const correct = `${p.startPage}–${p.endPage}`;
    const distractors = new Set<string>();
    while (distractors.size < 3) {
      const other = PARAS[Math.floor(Math.random() * 30)];
      const d = `${other.startPage}–${other.endPage}`;
      if (d !== correct) distractors.add(d);
    }
    const options = [correct, ...distractors].sort(() => Math.random() - 0.5);
    pool.push({
      text: `পারা ${p.id} (${p.nameBn}) কোন পেজে?`,
      options,
      correctIndex: options.indexOf(correct),
    });
  }

  // Shuffle and pick 10
  const shuffled = pool.sort(() => Math.random() - 0.5);
  const sliced = shuffled.slice(0, 10);

  // Difficulty affects # of options (এখানে রাখা সহজ)
  if (difficulty === "সহজ") {
    return sliced.map((q) => {
      const correct = q.options[q.correctIndex];
      const other = q.options.find((o) => o !== correct)!;
      const opts = [correct, other].sort(() => Math.random() - 0.5);
      return { ...q, options: opts, correctIndex: opts.indexOf(correct) };
    });
  }
  return sliced;
}

export default function ImamMode() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [difficulty, setDifficulty] = useState<Difficulty>("মধ্যম");
  const [weakOnly, setWeakOnly] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const start = () => {
    setQuestions(generateQuestions(difficulty, weakOnly));
    setIdx(0);
    setScore(0);
    setPicked(null);
    setPhase("play");
  };

  if (phase === "intro") {
    return (
      <SafeAreaView style={styles.safe}>
        <Pressable onPress={() => router.back()} style={{ padding: 16 }}>
          <Text style={{ fontFamily: "NotoSerifBengali", color: "#1B4332" }}>← ফিরে যান</Text>
        </Pressable>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={styles.h1}>ইমাম মোড</Text>
          <Text style={styles.sub}>কাঠামোগত প্রশ্ন — কোথায় কোন পারা/সূরা।</Text>
          <View style={{ marginTop: 18 }}>
            <PillTabs
              options={["সহজ", "মধ্যম", "কঠিন"]}
              value={difficulty}
              onChange={(v) => setDifficulty(v as Difficulty)}
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 16, gap: 10 }}>
            <Switch value={weakOnly} onValueChange={setWeakOnly} trackColor={{ true: "#1B4332" }} />
            <Text style={{ fontFamily: "NotoSerifBengali" }}>দুর্বল পারা থেকে প্রশ্ন</Text>
          </View>
          <View style={{ marginTop: 24 }}>
            <Button onPress={start}>শুরু করো</Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (phase === "play") {
    const q = questions[idx];
    const correct = picked === q.correctIndex;
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flexDirection: "row", gap: 4 }}>
              {questions.map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: 8, height: 8, borderRadius: 4,
                    backgroundColor: i < idx ? "#1B4332" : i === idx ? "#C9A84C" : "#E8E4DC",
                  }}
                />
              ))}
            </View>
            <Text style={{ fontFamily: "NotoSerifBengali", color: "#1B4332", fontWeight: "700" }}>
              {score}/{questions.length}
            </Text>
          </View>

          <Card style={{ marginTop: 18, backgroundColor: "#1B4332" }}>
            <Text style={{ fontFamily: "NotoSerifBengali", color: "#FFFFFF", fontSize: 17 }}>
              {q.text}
            </Text>
          </Card>

          <View style={styles.optGrid}>
            {q.options.map((o, i) => {
              const isPicked = picked === i;
              const isCorrect = i === q.correctIndex;
              return (
                <Pressable
                  key={i}
                  disabled={picked !== null}
                  onPress={() => {
                    setPicked(i);
                    if (i === q.correctIndex) setScore((s) => s + 1);
                  }}
                  style={[
                    styles.optCard,
                    isPicked && isCorrect && styles.optGood,
                    isPicked && !isCorrect && styles.optBad,
                    !isPicked && picked !== null && isCorrect && styles.optGood,
                  ]}
                >
                  <Text style={styles.optText}>{o}</Text>
                </Pressable>
              );
            })}
          </View>

          {picked !== null && (
            <View style={{ marginTop: 18 }}>
              <Button
                onPress={() => {
                  if (idx + 1 < questions.length) {
                    setIdx((i) => i + 1);
                    setPicked(null);
                  } else {
                    setPhase("done");
                  }
                }}
              >
                {idx + 1 < questions.length ? "পরবর্তী →" : "ফলাফল দেখো"}
              </Button>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // done
  const pct = Math.round((score / questions.length) * 100);
  const msg = pct >= 80 ? "মাশাআল্লাহ!" : pct >= 50 ? "ভালো প্রচেষ্টা" : "চেষ্টা চালিয়ে যান";
  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ flex: 1, padding: 24, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontFamily: "NotoSerifBengali", fontSize: 22, color: "#1A1A18" }}>{msg}</Text>
        <Text style={{ fontFamily: "ScheherazadeNew", fontSize: 60, color: "#C9A84C", marginTop: 16 }}>
          {score}/{questions.length}
        </Text>
        <View style={{ gap: 10, width: "100%", marginTop: 30 }}>
          <Button onPress={start}>আবার খেলো</Button>
          <Button variant="outline" onPress={() => router.back()}>বের হও</Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F3EE" },
  h1: { fontFamily: "NotoSerifBengali", fontSize: 24, fontWeight: "700", color: "#1A1A18" },
  sub: { fontFamily: "NotoSerifBengali", fontSize: 13, color: "#6B6B60", marginTop: 6 },
  optGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 18 },
  optCard: {
    width: "47%",
    padding: 16,
    backgroundColor: "#FDFAF4",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E4DC",
    minHeight: 70,
    justifyContent: "center",
  },
  optGood: { borderColor: "#2D6A4F", backgroundColor: "#E4F0E6" },
  optBad: { borderColor: "#8B1A1A", backgroundColor: "#F5E0E0" },
  optText: { fontFamily: "NotoSerifBengali", color: "#1A1A18", fontSize: 14 },
});
