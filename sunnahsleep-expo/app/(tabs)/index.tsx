import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { ErrorView } from "@/components/ErrorView";
import { useLocale } from "@/lib/i18n";
import { durationHours, formatDuration } from "@/lib/sleepStats";
import { getSleepEntries, getSleepGoalHours } from "@/lib/storage";

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useLocale();
  const [lastSleep, setLastSleep] = useState<{ bedtime: string; waketime: string } | null>(null);
  const [goalHours, setGoalHours] = useState(8);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t("greeting_morning") : hour < 17 ? t("greeting_afternoon") : t("greeting_evening");

  const load = useCallback(() => {
    setLoadError(null);
    getSleepEntries()
      .then((entries) => {
        setLastSleep(entries.length > 0 ? entries[0] : null);
      })
      .catch(() => setLoadError(t("error_load_sleep")));
    getSleepGoalHours().then(setGoalHours).catch(() => {});
  }, [t]);

  useFocusEffect(load);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setLoadError(null);
    try {
      const [entries, goal] = await Promise.all([getSleepEntries(), getSleepGoalHours()]);
      setLastSleep(entries.length > 0 ? entries[0] : null);
      setGoalHours(goal);
    } catch {
      setLoadError(t("error_load_sleep"));
    } finally {
      setRefreshing(false);
    }
  }, [t]);

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
      accessibilityLabel="Home screen"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="p-6 pt-4">
        <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark">
          {greeting}
        </Text>
        <Text className="mt-1 text-muted-foreground">
          {t("subtitle_blessed")}
        </Text>

        <View className="mt-8 gap-4">
          <Pressable
            onPress={() => router.push("/(tabs)/sleep")}
            className="min-h-[44px] rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark p-4 active:opacity-80"
            accessibilityLabel={t("log_sleep")}
            accessibilityHint="Opens screen to record last night's sleep"
          >
            <Text className="text-lg font-semibold text-foreground dark:text-foreground-dark">
              {t("log_sleep")}
            </Text>
            <Text className="mt-1 text-muted-foreground">
              {t("record_last_night")}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(tabs)/alarms")}
            className="min-h-[44px] rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark p-4 active:opacity-80"
            accessibilityLabel={t("alarms")}
            accessibilityHint={t("alarms_short")}
          >
            <Text className="text-lg font-semibold text-foreground dark:text-foreground-dark">
              {t("alarms")}
            </Text>
            <Text className="mt-1 text-muted-foreground">
              {t("alarms_short")}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(tabs)/duas")}
            className="min-h-[44px] rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark p-4 active:opacity-80"
            accessibilityLabel={t("duas")}
            accessibilityHint={t("duas_short")}
          >
            <Text className="text-lg font-semibold text-foreground dark:text-foreground-dark">
              {t("duas")}
            </Text>
            <Text className="mt-1 text-muted-foreground">
              {t("duas_short")}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => (router.push as (href: string) => void)("/(tabs)/prayer")}
            className="min-h-[44px] rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark p-4 active:opacity-80"
            accessibilityLabel={t("prayer_times")}
            accessibilityHint="Prayer times and Qibla"
          >
            <Text className="text-lg font-semibold text-foreground dark:text-foreground-dark">
              {t("prayer_times")}
            </Text>
            <Text className="mt-1 text-muted-foreground">
              {t("prayer_subtitle")}
            </Text>
          </Pressable>
        </View>

        {loadError && (
          <View className="mt-6">
            <ErrorView message={loadError} onRetry={load} retryLabel={t("try_again")} />
          </View>
        )}

        <View
          className="mt-8 rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark p-4"
          accessibilityLabel="Last night sleep summary"
        >
          <Text className="font-semibold text-foreground dark:text-foreground-dark">
            {t("last_night")}
          </Text>
          <Text className="mt-2 text-muted-foreground">
            {lastSleep
              ? `${lastSleep.bedtime} → ${lastSleep.waketime} (${formatDuration(durationHours(lastSleep.bedtime, lastSleep.waketime))} / ${goalHours}h goal)`
              : t("no_sleep_yet")}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
