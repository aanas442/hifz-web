import { View, Text, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { useState } from "react";

const PARAS = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  nameArabic: ["الٓمٓ","سَيَقُولُ","تِلۡكَ","لَن تَنَالُواْ","وَٱلۡمُحۡصَنَٰتُ",
    "لَا يُحِبُّ","وَإِذَا","وَلَوۡ","قَالَ","وَٱعۡلَمُوٓاْ",
    "يَعۡتَذِرُونَ","وَمَا مِن","وَمَآ أُبَرِّئُ","رُبَمَا","سُبۡحَٰنَ",
    "قَالَ أَلَمۡ","ٱقۡتَرَبَ","قَدۡ أَفۡلَحَ","وَقَالَ","أَمَّنۡ",
    "ٱتۡلُ","وَمَن يَقۡنُتۡ","وَمَآ أُنزِلَ","فَمَن أَظۡلَمُ","إِلَيۡهِ",
    "حٰمٓ","قَالَ فَمَا","قَدۡ سَمِعَ","تَبَٰرَكَ","عَمَّ"][i],
  nameBengali: ["আলিফ-লাম-মিম","সাইয়াকুল","তিলকার","লান তানালু","ওয়াল মুহসানাত",
    "লা ইউহিব্বু","ওয়া ইযা","ওয়ালাউ","কালাল মালাউ","ওয়া-লামু",
    "ইয়া-তাযিরুন","ওয়া মা মিন","ওয়া মা উবাররিউ","রুবামা","সুবহানাল্লাযি",
    "কালা আলাম","ইক্বতারাবা","কাদ আফলাহা","ওয়া কালাল্লাযিন","আম্মান",
    "উতলু","ওয়া মাই ইয়াকনুত","ওয়া মা উনযিলা","ফামান আজলাম","ইলাইহি",
    "হা-মিম","কালা ফামা","কাদ সামিআ","তাবারাকা","আম্মা"][i],
  strength: Math.floor(Math.random() * 100),
}));

export default function QuranScreen() {
  const [view, setView] = useState<"para" | "grid">("para");

  const getColor = (s: number) =>
    s >= 70 ? "#1B4332" : s >= 40 ? "#C9A84C" : s > 0 ? "#8B1A1A" : "#D4D0C8";

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F3EE" }}>
      {/* Toggle */}
      <View style={{ flexDirection: "row", padding: 16, gap: 8 }}>
        {(["para", "grid"] as const).map((v) => (
          <TouchableOpacity
            key={v}
            onPress={() => setView(v)}
            style={{
              flex: 1, padding: 10, borderRadius: 99, alignItems: "center",
              backgroundColor: view === v ? "#1B4332" : "transparent",
              borderWidth: 1.5, borderColor: view === v ? "#1B4332" : "#E8E4DC",
            }}
          >
            <Text style={{ color: view === v ? "#fff" : "#6B6B60", fontSize: 13, fontWeight: "600" }}>
              {v === "para" ? "পারা ভিউ" : "পেজ গ্রিড"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {view === "para" ? (
        <FlatList
          data={PARAS}
          numColumns={3}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 10 }}
          renderItem={({ item }) => (
            <View style={{
              flex: 1, margin: 4, backgroundColor: "#FDFAF4", borderRadius: 12,
              padding: 12, borderWidth: 1, borderColor: "#E8E4DC",
              borderBottomWidth: 3, borderBottomColor: getColor(item.strength),
            }}>
              <Text style={{ fontSize: 18, color: "#C9A84C", fontWeight: "700", textAlign: "center" }}>
                {item.id}
              </Text>
              <Text style={{ fontSize: 12, color: "#1B4332", textAlign: "center", marginTop: 2 }}>
                {item.nameArabic}
              </Text>
              <Text style={{ fontSize: 9, color: "#6B6B60", textAlign: "center", marginTop: 2 }}>
                {item.nameBengali}
              </Text>
            </View>
          )}
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 12 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 2 }}>
            {Array.from({ length: 611 }, (_, i) => {
              const s = Math.floor(Math.random() * 6);
              const bg = [
                "#1B4332","#2D6A4F","#C9A84C","#C97A3A","#8B1A1A","#E8E4DC"
              ][s];
              return (
                <View key={i} style={{
                  width: 32, height: 32, borderRadius: 3, backgroundColor: bg,
                  alignItems: "center", justifyContent: "center",
                }}>
                  <Text style={{ fontSize: 7, color: "rgba(255,255,255,0.8)" }}>{i + 1}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
