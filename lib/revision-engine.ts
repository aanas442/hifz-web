import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PageRecord, createDefaultPageRecords, getParaPages } from "./quran-data";
import { KEYS } from "./storage-keys";

export type { PageRecord };

// ─── Streak ───────────────────────────────────────────────────────────────────

export type StreakData = {
  currentStreak: number;
  longestStreak: number;
  lastReviewDate: string;
  freezesUsedThisWeek: number;
  totalDaysRevised: number;
  history: string[]; // ISO date strings
};

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastReviewDate: "",
  freezesUsedThisWeek: 0,
  totalDaysRevised: 0,
  history: [],
};

// ─── Session ──────────────────────────────────────────────────────────────────

export type SessionPlan = {
  pageIds: number[];
  pageNumbers: number[]; // index.tsx এর এরর এড়াতে যুক্ত রাখা হলো
  estimatedMinutes: number;
  breakdown: {
    overdue: number[];
    critical: number[];
    weak: number[];
    scheduled: number[];
  };
};

export type ReviewResult = "easy" | "good" | "hard" | "forgot";

// ─── Stats (index.tsx এর চাহিদামতো strongPages, mediumPages, weakPages করা হলো) ───

export type Stats = {
  totalReviewed: number;
  strongPages: number;    // strongCount কে strongPages করা হলো
  mediumPages: number;    // mediumCount কে mediumPages করা হলো
  weakPages: number;      // weakCount কে weakPages করা হলো
  unreviewedCount: number;
  overdueCount: number;
  weakestPages: PageRecord[];
  completionPercent: number;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

// ─── Algorithm ────────────────────────────────────────────────────────────────

export function buildDailySession(
  records: PageRecord[],
  dailyMinutes: number
): SessionPlan {
  const t = today();
  const timeMap: Record<number, number> = { 5: 6, 4: 5, 3: 4, 2: 4, 1: 5, 0: 6 };
  const usedIds = new Set<number>();
  const breakdown = { overdue: [] as number[], critical: [] as number[], weak: [] as number[], scheduled: [] as number[] };
  let totalTime = 0;

  const add = (pageId: number, category: keyof typeof breakdown) => {
    if (usedIds.has(pageId)) return;
    const rec = records.find(r => r.pageId === pageId);
    const cost = timeMap[rec?.strength ?? 0];
    if (totalTime + cost > dailyMinutes) return;
    usedIds.add(pageId);
    breakdown[category].push(pageId);
    totalTime += cost;
  };

  // Priority 1: overdue
  records
    .filter(r => r.reviewCount > 0 && r.nextReview <= t && r.nextReview !== "")
    .sort((a, b) => a.nextReview.localeCompare(b.nextReview))
    .forEach(r => add(r.pageId, "overdue"));

  // Priority 2: critical
  records
    .filter(r => r.strength <= 1 && r.reviewCount > 0 && !usedIds.has(r.pageId))
    .sort((a, b) => a.strength - b.strength)
    .forEach(r => add(r.pageId, "critical"));

  // Priority 3: weak
  records
    .filter(r => r.strength >= 2 && r.strength <= 3 && !usedIds.has(r.pageId))
    .forEach(r => add(r.pageId, "weak"));

  // Priority 4: sequential fill
  for (const r of records) {
    if (totalTime >= dailyMinutes) break;
    if (!usedIds.has(r.pageId)) add(r.pageId, "scheduled");
  }

  const combinedPageIds = [...breakdown.overdue, ...breakdown.critical, ...breakdown.weak, ...breakdown.scheduled];

  return {
    pageIds: combinedPageIds,
    pageNumbers: combinedPageIds, 
    estimatedMinutes: totalTime,
    breakdown,
  };
}

export function markPageResult(record: PageRecord, result: ReviewResult): PageRecord {
  const t = today();
  let { strength, interval, easeFactor, reviewCount } = record;

  switch (result) {
    case "easy":
      strength = clamp(strength + 1, 0, 5) as PageRecord["strength"];
      interval = clamp(Math.round(interval * 2.5), 1, 365);
      easeFactor = Math.min(3.0, easeFactor + 0.15);
      break;
    case "good":
      interval = clamp(Math.round(interval * easeFactor), 1, 365);
      break;
    case "hard":
      interval = clamp(Math.round(interval * 1.2), 1, 365);
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      break;
    case "forgot":
      strength = clamp(strength - 1, 0, 5) as PageRecord["strength"];
      interval = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      break;
  }

  return {
    ...record,
    strength,
    interval,
    easeFactor,
    reviewCount: reviewCount + 1,
    lastReviewed: t,
    nextReview: addDays(t, interval),
  };
}

export function getStats(records: PageRecord[]): Stats {
  const t = today();
  const reviewed = records.filter(r => r.reviewCount > 0);
  const strong = records.filter(r => r.strength >= 4);
  const medium = records.filter(r => r.strength >= 2 && r.strength <= 3);
  const weak = records.filter(r => r.strength <= 1 && r.reviewCount > 0);
  const unreviewed = records.filter(r => r.reviewCount === 0);
  const overdue = reviewed.filter(r => r.nextReview <= t && r.nextReview !== "");
  const weakest = [...reviewed].sort((a, b) => a.strength - b.strength).slice(0, 10);

  return {
    totalReviewed: reviewed.length,
    strongPages: strong.length,    
    mediumPages: medium.length,    
    weakPages: weak.length,        
    unreviewedCount: unreviewed.length,
    overdueCount: overdue.length,
    weakestPages: weakest,
    completionPercent: Math.round((strong.length / 611) * 100),
  };
}

export function updateStreak(streak: StreakData): StreakData {
  const t = today();
  const yesterday = addDays(t, -1);
  let { currentStreak, longestStreak, totalDaysRevised, history } = streak;

  if (streak.lastReviewDate === t) return streak; // already counted today
  if (streak.lastReviewDate === yesterday) {
    currentStreak += 1;
  } else if (streak.lastReviewDate !== "") {
    currentStreak = 1; // streak broken
  } else {
    currentStreak = 1; // first time
  }

  longestStreak = Math.max(longestStreak, currentStreak);
  totalDaysRevised += 1;
  const updatedHistory = [...history.filter(d => d !== t), t].slice(-60);

  return { ...streak, currentStreak, longestStreak, lastReviewDate: t, totalDaysRevised, history: updatedHistory };
}

export function useFreeze(streak: StreakData): StreakData | null {
  if (streak.freezesUsedThisWeek >= 1) return null;
  const t = today();
  return {
    ...streak,
    lastReviewDate: t,
    freezesUsedThisWeek: streak.freezesUsedThisWeek + 1,
    history: [...streak.history.filter(d => d !== t), t].slice(-60),
  };
}

// ─── Achievements ─────────────────────────────────────────────────────────────

export type Achievement = {
  id: string;
  nameArabic: string;
  nameBengali: string;
  icon: string;
  earned: boolean;
  earnedDate: string;
};

const ACHIEVEMENT_DEFS = [
  { id: "first_step",    icon: "⭐", nameArabic: "البداية",   nameBengali: "প্রথম পদক্ষেপ" },
  { id: "week_warrior",  icon: "⚔️", nameArabic: "المثابر",   nameBengali: "সপ্তাহ বিজয়ী" },
  { id: "month_master",  icon: "🏆", nameArabic: "المنتظم",   nameBengali: "মাস বিজয়ী"    },
  { id: "century",       icon: "💎", nameArabic: "المئة",     nameBengali: "শততম দিন"     },
  { id: "half_quran",    icon: "📖", nameArabic: "النصف",     nameBengali: "অর্ধ কুরআন"   },
  { id: "full_dawr",     icon: "🌙", nameArabic: "الختم",     nameBengali: "পূর্ণ দওর"    },
  { id: "speed_reader",  icon: "⚡", nameArabic: "السريع",    nameBengali: "দ্রুত পাঠক"   },
  { id: "consistent",    icon: "🎯", nameArabic: "الثابت",    nameBengali: "অবিচল"         },
];

export function checkAchievements(
  records: PageRecord[],
  streak: StreakData,
  sessionPageCount: number,
  earnedIds: string[]
): Achievement[] {
  const stats = getStats(records);
  const t = today();

  const conditions: Record<string, boolean> = {
    first_step:   stats.totalReviewed > 0,
    week_warrior: streak.currentStreak >= 7,
    month_master: streak.currentStreak >= 30,
    century:      streak.currentStreak >= 100,
    half_quran:   stats.strongPages >= 306, // strongCount থেকে strongPages করা হলো
    full_dawr:    stats.strongPages >= 611, // strongCount থেকে strongPages করা হলো
    speed_reader: sessionPageCount >= 10,
    consistent:   streak.currentStreak >= 30 && streak.history.slice(-30).length === 30,
  };

  return ACHIEVEMENT_DEFS.map(def => ({
    ...def,
    earned: earnedIds.includes(def.id) || conditions[def.id],
    earnedDate: conditions[def.id] && !earnedIds.includes(def.id) ? t : "",
  }));
}

// ─── Hook (আপনার আসল সব লজিক সহ) ─────────────────────────────────────────────────

export function useRevisionEngine() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<PageRecord[]>([]);
  const [streak, setStreak] = useState<StreakData>(DEFAULT_STREAK);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [rRaw, sRaw] = await Promise.all([
          AsyncStorage.getItem(KEYS.PAGE_RECORDS),
          AsyncStorage.getItem(KEYS.STREAK),
        ]);
        const loadedRecords: PageRecord[] = rRaw ? JSON.parse(rRaw) : createDefaultPageRecords();
        const loadedStreak: StreakData = sRaw ? JSON.parse(sRaw) : DEFAULT_STREAK;
        setRecords(loadedRecords);
        setStreak(loadedStreak);
        setStats(getStats(loadedRecords));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveRecords = useCallback(async (next: PageRecord[]) => {
    setRecords(next);
    setStats(getStats(next));
    await AsyncStorage.setItem(KEYS.PAGE_RECORDS, JSON.stringify(next));
  }, []);

  const reviewPage = useCallback(async (pageId: number, result: ReviewResult) => {
    setRecords(prev => {
      const next = prev.map(r => r.pageId === pageId ? markPageResult(r, result) : r);
      AsyncStorage.setItem(KEYS.PAGE_RECORDS, JSON.stringify(next)).catch(() => {});
      setStats(getStats(next));
      return next;
    });
  }, []);

  const completeSession = useCallback(async () => {
    const updated = updateStreak(streak);
    setStreak(updated);
    await AsyncStorage.setItem(KEYS.STREAK, JSON.stringify(updated));
    return updated;
  }, [streak]);

  return { loading, records, streak, stats, reviewPage, completeSession, saveRecords };
}