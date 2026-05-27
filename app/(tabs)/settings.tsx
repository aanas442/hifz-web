import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { KEYS } from "@/lib/storage-keys";
import { clearImageCache, getCacheSizeMB } from "@/lib/image-cache";

interface Settings {
  arabicFontSize: "small" | "medium" | "large";
  darkMode: boolean;
  reminderTime: string;
  weeklySummary: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  arabicFontSize: "medium",
  darkMode: false,
  reminderTime: "06:00",
  weeklySummary: true,
};

export default function SettingsTab() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [profile, setProfile] = useState<any>(null);
  const [cacheMB, setCacheMB] = useState(0);

  useEffect(() => {
    (async () => {
      const [s, p] = await Promise.all([
        AsyncStorage.getItem(KEYS.SETTINGS),
        AsyncStorage.getItem(KEYS.PROFILE),
      ]);
      if (s) setSettings(JSON.parse(s));
      if (p) setProfile(JSON.parse(p));
      setCacheMB(await getCacheSizeMB());
    })();
  }, []);

  const save = async (next: Settings) => {
    setSettings(next);
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(next));
  };

  const wipe = () => {
    Alert.alert("সব ডেটা মুছবেন?", "এই কাজটি ফিরানো যাবে না।", [
      { text: "বাতিল", style: "cancel" },
      {
        text: "মুছুন",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.clear();
          await clearImageCache();
          Alert.alert("সম্পন্ন", "অ্যাপ পুনরায় খুলুন।");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
        <Text style={styles.h1}>সেটিংস</Text>

        <Group title="প্রোফাইল">
          <Row label="নাম" value={profile?.name ?? "—"} />
          <Row label="হিফজ লেভেল" value={profile?.level === "full" ? "পূর্ণ" : `আংশিক (${profile?.partialPara ?? "—"})`} />
        </Group>

        <Group title="অ্যাপ">
          <Row label="দৈনিক সময়" value={`${profile?.dailyMinutes ?? 25} মিনিট`} />
          <Row label="মুসহাফ" value={profile?.mushaf === "madina" ? "মদিনা" : "ইমদাদিয়া"} />
          <RowSelect
            label="Arabic ফন্ট সাইজ"
            options={[
              { id: "small", label: "ছোট" },
              { id: "medium", label: "মাঝারি" },
              { id: "large", label: "বড়" },
            ]}
            value={settings.arabicFontSize}
            onChange={(v) => save({ ...settings, arabicFontSize: v as Settings["arabicFontSize"] })}
          />
          <RowToggle
            label="ডার্ক মোড"
            value={settings.darkMode}
            onChange={(v) => save({ ...settings, darkMode: v })}
          />
        </Group>

        <Group title="নোটিফিকেশন">
          <RowInput
            label="রিমাইন্ডার সময়"
            value={settings.reminderTime}
            onChange={(v) => save({ ...settings, reminderTime: v })}
          />
          <RowToggle
            label="সাপ্তাহিক সারাংশ"
            value={settings.weeklySummary}
            onChange={(v) => save({ ...settings, weeklySummary: v })}
          />
        </Group>

        <Group title="ডেটা">
          <RowAction label="রপ্তানি" onPress={() => Alert.alert("শীঘ্রই আসছে")} />
          <RowAction label="আমদানি" onPress={() => Alert.alert("শীঘ্রই আসছে")} />
          <RowAction
            label={`Cache clear (${cacheMB} MB)`}
            onPress={async () => {
              await clearImageCache();
              setCacheMB(0);
              Alert.alert("Cache পরিষ্কার করা হয়েছে");
            }}
          />
        </Group>

        <Group>
          <RowAction label="⚠ সব ডেটা মুছুন" danger onPress={wipe} />
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      {title && <Text style={styles.groupTitle}>{title}</Text>}
      <View style={styles.groupBody}>{children}</View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function RowToggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch value={value} onValueChange={onChange} thumbColor="#FDFAF4" trackColor={{ true: "#1B4332", false: "#D4D0C8" }} />
    </View>
  );
}

function RowInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <TextInput value={value} onChangeText={onChange} style={styles.rowInput} placeholderTextColor="#A0A095" />
    </View>
  );
}

function RowSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={[styles.row, { flexDirection: "column", alignItems: "stretch", gap: 8 }]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {options.map((o) => (
          <Pressable
            key={o.id}
            onPress={() => onChange(o.id)}
            style={[styles.selectChip, value === o.id && styles.selectChipActive]}
          >
            <Text style={[styles.selectChipText, value === o.id && styles.selectChipTextActive]}>{o.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function RowAction({ label, onPress, danger }: { label: string; onPress: () => void; danger?: boolean }) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Text style={[styles.rowLabel, danger && { color: "#8B1A1A" }]}>{label}</Text>
      <Text style={{ color: "#6B6B60" }}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F3EE" },
  h1: { fontFamily: "NotoSerifBengali", fontSize: 24, fontWeight: "700", color: "#1A1A18", paddingHorizontal: 20, marginBottom: 12 },
  group: { marginTop: 16 },
  groupTitle: {
    fontSize: 11,
    color: "#6B6B60",
    fontFamily: "NotoSerifBengali",
    paddingHorizontal: 20,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  groupBody: { backgroundColor: "#FDFAF4", borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#E8E4DC" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EDE3",
  },
  rowLabel: { fontFamily: "NotoSerifBengali", fontSize: 15, color: "#1A1A18" },
  rowValue: { fontFamily: "NotoSerifBengali", fontSize: 14, color: "#6B6B60" },
  rowInput: {
    fontFamily: "NotoSerifBengali",
    fontSize: 14,
    color: "#1A1A18",
    minWidth: 80,
    textAlign: "right",
  },
  selectChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E8E4DC",
    alignItems: "center",
  },
  selectChipActive: { backgroundColor: "#1B4332", borderColor: "#1B4332" },
  selectChipText: { fontFamily: "NotoSerifBengali", color: "#6B6B60" },
  selectChipTextActive: { color: "#FFFFFF" },
});
