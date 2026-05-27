import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";

import { getCachedPageImage, getPageImageUrl, preloadPages } from "@/lib/image-cache";

export interface LineMark {
  type: "weak" | "wrong" | "good";
  timestamp: string;
}

interface Props {
  pageNumber: number;
  /** All line marks keyed "{page}-{lineIndex}" */
  lineMarks?: Record<string, LineMark>;
  onLineTap?: (lineIndex: number) => void;
  /** Hide the invisible 15-line tap layer */
  showLines?: boolean;
}

const LINE_OVERLAY_COLOR: Record<LineMark["type"], string> = {
  weak: "rgba(201,168,76,0.35)", // yellow/gold
  wrong: "rgba(139,26,26,0.30)", // red
  good: "rgba(45,106,79,0.30)", // green
};

export function PageImage({
  pageNumber,
  lineMarks = {},
  onLineTap,
  showLines = true,
}: Props) {
  const [uri, setUri] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [layout, setLayout] = useState<{ w: number; h: number } | null>(null);

  const load = useCallback(async () => {
    setFailed(false);
    setUri(null);

    if (!getPageImageUrl(pageNumber)) {
      setFailed(true);
      return;
    }
    try {
      const path = await getCachedPageImage(pageNumber);
      if (!path) {
        setFailed(true);
        return;
      }
      setUri(path);
      preloadPages(pageNumber);
    } catch {
      setFailed(true);
    }
  }, [pageNumber]);

  useEffect(() => {
    void load();
  }, [load]);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setLayout({ w: width, h: height });
  };

  const handleTap = (yOffset: number) => {
    if (!layout || !onLineTap) return;
    const stripH = layout.h / 15;
    const idx = Math.min(14, Math.max(0, Math.floor(yOffset / stripH)));
    onLineTap(idx);
  };

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      {uri ? (
        <Image
          source={{ uri }}
          style={styles.img}
          contentFit="contain"
          transition={200}
        />
      ) : failed ? (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderTitle}>পেজ {pageNumber}</Text>
          <Text style={styles.placeholderText}>
            ইমেজ লোড হয়নি। Google Drive ID যোগ করুন{"\n"}(lib/image-cache.ts)।
          </Text>
          <Pressable onPress={load} style={styles.retry}>
            <Text style={styles.retryText}>আবার চেষ্টা করুন</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.skeleton}>
          <ActivityIndicator color="#1B4332" />
        </View>
      )}

      {/* Invisible 15-line tap layer + colored overlays */}
      {showLines && layout && (
        <View style={[StyleSheet.absoluteFill, { flexDirection: "column" }]}>
          {Array.from({ length: 15 }, (_, i) => {
            const mark = lineMarks[`${pageNumber}-${i}`];
            return (
              <Pressable
                key={i}
                onPress={() => handleTap((i + 0.5) * (layout.h / 15))}
                style={[
                  styles.strip,
                  mark && { backgroundColor: LINE_OVERLAY_COLOR[mark.type] },
                ]}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "#FFFFF8",
    overflow: "hidden",
  },
  img: { flex: 1, width: "100%" },
  skeleton: {
    flex: 1,
    backgroundColor: "#EDE9DF",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    flex: 1,
    backgroundColor: "#FFFFF8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  placeholderTitle: {
    fontSize: 22,
    color: "#1B4332",
    fontFamily: "NotoSerifBengali",
    marginBottom: 10,
  },
  placeholderText: {
    fontSize: 13,
    color: "#6B6B60",
    fontFamily: "NotoSerifBengali",
    textAlign: "center",
    lineHeight: 20,
  },
  retry: {
    marginTop: 18,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1B4332",
  },
  retryText: { color: "#1B4332", fontFamily: "NotoSerifBengali" },
  strip: { flex: 1 },
});
