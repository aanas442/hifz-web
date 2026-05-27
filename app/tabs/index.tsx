import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F5F3EE" }}>
      <View style={{ padding: 20 }}>

        {/* Greeting */}
        <Text style={{ fontFamily: "serif", fontSize: 16, color: "#2D6A4F", marginBottom: 4 }}>
          আস-সালামু আলাইকুম
        </Text>
        <Text style={{ fontSize: 24, fontWeight: "700", color: "#1A1A18", marginBottom: 24 }}>
          হাফেজ
        </Text>

        {/* Streak Card */}
        <View style={{
          backgroundColor: "#1B4332", borderRadius: 16, padding: 18,
          marginBottom: 14, flexDirection: "row", alignItems: "center"
        }}>
          <View>
            <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>ধারাবাহিক রিভিশন</Text>
            <Text style={{ fontSize: 48, fontWeight: "700", color: "#C9A84C", lineHeight: 56 }}>
              🔥 ১৭
            </Text>
            <Text style={{ fontSize: 14, color: "#fff" }}>দিন</Text>
          </View>
          <View style={{ marginLeft: "auto", flexDirection: "row", gap: 5 }}>
            {["শ","র","সো","ম","বু","বৃ","আ"].map((d, i) => (
              <View key={i} style={{
                width: 22, height: 22, borderRadius: 11,
                backgroundColor: i < 5 ? "#C9A84C" : i === 6 ? "#fff" : "rgba(255,255,255,0.2)",
                alignItems: "center", justifyContent: "center"
              }}>
                <Text style={{ fontSize: 7, color: i < 5 ? "#1B4332" : "#1B4332", fontWeight: "600" }}>{d}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Today's Revision */}
        <View style={{
          backgroundColor: "#FDFAF4", borderRadius: 14, padding: 18,
          borderLeftWidth: 3, borderLeftColor: "#1B4332",
          borderWidth: 1, borderColor: "#E8E4DC", marginBottom: 14,
          shadowColor: "#1B4332", shadowOpacity: 0.06, shadowRadius: 8
        }}>
          <Text style={{ fontSize: 10, color: "#C9A84C", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
            আজকের রিভিশন
          </Text>
          <Text style={{ fontSize: 22, color: "#1B4332", textAlign: "right", marginBottom: 4 }}>
            سُبۡحَٰنَ ٱلَّذِيٓ أَسۡرَىٰ
          </Text>
          <Text style={{ fontSize: 13, color: "#6B6B60", marginBottom: 14 }}>
            পারা ১৫ • পেজ ১৮৯–১৯৬ • ২৫ মিনিট
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: "#1B4332", borderRadius: 12, padding: 14, alignItems: "center" }}
            onPress={() => router.push("/session")}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>রিভিশন শুরু করো →</Text>
          </TouchableOpacity>
        </View>

        {/* Memory Bars */}
        <View style={{
          backgroundColor: "#FDFAF4", borderRadius: 14, padding: 18,
          borderWidth: 1, borderColor: "#E8E4DC", marginBottom: 14
        }}>
          <Text style={{ fontSize: 12, color: "#6B6B60", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>
            স্মৃতির অবস্থা
          </Text>
          {[
            { label: "শক্তিশালী", pct: 58, color: "#1B4332" },
            { label: "মাঝারি",    pct: 24, color: "#C9A84C" },
            { label: "দুর্বল",    pct: 18, color: "#8B1A1A" },
          ].map((item) => (
            <View key={item.label} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
              <Text style={{ fontSize: 12, color: "#1A1A18", width: 80 }}>{item.label}</Text>
              <View style={{ flex: 1, backgroundColor: "#E8E4DC", borderRadius: 99, height: 7, marginHorizontal: 8 }}>
                <View style={{ width: `${item.pct}%`, backgroundColor: item.color, borderRadius: 99, height: 7 }} />
              </View>
              <Text style={{ fontSize: 12, fontWeight: "700", color: item.color, width: 36, textAlign: "right" }}>
                {item.pct}%
              </Text>
            </View>
          ))}
        </View>

        {/* Alert */}
        <View style={{
          backgroundColor: "#FFF3E0", borderLeftWidth: 3, borderLeftColor: "#C97A3A",
          borderRadius: 8, padding: 12
        }}>
          <Text style={{ fontSize: 13, color: "#C97A3A" }}>⚠ ৩টি পেজ অনেকদিন হয়নি → দেখুন</Text>
        </View>

      </View>
    </ScrollView>
  );
}
