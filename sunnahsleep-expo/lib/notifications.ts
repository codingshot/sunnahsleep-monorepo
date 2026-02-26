import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { Alarm } from "./storage";
import { getNotificationsEnabled } from "./storage";

export const ALARM_CATEGORY_ID = "alarm";
const SNOOZE_MINUTES = 5;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("alarms", {
      name: "Alarms & Reminders",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
  await setAlarmCategory();
}

export async function setAlarmCategory(): Promise<void> {
  try {
    await Notifications.setNotificationCategoryAsync(ALARM_CATEGORY_ID, [
      { identifier: "SNOOZE", buttonTitle: "Snooze 5 min", options: { opensAppToForeground: false } },
      { identifier: "DISMISS", buttonTitle: "Dismiss", options: { opensAppToForeground: false, isDestructive: true } },
    ]);
  } catch {
    // Categories not supported (e.g. Expo Go)
  }
}

function parseTime(timeStr: string): { hour: number; minute: number } {
  const [h, m] = timeStr.trim().split(/[:\s]/).map(Number);
  return { hour: h ?? 0, minute: m ?? 0 };
}

export async function scheduleAlarmNotification(alarm: Alarm): Promise<string | null> {
  const enabled = await getNotificationsEnabled();
  if (!enabled || !alarm.enabled) return null;
  try {
    const { hour, minute } = parseTime(alarm.time);
    const trigger: Notifications.DailyTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      ...(Platform.OS === "android" ? { channelId: "alarms" } : {}),
    };
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: alarm.label,
        body: "Time for your reminder.",
        sound: true,
        categoryIdentifier: ALARM_CATEGORY_ID,
        data: { alarmId: alarm.id, alarmLabel: alarm.label },
      },
      trigger,
      identifier: alarm.id,
    });
    return id;
  } catch {
    return null;
  }
}

export async function cancelAlarmNotification(alarmId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(alarmId);
  } catch {
    // ignore
  }
}

export async function rescheduleAllAlarms(alarms: Alarm[]): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  for (const alarm of alarms) {
    if (alarm.enabled) await scheduleAlarmNotification(alarm);
  }
}

export async function cancelAllScheduledNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export function scheduleSnoozeNotification(alarmId: string, alarmLabel: string): void {
  const trigger: Notifications.TimeIntervalTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: SNOOZE_MINUTES * 60,
    repeats: false,
  };
  if (Platform.OS === "android") (trigger as { channelId?: string }).channelId = "alarms";
  Notifications.scheduleNotificationAsync({
    content: {
      title: alarmLabel,
      body: "Snooze reminder.",
      sound: true,
      categoryIdentifier: ALARM_CATEGORY_ID,
      data: { alarmId, alarmLabel },
    },
    trigger,
    identifier: `snooze-${alarmId}-${Date.now()}`,
  }).catch(() => {});
}
