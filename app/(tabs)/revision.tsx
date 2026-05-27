import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function RevisionHub() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
        <Text style={styles.h1}>রিভিশন হাব</Text>

        <Hub
          title="আজকের সেশন"
          sub="দৈনিক প্ল্যান অনুযায়ী রিভিশন"
          cta="শুরু করো"
          onPress={() => router.push("/session")}
        />
        <Hub
          title="অনুরূপ আয়াত drill"
          sub="মুতাশাবিহাত আয়াত মনে রাখুন"
          cta="খুলো"
          onPress={() => router.push("/drill")}
        />
        <Hub
          title="ইমাম মোড"
          sub="র‍্যান্ডম প্রশ্ন - কাঠামোগত জ্ঞান যাচাই"
          cta="খেলো"
          onPress={() => router.push("/imam")}
        />
        <Hub
          title="মাস্টার জাংশন"
          sub="পারা-সূরা ম্যাপ, সংযোগ চেইন, সেজদাহ"
          cta="দেখো"
          onPress={() => router.push("/junction")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function Hub({ title, sub, cta, onPress }: { title: string; sub: string; cta: string; onPress: () => void }) {
  return (
    <Card>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.sub}>{sub}</Text>
      <View style={{ marginTop: 12 }}>
        <Button onPress={onPress}>{cta} →</Button>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F3EE" },
  h1: { fontFamily: "NotoSerifBengali", fontSize: 24, fontWeight: "700", color: "#1A1A18", marginBottom: 8 },
  title: { fontFamily: "NotoSerifBengali", fontSize: 18, fontWeight: "600", color: "#1A1A18" },
  sub: { fontFamily: "NotoSerifBengali", fontSize: 13, color: "#6B6B60", marginTop: 4 },
});
