import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { PageImage, LineMark } from "@/components/quran/PageImage";
import { LineToolbar, ToolbarAction } from "@/components/quran/LineToolbar";
import { KEYS } from "@/lib/storage-keys";
import { getPage, getPara, getSurah } from "@/lib/quran-data";
import { preloadPages } from "@/lib/image-cache";

const { width: SCREEN_W } = Dimensions.get("window");

const showToast = (msg: string) => {
  if (Platform.OS === "android") ToastAndroid.show(msg, ToastAndroid.SHORT);
  else console.log(msg);
};

export default function MushafPage() {
  const { page } = useLocalSearchParams<{ page: string }>();
  const router = useRouter();
  const pageNum = Math.max(1, Math.min(611, Number(page) || 1));

  const [fullscreen, setFullscreen] = useState(false);
  const [tajweedOn, setTajweedOn] = useState(false);
  const [marks, setMarks] = useState<Record<string, LineMark>>({});
  const [activeLine, setActiveLine] = useState<number | null>(null);

  useEffect(() => {
    AsyncStorage.setItem(KEYS.LAST_PAGE, String(pageNum));
    preloadPages(pageNum);
    (async () => {
      const raw = await AsyncStorage.getItem(KEYS.LINE_MARKS);
      if (raw) setMarks(JSON.parse(raw));
    })();
  }, [pageNum]);

  const persistMarks = useCallback(async (next: Record<string, LineMark>) => {
    setMarks(next);
    await AsyncStorage.setItem(KEYS.LINE_MARKS, JSON.stringify(next));
  }, []);

  const goto = (next: number) => {
    if (next < 1 || next > 611) return;
    router.replace(`/mushaf/${next}`);
  };

  const handleAction = (action: ToolbarAction) => {
    if (activeLine === null) return;
    if (action === "mark" || action === "bookmark") {
      const key = `${pageNum}-${activeLine}`;
      const current = marks[key];
      const cycle: LineMark["type"][] = ["weak", "wrong", "good"];
      const next: LineMark["type"] = current
        ? cycle[(cycle.indexOf(current.type) + 1) % cycle.length]
        : "weak";
      persistMarks({ ...marks, [key]: { type: next, timestamp: new Date().toISOString() } });
      showToast(`লাইন ${activeLine + 1}: ${next}`);
    } else if (action === "tajweed") {
      setTajweedOn((v) => !v);
      if (!tajweedOn) showToast("তাজউইদ ওভারলে শীঘ্রই আসছে");
    } else if (action === "play") {
      showToast("Audio শীঘ্রই আসছে");
    } else if (action === "copy") {
      showToast("কপি — শীঘ্রই");
    } else if (action === "share") {
      showToast("শেয়ার — শীঘ্রই");
    }
    setActiveLine(null);
  };

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => setFullscreen((v) => !v));

  const swipe = Gesture.Pan()
    .activeOffsetX([-30, 30])
    .onEnd((e) => {
      if (e.translationX < -50) goto(pageNum + 1);
      else if (e.translationX > 50) goto(pageNum - 1);
    });

  const composed = Gesture.Race(doubleTap, swipe);

  const page_ = getPage(pageNum);
  const para = page_ ? getPara(page_.paraId) : undefined;
  const surah = page_?.surahIds[0] ? getSurah(page_.surahIds[0]) : undefined;

  return (
    <SafeAreaView style={styles.safe}>
      {!fullscreen && (
        <View style={styles.topBar}>
          <Text style={styles.topAr}>{surah?.nameAr ?? ""}</Text>
          <Text style={styles.topCenter}>
            {pageNum} ({para?.id}:{surah?.id})
          </Text>
          <Text style={styles.topAr}>{para?.nameAr ?? ""}</Text>
        </View>
      )}

      <GestureDetector gesture={composed}>
        <View style={{ flex: 1, position: "relative" }}>
          <PageImage
            pageNumber={pageNum}
            lineMarks={marks}
            onLineTap={(idx) => setActiveLine(idx)}
          />
          {tajweedOn && (
            <View pointerEvents="none" style={styles.tajweedOverlay}>
              <Text style={styles.tajweedNote}>তাজউইদ ওভারলে শীঘ্রই</Text>
            </View>
          )}
          {activeLine !== null && (
            <View
              style={[
                styles.toolbarWrap,
                { top: Math.max(20, (activeLine / 15) * 0.85 * Dimensions.get("window").height - 70) },
              ]}
            >
              <LineToolbar onAction={handleAction} />
            </View>
          )}
        </View>
      </GestureDetector>

      {!fullscreen && (
        <View style={styles.bottomBar}>
          <Pressable onPress={() => goto(pageNum - 1)} style={styles.arrow}>
            <Text style={styles.arrowText}>←</Text>
          </Pressable>
          <Text style={styles.pageLabel}>{pageNum}</Text>
          <Pressable onPress={() => goto(pageNum + 1)} style={styles.arrow}>
            <Text style={styles.arrowText}>→</Text>
          </Pressable>
        </View>
      )}

      {!fullscreen && (
        <Pressable onPress={() => setTajweedOn((v) => !v)} style={styles.tajFab}>
          <Text style={styles.tajFabText}>تج</Text>
        </Pressable>
      )}

      {!fullscreen && (
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← বের হও</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFF8" },
  topBar: {
    height: 44,
    backgroundColor: "#1B4332",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },
  topAr: { fontFamily: "ScheherazadeNew", color: "#FFFFFF", fontSize: 13, maxWidth: SCREEN_W * 0.3 },
  topCenter: { fontFamily: "ScheherazadeNew", color: "#C9A84C", fontSize: 14, fontWeight: "700" },
  bottomBar: {
    height: 52,
    backgroundColor: "#1B4332",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  arrow: { padding: 10 },
  arrowText: { color: "#FFFFFF", fontSize: 26 },
  pageLabel: { fontFamily: "ScheherazadeNew", color: "#C9A84C", fontSize: 18, fontWeight: "700" },
  tajFab: {
    position: "absolute",
    right: 16,
    bottom: 70,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FDFAF4",
    borderWidth: 1,
    borderColor: "#1B4332",
    alignItems: "center",
    justifyContent: "center",
  },
  tajFabText: { fontFamily: "ScheherazadeNew", color: "#1B4332", fontSize: 18, fontWeight: "700" },
  backBtn: { position: "absolute", left: 12, top: 56, backgroundColor: "rgba(27,67,50,0.85)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  backText: { color: "#FFFFFF", fontFamily: "NotoSerifBengali", fontSize: 12 },
  toolbarWrap: { position: "absolute", alignSelf: "center" },
  tajweedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(201,168,76,0.10)",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 30,
  },
  tajweedNote: { color: "#1B4332", fontFamily: "NotoSerifBengali", fontSize: 11 },
});
