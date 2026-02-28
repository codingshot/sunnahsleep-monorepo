import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { theme } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useLocale } from "@/lib/i18n";
import {
  cancelAlarmNotification,
  scheduleAlarmNotification,
} from "@/lib/notifications";
import { getAlarms, setAlarms, type Alarm } from "@/lib/storage";
import { isValidTimeFormat } from "@/lib/validation";

export default function AlarmsScreen() {
  const colorScheme = useColorScheme();
  const { t } = useLocale();
  const { placeholder } = useThemeColors();
  const primaryColor = colorScheme === "dark" ? theme.dark.primary : theme.light.primary;
  const [alarms, setAlarmsState] = useState<Alarm[]>([]);
  const [newTime, setNewTime] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTime, setEditTime] = useState("");
  const [editLabel, setEditLabel] = useState("");

  useFocusEffect(
    useCallback(() => {
      getAlarms().then(setAlarmsState);
    }, [])
  );

  const addAlarm = async () => {
    const time = newTime.trim();
    if (!time) return;
    if (!isValidTimeFormat(time)) {
      Alert.alert(t("invalid_time"), t("invalid_time"));
      return;
    }
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time,
      label: newLabel.trim() || "Alarm",
      enabled: true,
    };
    const next = [newAlarm, ...alarms];
    setAlarmsState(next);
    try {
      await setAlarms(next);
      await scheduleAlarmNotification(newAlarm);
      setNewTime("");
      setNewLabel("");
    } catch {
      setAlarmsState(alarms);
      Alert.alert(t("error"), t("error_add"));
    }
  };

  const toggleAlarm = async (id: string) => {
    const next = alarms.map((al) =>
      al.id === id ? { ...al, enabled: !al.enabled } : al
    );
    const prev = alarms;
    setAlarmsState(next);
    try {
      await setAlarms(next);
      const updated = next.find((al) => al.id === id)!;
      if (updated.enabled) await scheduleAlarmNotification(updated);
      else await cancelAlarmNotification(id);
    } catch {
      setAlarmsState(prev);
      Alert.alert(t("error"), t("error_update"));
    }
  };

  const removeAlarm = async (id: string) => {
    const next = alarms.filter((al) => al.id !== id);
    setAlarmsState(next);
    try {
      await cancelAlarmNotification(id);
      await setAlarms(next);
    } catch {
      setAlarmsState(alarms);
      Alert.alert(t("error"), t("error_remove"));
    }
  };

  const startEdit = (al: Alarm) => {
    setEditingId(al.id);
    setEditTime(al.time);
    setEditLabel(al.label);
  };

  const saveEdit = async () => {
    const time = editTime.trim();
    if (!editingId || !time) {
      setEditingId(null);
      return;
    }
    if (!isValidTimeFormat(time)) {
      Alert.alert(t("invalid_time"), t("invalid_time"));
      return;
    }
    const next = alarms.map((al) =>
      al.id === editingId
        ? { ...al, time, label: editLabel.trim() || "Alarm" }
        : al
    );
    const prev = alarms;
    setAlarmsState(next);
    setEditingId(null);
    try {
      await setAlarms(next);
      const updated = next.find((al) => al.id === editingId)!;
      await cancelAlarmNotification(editingId);
      if (updated.enabled) await scheduleAlarmNotification(updated);
    } catch {
      setAlarmsState(prev);
      setEditingId(editingId);
      Alert.alert(t("error"), t("error_save"));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background dark:bg-background-dark"
    >
      <ScrollView
        className="flex-1 bg-background dark:bg-background-dark"
        accessibilityLabel="Alarms screen"
        keyboardShouldPersistTaps="handled"
      >
      <View className="p-6 pt-4">
        <Text className="text-xl font-bold text-foreground dark:text-foreground-dark">
          {t("alarms")}
        </Text>
        <Text className="mt-1 text-muted-foreground">
          {t("alarms_subtitle")}
        </Text>

        <View className="mt-6 gap-4">
          <View>
            <Text className="mb-2 font-medium text-foreground dark:text-foreground-dark">
              {t("time")}
            </Text>
            <TextInput
              className="rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark px-4 py-3 text-foreground dark:text-foreground-dark"
              placeholder="e.g. 05:30"
              placeholderTextColor={placeholder}
              value={newTime}
              onChangeText={setNewTime}
              accessibilityLabel={t("time")}
            />
          </View>
          <View>
            <Text className="mb-2 font-medium text-foreground dark:text-foreground-dark">
              {t("label_optional")}
            </Text>
            <TextInput
              className="rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark px-4 py-3 text-foreground dark:text-foreground-dark"
              placeholder="e.g. Fajr"
              placeholderTextColor={placeholder}
              value={newLabel}
              onChangeText={setNewLabel}
              accessibilityLabel={t("label_optional")}
            />
          </View>
          <Pressable
            onPress={addAlarm}
            className="min-h-[44px] rounded-lg bg-primary py-3 active:opacity-90"
            accessibilityLabel={t("add_alarm")}
          >
            <Text className="text-center font-semibold text-primaryForeground">
              {t("add_alarm")}
            </Text>
          </Pressable>
        </View>

        {alarms.length > 0 && (
          <View className="mt-8">
            <Text className="text-lg font-semibold text-foreground dark:text-foreground-dark">
              {t("your_alarms")}
            </Text>
            {alarms.map((al) => (
              <View
                key={al.id}
                className="mt-3 rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark p-4"
              >
                {editingId === al.id ? (
                  <View className="gap-3">
                    <TextInput
                      className="rounded-lg border border-border dark:border-border-dark bg-background dark:bg-background-dark px-3 py-2 text-foreground dark:text-foreground-dark"
                      value={editTime}
                      onChangeText={setEditTime}
                      placeholder={t("time")}
                      placeholderTextColor={placeholder}
                    />
                    <TextInput
                      className="rounded-lg border border-border dark:border-border-dark bg-background dark:bg-background-dark px-3 py-2 text-foreground dark:text-foreground-dark"
                      value={editLabel}
                      onChangeText={setEditLabel}
                      placeholder={t("label_optional")}
                      placeholderTextColor={placeholder}
                    />
                    <View className="flex-row gap-2">
                      <Pressable
                        onPress={saveEdit}
                        className="min-h-[44px] flex-1 items-center justify-center rounded bg-primary py-2"
                      >
                        <Text className="font-medium text-primaryForeground">{t("save")}</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => setEditingId(null)}
                        className="min-h-[44px] flex-1 items-center justify-center rounded border border-border dark:border-border-dark py-2"
                      >
                        <Text className="text-foreground dark:text-foreground-dark">{t("cancel")}</Text>
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-lg font-medium text-foreground dark:text-foreground-dark">
                        {al.time}
                      </Text>
                      <Text className="text-muted-foreground">{al.label}</Text>
                    </View>
                    <View className="flex-row items-center gap-3">
                      <Switch
                        value={al.enabled}
                        onValueChange={() => toggleAlarm(al.id)}
                        trackColor={{ false: "#d1d5db", true: primaryColor }}
                        thumbColor="#fff"
                        accessibilityLabel={`Alarm ${al.label} ${al.enabled ? "on" : "off"}`}
                      />
                      <Pressable
                        onPress={() => startEdit(al)}
                        className="min-h-[44px] min-w-[44px] items-center justify-center rounded px-2 py-1 active:opacity-80"
                        accessibilityLabel={t("edit")}
                      >
                        <Text className="text-primary dark:text-primary-dark">{t("edit")}</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => removeAlarm(al.id)}
                        className="min-h-[44px] min-w-[44px] items-center justify-center rounded px-2 py-1 active:opacity-70"
                        accessibilityLabel={t("remove")}
                      >
                        <Text className="text-destructive">{t("remove")}</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {alarms.length === 0 && (
          <Text className="mt-6 text-center text-muted-foreground">
            {t("no_alarms_yet")}
          </Text>
        )}
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}
