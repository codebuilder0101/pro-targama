import { useCallback, useEffect, useState } from "react";

// Free daily translation quota for visitors without an account.
// First-pass enforcement is client-side; it will move server-side once auth
// lands (logged-in users are exempt).
const LIMIT = 10;
const KEY = "targama_daily_usage";

function todayKey(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function readUsage(): { day: string; count: number } {
  if (typeof window === "undefined") return { day: todayKey(), count: 0 };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { day?: string; count?: number };
      if (parsed && parsed.day === todayKey() && typeof parsed.count === "number") {
        return { day: parsed.day, count: parsed.count };
      }
    }
  } catch {
    // ignore malformed storage
  }
  return { day: todayKey(), count: 0 };
}

export function useDailyLimit() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(readUsage().count);
  }, []);

  const increment = useCallback(() => {
    const current = readUsage();
    const next = { day: todayKey(), count: current.count + 1 };
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // ignore write failures (e.g. private mode)
    }
    setCount(next.count);
  }, []);

  // Reads fresh from storage so gating never relies on a stale closure.
  const isBlocked = useCallback(() => readUsage().count >= LIMIT, []);

  return {
    limit: LIMIT,
    remaining: Math.max(0, LIMIT - count),
    reachedLimit: count >= LIMIT,
    increment,
    isBlocked,
  };
}
