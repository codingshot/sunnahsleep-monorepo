import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEYS = {
  SLEEP_ENTRIES: "sunnahsleep_sleep_entries",
  ALARMS: "sunnahsleep_alarms",
  NOTIFICATIONS_ENABLED: "sunnahsleep_notifications_enabled",
  SLEEP_GOAL_HOURS: "sunnahsleep_sleep_goal_hours",
  DUAS_FAVORITES: "sunnahsleep_duas_favorites",
  ONBOARDING_DONE: "sunnahsleep_onboarding_done",
  LOCATION_COORDS: "sunnahsleep_location_coords",
  LOCALE_OVERRIDE: "sunnahsleep_locale_override",
  PRAYER_TIMES_CACHE: "sunnahsleep_prayer_times_cache",
  USE_LOCATION_FOR_PRAYER: "sunnahsleep_use_location_for_prayer",
} as const;

const KEYS = STORAGE_KEYS;

export type SleepEntry = { bedtime: string; waketime: string; date?: string };
export type Alarm = { id: string; time: string; label: string; enabled: boolean };

export async function getSleepGoalHours(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SLEEP_GOAL_HOURS);
    if (raw === null) return 8;
    const n = parseFloat(raw);
    return Number.isFinite(n) && n >= 0 ? n : 8;
  } catch {
    return 8;
  }
}

export async function setSleepGoalHours(hours: number): Promise<void> {
  await AsyncStorage.setItem(KEYS.SLEEP_GOAL_HOURS, String(Math.max(0, hours)));
}

export async function getDuaFavorites(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.DUAS_FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function setDuaFavorites(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.DUAS_FAVORITES, JSON.stringify(ids));
}

export async function getNotificationsEnabled(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.NOTIFICATIONS_ENABLED);
    return raw === null ? true : raw === "1";
  } catch {
    return true;
  }
}

export async function setNotificationsEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.NOTIFICATIONS_ENABLED, enabled ? "1" : "0");
}

export async function getSleepEntries(): Promise<SleepEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SLEEP_ENTRIES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function setSleepEntries(entries: SleepEntry[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.SLEEP_ENTRIES, JSON.stringify(entries));
}

export async function getAlarms(): Promise<Alarm[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.ALARMS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function setAlarms(alarms: Alarm[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.ALARMS, JSON.stringify(alarms));
}

export type LocationCoords = { latitude: number; longitude: number } | null;

export async function getLocationCoords(): Promise<LocationCoords> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.LOCATION_COORDS);
    if (!raw) return null;
    const o = JSON.parse(raw) as { latitude: number; longitude: number };
    return Number.isFinite(o?.latitude) && Number.isFinite(o?.longitude) ? o : null;
  } catch {
    return null;
  }
}

export async function setLocationCoords(coords: LocationCoords): Promise<void> {
  if (coords) await AsyncStorage.setItem(KEYS.LOCATION_COORDS, JSON.stringify(coords));
  else await AsyncStorage.removeItem(KEYS.LOCATION_COORDS);
}

export async function getLocaleOverride(): Promise<string | null> {
  return await AsyncStorage.getItem(KEYS.LOCALE_OVERRIDE);
}

export async function setLocaleOverride(locale: string | null): Promise<void> {
  if (locale) await AsyncStorage.setItem(KEYS.LOCALE_OVERRIDE, locale);
  else await AsyncStorage.removeItem(KEYS.LOCALE_OVERRIDE);
}

export async function getUseLocationForPrayer(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.USE_LOCATION_FOR_PRAYER);
    return raw === null ? true : raw === "1";
  } catch {
    return true;
  }
}

export async function setUseLocationForPrayer(use: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.USE_LOCATION_FOR_PRAYER, use ? "1" : "0");
}

export type PrayerTimesCache = { date: string; timings: Record<string, string> } | null;

export async function getPrayerTimesCache(): Promise<PrayerTimesCache> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.PRAYER_TIMES_CACHE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function setPrayerTimesCache(cache: PrayerTimesCache): Promise<void> {
  if (cache) await AsyncStorage.setItem(KEYS.PRAYER_TIMES_CACHE, JSON.stringify(cache));
  else await AsyncStorage.removeItem(KEYS.PRAYER_TIMES_CACHE);
}

/** Clears all app data (sleep, alarms, favorites, goal, notifications pref, onboarding, location, locale, prayer cache). Caller should cancel scheduled notifications after this. */
export async function clearAllData(): Promise<void> {
  await Promise.all(
    Object.values(KEYS).map((key) => AsyncStorage.removeItem(key))
  );
}
