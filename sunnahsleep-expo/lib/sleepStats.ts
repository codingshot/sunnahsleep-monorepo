import type { SleepEntry } from "./storage";

/** Parse "HH:mm" or "H:mm" to minutes since midnight */
function parseMinutes(s: string): number {
  const [h, m] = s.trim().split(/[:\s]/).map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/** Duration in hours (handles overnight: bedtime 22:00, waketime 06:00 → 8) */
export function durationHours(bedtime: string, waketime: string): number {
  let bed = parseMinutes(bedtime);
  let wake = parseMinutes(waketime);
  if (wake <= bed) wake += 24 * 60;
  return (wake - bed) / 60;
}

export function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function averageHours(entries: SleepEntry[]): number {
  if (entries.length === 0) return 0;
  const total = entries.reduce(
    (sum, e) => sum + durationHours(e.bedtime, e.waketime),
    0
  );
  return total / entries.length;
}

/** Filter entries to last N days (by optional date field YYYY-MM-DD); entries without date are included. */
export function filterEntriesByDays(entries: SleepEntry[], days: number): SleepEntry[] {
  if (days <= 0) return entries;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  return entries.filter((e) => !e.date || e.date >= cutoffStr);
}
