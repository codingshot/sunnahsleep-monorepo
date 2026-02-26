/**
 * Background fetch: refresh prayer times cache when app is in background.
 * Requires expo-background-fetch and expo-task-manager.
 */

import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { fetchPrayerTimesByCoords } from "./prayerTimes";
import { getLocationCoords, setPrayerTimesCache } from "./storage";

export const PRAYER_TIMES_BACKGROUND_TASK = "PRAYER_TIMES_REFRESH";

TaskManager.defineTask(PRAYER_TIMES_BACKGROUND_TASK, async () => {
  try {
    const coords = await getLocationCoords();
    if (!coords) return BackgroundFetch.BackgroundFetchResult.NoData;
    const timings = await fetchPrayerTimesByCoords(coords.latitude, coords.longitude);
    if (timings) {
      const date = new Date().toISOString().slice(0, 10);
      await setPrayerTimesCache({ date, timings });
    }
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundFetchAsync(): Promise<boolean> {
  try {
    await BackgroundFetch.registerTaskAsync(PRAYER_TIMES_BACKGROUND_TASK, {
      minimumInterval: 60 * 60 * 12,
      stopOnTerminate: false,
      startOnBoot: false,
    });
    return true;
  } catch {
    return false;
  }
}

export async function unregisterBackgroundFetchAsync(): Promise<void> {
  try {
    await TaskManager.unregisterTaskAsync(PRAYER_TIMES_BACKGROUND_TASK);
  } catch {
    // ignore
  }
}
