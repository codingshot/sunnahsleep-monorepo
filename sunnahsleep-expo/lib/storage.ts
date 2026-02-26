import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEYS = {
  SLEEP_ENTRIES: "sunnahsleep_sleep_entries",
  ALARMS: "sunnahsleep_alarms",
  NOTIFICATIONS_ENABLED: "sunnahsleep_notifications_enabled",
  SLEEP_GOAL_HOURS: "sunnahsleep_sleep_goal_hours",
  DUAS_FAVORITES: "sunnahsleep_duas_favorites",
  ONBOARDING_DONE: "sunnahsleep_onboarding_done",
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

/** Clears all app data (sleep, alarms, favorites, goal, notifications pref, onboarding). Caller should cancel scheduled notifications after this. */
export async function clearAllData(): Promise<void> {
  await Promise.all(
    Object.values(KEYS).map((key) => AsyncStorage.removeItem(key))
  );
}
