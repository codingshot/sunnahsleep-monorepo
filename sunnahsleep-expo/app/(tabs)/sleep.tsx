import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useLocale } from "@/lib/i18n";
import {
  averageHours,
  durationHours,
  filterEntriesByDays,
  formatDuration,
} from "@/lib/sleepStats";
import { getSleepEntries, setSleepEntries, type SleepEntry } from "@/lib/storage";
import { isValidTimeFormat } from "@/lib/validation";

type DateFilter = 7 | 30 | 0;

export default function SleepScreen() {
  const { t } = useLocale();
  const { placeholder } = useThemeColors();
  const [bedtime, setBedtime] = useState("");
  const [waketime, setWaketime] = useState("");
  const [entries, setEntries] = useState<SleepEntry[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilter>(30);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getSleepEntries().then(setEntries);
    }, [])
  );

  const filteredEntries = useMemo(
    () => filterEntriesByDays(entries, dateFilter),
    [entries, dateFilter]
  );
  const filteredIndices = useMemo(() => {
    if (dateFilter === 0) return entries.map((_, i) => i);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - dateFilter);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    return entries
      .map((_, i) => i)
      .filter((i) => !entries[i].date || entries[i].date! >= cutoffStr);
  }, [entries, dateFilter]);

  const avgHours = averageHours(filteredEntries);
  const totalNights = filteredEntries.length;

  const handleSave = async () => {
    if (!bedtime.trim() || !waketime.trim()) {
      Alert.alert(t("missing_fields"), t("missing_fields"));
      return;
    }
    if (!isValidTimeFormat(bedtime.trim()) || !isValidTimeFormat(waketime.trim())) {
      Alert.alert(t("invalid_time"), t("invalid_time"));
      return;
    }
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const newEntry: SleepEntry = {
      bedtime: bedtime.trim(),
      waketime: waketime.trim(),
      date: yesterday.toISOString().slice(0, 10),
    };
    const next = [newEntry, ...entries];
    setEntries(next);
    try {
      await setSleepEntries(next);
      setBedtime("");
      setWaketime("");
    } catch {
      setEntries(entries);
      Alert.alert(t("error"), t("error_save"));
    }
  };

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editBedtime, setEditBedtime] = useState("");
  const [editWaketime, setEditWaketime] = useState("");

  const handleEdit = (i: number) => {
    setEditingIndex(i);
    setEditBedtime(entries[i].bedtime);
    setEditWaketime(entries[i].waketime);
  };

  const handleSaveEdit = async () => {
    if (editingIndex === null || !editBedtime.trim() || !editWaketime.trim()) {
      setEditingIndex(null);
      return;
    }
    if (!isValidTimeFormat(editBedtime.trim()) || !isValidTimeFormat(editWaketime.trim())) {
      Alert.alert(t("invalid_time"), t("invalid_time"));
      return;
    }
    const next = [...entries];
    const existing = next[editingIndex];
    next[editingIndex] = {
      ...existing,
      bedtime: editBedtime.trim(),
      waketime: editWaketime.trim(),
    };
    setEntries(next);
    try {
      await setSleepEntries(next);
      setEditingIndex(null);
    } catch {
      setEntries(entries);
      Alert.alert(t("error"), t("error_save"));
    }
  };

  const handleDelete = (filteredIdx: number) => {
    const realIdx = filteredIndices[filteredIdx];
    Alert.alert(t("delete"), t("delete_confirm_sleep"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          const next = entries.filter((_, idx) => idx !== realIdx);
          setEntries(next);
          try {
            await setSleepEntries(next);
          } catch {
            setEntries(entries);
            Alert.alert(t("error"), t("error_delete"));
          }
        },
      },
    ]);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const list = await getSleepEntries();
      setEntries(list);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background dark:bg-background-dark"
    >
      <ScrollView
        className="flex-1 bg-background dark:bg-background-dark"
        accessibilityLabel="Sleep log screen"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyboardShouldPersistTaps="handled"
      >
      <View className="p-6 pt-4">
        <Text className="text-xl font-bold text-foreground dark:text-foreground-dark">
          {t("log_sleep")}
        </Text>
        <Text className="mt-1 text-muted-foreground">
          {t("log_sleep_subtitle")}
        </Text>

        <View className="mt-6 gap-4">
          <View>
            <Text className="mb-2 font-medium text-foreground dark:text-foreground-dark">
              {t("bedtime")}
            </Text>
            <TextInput
              className="rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark px-4 py-3 text-foreground dark:text-foreground-dark"
              placeholder="e.g. 22:30"
              placeholderTextColor={placeholder}
              value={bedtime}
              onChangeText={setBedtime}
              accessibilityLabel={t("bedtime")}
            />
          </View>
          <View>
            <Text className="mb-2 font-medium text-foreground dark:text-foreground-dark">
              {t("waketime")}
            </Text>
            <TextInput
              className="rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark px-4 py-3 text-foreground dark:text-foreground-dark"
              placeholder="e.g. 06:00"
              placeholderTextColor={placeholder}
              value={waketime}
              onChangeText={setWaketime}
              accessibilityLabel={t("waketime")}
            />
          </View>
          <Pressable
            onPress={handleSave}
            className="mt-2 min-h-[44px] rounded-lg bg-primary py-3 active:opacity-90"
            accessibilityLabel={t("save")}
          >
            <Text className="text-center font-semibold text-primaryForeground">{t("save")}</Text>
          </Pressable>
        </View>

        {entries.length === 0 && (
          <Text className="mt-6 text-center text-muted-foreground">
            {t("no_entries_yet")}
          </Text>
        )}

        {entries.length > 0 && (
          <>
            <View className="mt-8 rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark p-4">
              <Text className="font-semibold text-foreground dark:text-foreground-dark">
                {t("stats")}
              </Text>
              <View className="mt-2 flex-row flex-wrap gap-4">
                <Text className="text-muted-foreground">
                  Avg: {formatDuration(avgHours)} · {totalNights} night{totalNights !== 1 ? "s" : ""}
                </Text>
              </View>
            </View>

            <View className="mt-4 flex-row gap-2">
              {([7, 30, 0] as const).map((d) => (
                <Pressable
                  key={d}
                  onPress={() => setDateFilter(d)}
                  className={`min-h-[44px] min-w-[44px] rounded-lg px-4 py-2 ${
                    dateFilter === d
                      ? "bg-primary"
                      : "border border-border dark:border-border-dark bg-card dark:bg-card-dark"
                  }`}
                  accessibilityLabel={d === 0 ? "Show all entries" : `Last ${d} days`}
                >
                  <Text
                    className={
                      dateFilter === d
                        ? "font-medium text-primaryForeground"
                        : "text-foreground dark:text-foreground-dark"
                    }
                  >
                    {d === 0 ? "All" : `${d}d`}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {filteredEntries.length > 0 && (
          <View className="mt-6">
            <Text className="text-lg font-semibold text-foreground dark:text-foreground-dark">
              {t("recent_entries")}
            </Text>
            {filteredEntries.map((e, filteredIdx) => {
              const i = filteredIndices[filteredIdx];
              const hours = durationHours(e.bedtime, e.waketime);
              return (
              <View
                key={i}
                className="mt-3 rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark p-3"
              >
                {editingIndex === i ? (
                  <View className="gap-2">
                    <TextInput
                      className="rounded border border-border dark:border-border-dark bg-background dark:bg-background-dark px-3 py-2 text-foreground dark:text-foreground-dark"
                      value={editBedtime}
                      onChangeText={setEditBedtime}
                      placeholder={t("bedtime")}
                      placeholderTextColor={placeholder}
                    />
                    <TextInput
                      className="rounded border border-border dark:border-border-dark bg-background dark:bg-background-dark px-3 py-2 text-foreground dark:text-foreground-dark"
                      value={editWaketime}
                      onChangeText={setEditWaketime}
                      placeholder={t("waketime")}
                      placeholderTextColor={placeholder}
                    />
                    <View className="mt-2 flex-row gap-2">
                      <Pressable
                        onPress={handleSaveEdit}
                        className="min-h-[44px] flex-1 items-center justify-center rounded bg-primary py-2"
                      >
                        <Text className="text-center font-medium text-primaryForeground">{t("save")}</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => setEditingIndex(null)}
                        className="min-h-[44px] flex-1 items-center justify-center rounded border border-border dark:border-border-dark py-2"
                      >
                        <Text className="text-center text-foreground dark:text-foreground-dark">{t("cancel")}</Text>
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="text-foreground dark:text-foreground-dark">
                        {e.bedtime} → {e.waketime}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        {formatDuration(hours)}
                        {e.date ? ` · ${e.date}` : ""}
                      </Text>
                    </View>
                    <View className="flex-row gap-2">
                      <Pressable
                        onPress={() => handleEdit(i)}
                        className="min-h-[44px] min-w-[44px] items-center justify-center rounded px-3 py-1.5 active:opacity-80"
                        accessibilityLabel={t("edit")}
                      >
                        <Text className="text-primary dark:text-primary-dark">{t("edit")}</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleDelete(filteredIdx)}
                        className="min-h-[44px] min-w-[44px] items-center justify-center rounded px-3 py-1.5 active:opacity-80"
                        accessibilityLabel={t("delete")}
                      >
                        <Text className="text-destructive">{t("delete")}</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            );
            })}
          </View>
        )}
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}
