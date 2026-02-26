/**
 * Prayer times via Aladhan API (no API key required).
 * https://aladhan.com/prayer-times-api
 */

export type PrayerTimings = {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

const LABELS: Record<keyof PrayerTimings, string> = {
  Fajr: "Fajr",
  Sunrise: "Sunrise",
  Dhuhr: "Dhuhr",
  Asr: "Asr",
  Maghrib: "Maghrib",
  Isha: "Isha",
};

export const PRAYER_ORDER: (keyof PrayerTimings)[] = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

export function getPrayerLabel(key: keyof PrayerTimings): string {
  return LABELS[key];
}

function todayDateString(): string {
  const d = new Date();
  return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getFullYear()}`;
}

export async function fetchPrayerTimesByCoords(lat: number, lon: number): Promise<PrayerTimings | null> {
  const date = todayDateString();
  try {
    const res = await fetch(
      `https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lon}&method=2`
    );
    const data = await res.json();
    const timings = data?.data?.timings as Record<string, string> | undefined;
    if (!timings) return null;
    return {
      Fajr: timings.Fajr ?? "",
      Sunrise: timings.Sunrise ?? "",
      Dhuhr: timings.Dhuhr ?? "",
      Asr: timings.Asr ?? "",
      Maghrib: timings.Maghrib ?? "",
      Isha: timings.Isha ?? "",
    };
  } catch {
    return null;
  }
}

export async function fetchPrayerTimesByAddress(address: string): Promise<PrayerTimings | null> {
  const date = todayDateString();
  try {
    const encoded = encodeURIComponent(address);
    const res = await fetch(
      `https://api.aladhan.com/v1/timingsByAddress/${date}?address=${encoded}&method=2`
    );
    const data = await res.json();
    const timings = data?.data?.timings as Record<string, string> | undefined;
    if (!timings) return null;
    return {
      Fajr: timings.Fajr ?? "",
      Sunrise: timings.Sunrise ?? "",
      Dhuhr: timings.Dhuhr ?? "",
      Asr: timings.Asr ?? "",
      Maghrib: timings.Maghrib ?? "",
      Isha: timings.Isha ?? "",
    };
  } catch {
    return null;
  }
}

export function formatTimeFromApi(timeStr: string): string {
  if (!timeStr) return "—";
  return timeStr.slice(0, 5);
}
