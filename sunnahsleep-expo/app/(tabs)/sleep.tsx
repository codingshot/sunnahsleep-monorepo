import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  averageHours,
  durationHours,
  filterEntriesByDays,
  formatDuration,
} from "@/lib/sleepStats";
import { getSleepEntries, setSleepEntries, type SleepEntry } from "@/lib/storage";

type DateFilter = 7 | 30 | 0;

export default function SleepScreen() {
  const [bedtime, setBedtime] = useState("");
  const [waketime, setWaketime] = useState("");
  const [entries, setEntries] = useState<SleepEntry[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilter>(30);

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
      Alert.alert("Missing fields", "Enter both bedtime and wake time.");
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
      Alert.alert("Error", "Could not save. Please try again.");
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
      Alert.alert("Error", "Could not save. Please try again.");
    }
  };

  const handleDelete = (filteredIdx: number) => {
    const realIdx = filteredIndices[filteredIdx];
    Alert.alert("Delete entry", "Remove this sleep entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const next = entries.filter((_, idx) => idx !== realIdx);
          setEntries(next);
          try {
            await setSleepEntries(next);
          } catch {
            setEntries(entries);
            Alert.alert("Error", "Could not delete. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
      accessibilityLabel="Sleep log screen"
    >
      <View className="p-6 pt-4">
        <Text className="text-xl font-bold text-foreground dark:text-foreground-dark">
          Log sleep
        </Text>
        <Text className="mt-1 text-muted-foreground">
          Record when you went to bed and woke up.
        </Text>

        <View className="mt-6 gap-4">
          <View>
            <Text className="mb-2 font-medium text-foreground dark:text-foreground-dark">
              Bedtime
            </Text>
            <TextInput
              className="rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark px-4 py-3 text-foreground dark:text-foreground-dark"
              placeholder="e.g. 22:30"
              placeholderTextColor="#a8a29e"
              value={bedtime}
              onChangeText={setBedtime}
              accessibilityLabel="Bedtime"
            />
          </View>
          <View>
            <Text className="mb-2 font-medium text-foreground dark:text-foreground-dark">
              Wake time
            </Text>
            <TextInput
              className="rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark px-4 py-3 text-foreground dark:text-foreground-dark"
              placeholder="e.g. 06:00"
              placeholderTextColor="#a8a29e"
              value={waketime}
              onChangeText={setWaketime}
              accessibilityLabel="Wake time"
            />
          </View>
          <Pressable
            onPress={handleSave}
            className="mt-2 min-h-[44px] rounded-lg bg-primary py-3 active:opacity-90"
            accessibilityLabel="Save sleep entry"
          >
            <Text className="text-center font-semibold text-primaryForeground">Save</Text>
          </Pressable>
        </View>

        {entries.length > 0 && (
          <>
            <View className="mt-8 rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark p-4">
              <Text className="font-semibold text-foreground dark:text-foreground-dark">
                Stats
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
              Recent entries
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
                      placeholder="Bedtime"
                    />
                    <TextInput
                      className="rounded border border-border dark:border-border-dark bg-background dark:bg-background-dark px-3 py-2 text-foreground dark:text-foreground-dark"
                      value={editWaketime}
                      onChangeText={setEditWaketime}
                      placeholder="Wake time"
                    />
                    <View className="flex-row gap-2 mt-2">
                      <Pressable
                        onPress={handleSaveEdit}
                        className="flex-1 rounded bg-primary py-2"
                      >
                        <Text className="text-center text-primaryForeground font-medium">Save</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => setEditingIndex(null)}
                        className="flex-1 rounded border border-border dark:border-border-dark py-2"
                      >
                        <Text className="text-center text-foreground dark:text-foreground-dark">Cancel</Text>
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
                        accessibilityLabel="Edit entry"
                      >
                        <Text className="text-primary dark:text-primary-dark">Edit</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleDelete(filteredIdx)}
                        className="min-h-[44px] min-w-[44px] items-center justify-center rounded px-3 py-1.5 active:opacity-80"
                        accessibilityLabel="Delete entry"
                      >
                        <Text className="text-destructive">Delete</Text>
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
  );
}
