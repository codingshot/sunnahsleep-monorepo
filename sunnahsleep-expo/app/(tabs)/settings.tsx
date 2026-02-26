import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Share,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import Constants from "expo-constants";
import { useColorScheme } from "react-native";
import { theme } from "@/constants/theme";
import { cancelAllScheduledNotifications } from "@/lib/notifications";
import { useLocale } from "@/lib/i18n";
import {
  clearAllData,
  getAlarms,
  getNotificationsEnabled,
  getSleepEntries,
  getSleepGoalHours,
  getUseLocationForPrayer,
  setNotificationsEnabled as persistNotificationsEnabled,
  setSleepGoalHours,
  setUseLocationForPrayer,
  STORAGE_KEYS,
} from "@/lib/storage";

const ONBOARDING_DONE_KEY = STORAGE_KEYS.ONBOARDING_DONE;

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { t, locale, setLocale } = useLocale();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [sleepGoal, setSleepGoal] = useState("8");
  const [useLocationForPrayer, setUseLocationForPrayerState] = useState(true);
  const primaryColor = colorScheme === "dark" ? theme.dark.primary : theme.light.primary;

  useEffect(() => {
    getNotificationsEnabled().then(setNotificationsEnabled);
    getSleepGoalHours().then((h) => setSleepGoal(String(h)));
    getUseLocationForPrayer().then(setUseLocationForPrayerState);
  }, []);

  const onSleepGoalBlur = useCallback(async () => {
    const n = parseFloat(sleepGoal);
    if (Number.isFinite(n) && n >= 0) {
      await setSleepGoalHours(n);
    } else {
      const h = await getSleepGoalHours();
      setSleepGoal(String(h));
    }
  }, [sleepGoal]);

  const handleExportData = useCallback(async () => {
    try {
      const [entries, alarms] = await Promise.all([getSleepEntries(), getAlarms()]);
      const data = JSON.stringify({ sleepEntries: entries, alarms, exportedAt: new Date().toISOString() }, null, 2);
      await Share.share({
        message: data,
        title: "Sunnah Sleep export",
      });
    } catch (e) {
      Alert.alert("Export failed", "Could not export data.");
    }
  }, []);

  const onNotificationsToggle = useCallback(async (value: boolean) => {
    setNotificationsEnabled(value);
    await persistNotificationsEnabled(value);
  }, []);

  const onUseLocationForPrayerToggle = useCallback(async (value: boolean) => {
    setUseLocationForPrayerState(value);
    await setUseLocationForPrayer(value);
  }, []);

  const handleResetOnboarding = () => {
    Alert.alert(
      "Reset onboarding",
      "Show onboarding again on next launch?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem(ONBOARDING_DONE_KEY);
            router.replace("/");
          },
        },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      "Clear all data",
      "Delete all sleep entries, alarms, favorites, and preferences? You will see onboarding again. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear all",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelAllScheduledNotifications();
              await clearAllData();
              router.replace("/");
            } catch {
              Alert.alert("Error", "Could not clear data. Please try again.");
            }
          },
        },
      ]
    );
  };

  const version = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
      accessibilityLabel="Settings screen"
    >
      <View className="p-6 pt-4">
        <Text className="text-xl font-bold text-foreground dark:text-foreground-dark">
          Settings
        </Text>
        <Text className="mt-1 text-muted-foreground">
          Preferences and app info.
        </Text>

        <View className="mt-8">
          <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Notifications
          </Text>
          <View className="flex-row items-center justify-between rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark px-4 py-3">
            <Text className="text-foreground dark:text-foreground-dark">
              Alarm & reminder notifications
            </Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={onNotificationsToggle}
              trackColor={{ false: "#d1d5db", true: primaryColor }}
              thumbColor="#fff"
              accessibilityLabel="Alarm and reminder notifications"
            />
          </View>
        </View>

        <View className="mt-6">
          <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("location")}
          </Text>
          <View className="flex-row items-center justify-between rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark px-4 py-3">
            <Text className="flex-1 text-foreground dark:text-foreground-dark">
              {t("use_location_prayer")}
            </Text>
            <Switch
              value={useLocationForPrayer}
              onValueChange={onUseLocationForPrayerToggle}
              trackColor={{ false: "#d1d5db", true: primaryColor }}
              thumbColor="#fff"
              accessibilityLabel={t("use_location_prayer")}
            />
          </View>
        </View>

        <View className="mt-6">
          <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("language")}
          </Text>
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => setLocale("en")}
              className={`min-h-[44px] flex-1 items-center justify-center rounded-lg border py-3 ${
                locale === "en" ? "border-primary bg-primary" : "border-border dark:border-border-dark bg-card dark:bg-card-dark"
              }`}
              accessibilityLabel="English"
            >
              <Text className={locale === "en" ? "font-semibold text-primaryForeground" : "text-foreground dark:text-foreground-dark"}>
                English
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setLocale("ar")}
              className={`min-h-[44px] flex-1 items-center justify-center rounded-lg border py-3 ${
                locale === "ar" ? "border-primary bg-primary" : "border-border dark:border-border-dark bg-card dark:bg-card-dark"
              }`}
              accessibilityLabel="Arabic"
            >
              <Text className={locale === "ar" ? "font-semibold text-primaryForeground" : "text-foreground dark:text-foreground-dark"}>
                العربية
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="mt-6">
          <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Sleep
          </Text>
          <View className="rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark px-4 py-3">
            <Text className="text-foreground dark:text-foreground-dark">
              Daily sleep goal (hours)
            </Text>
            <TextInput
              className="mt-2 rounded border border-border dark:border-border-dark bg-background dark:bg-background-dark px-3 py-2 text-foreground dark:text-foreground-dark"
              value={sleepGoal}
              onChangeText={setSleepGoal}
              onBlur={onSleepGoalBlur}
              keyboardType="decimal-pad"
              placeholder="8"
            />
          </View>
        </View>

        <View className="mt-6">
          <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Data
          </Text>
          <Pressable
            onPress={handleExportData}
            className="min-h-[44px] rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark px-4 py-3 active:opacity-80"
            accessibilityLabel="Export data"
          >
            <Text className="text-foreground dark:text-foreground-dark">
              Export data
            </Text>
            <Text className="mt-1 text-sm text-muted-foreground">
              Share sleep & alarms as JSON
            </Text>
          </Pressable>
          <Pressable
            onPress={handleResetOnboarding}
            className="mt-3 min-h-[44px] rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark px-4 py-3 active:opacity-80"
            accessibilityLabel="Reset onboarding"
            accessibilityHint="Show welcome screens again on next launch"
          >
            <Text className="text-foreground dark:text-foreground-dark">
              Reset onboarding
            </Text>
            <Text className="mt-1 text-sm text-muted-foreground">
              Show welcome screens again
            </Text>
          </Pressable>
          <Pressable
            onPress={handleClearAllData}
            className="mt-3 min-h-[44px] rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 active:opacity-80"
            accessibilityLabel="Clear all data"
            accessibilityHint="Permanently delete all app data and show onboarding"
          >
            <Text className="font-medium text-destructive">
              Clear all data
            </Text>
            <Text className="mt-1 text-sm text-muted-foreground">
              Delete everything and start over
            </Text>
          </Pressable>
        </View>

        <View className="mt-8 border-t border-border dark:border-border-dark pt-6">
          <Text className="text-sm text-muted-foreground">
            Sunnah Sleep v{version}
          </Text>
          <Pressable
            onPress={() => Linking.openURL("https://example.com")}
            className="mt-2 active:opacity-80"
            accessibilityLabel="Privacy policy"
          >
            <Text className="text-primary dark:text-primary-dark">
              Privacy policy
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
