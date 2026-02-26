import { useFocusEffect } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  fetchPrayerTimesByAddress,
  fetchPrayerTimesByCoords,
  formatTimeFromApi,
  PRAYER_ORDER,
  type PrayerTimings,
} from "@/lib/prayerTimes";
import { qiblaAngleFromCoords, qiblaDescription } from "@/lib/qibla";
import { getCoordsForPrayer, requestLocationAndGetCoords } from "@/lib/location";
import {
  getPrayerTimesCache,
  getUseLocationForPrayer,
  setLocationCoords,
  setPrayerTimesCache,
  type LocationCoords,
} from "@/lib/storage";
import { useLocale } from "@/lib/i18n";

export default function PrayerScreen() {
  const { t } = useLocale();
  const [timings, setTimings] = useState<PrayerTimings | null>(null);
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setLocationStatus(null);
    try {
      const useLocation = await getUseLocationForPrayer();
      let coords: LocationCoords = null;
      if (useLocation) {
        coords = await getCoordsForPrayer();
        if (!coords) {
          setLocationStatus(t("need_location"));
        }
      }
      let data: PrayerTimings | null = null;
      if (coords) {
        data = await fetchPrayerTimesByCoords(coords.latitude, coords.longitude);
        setQiblaAngle(qiblaAngleFromCoords(coords.latitude, coords.longitude));
      } else {
        const cached = await getPrayerTimesCache();
        const today = new Date().toISOString().slice(0, 10);
        if (cached?.date === today && cached.timings) {
          data = cached.timings as unknown as PrayerTimings;
        }
        if (!data) {
          data = await fetchPrayerTimesByAddress("London, UK");
          if (data) await setPrayerTimesCache({ date: today, timings: data });
        }
      }
      setTimings(data);
      if (!data) setError(t("error_load"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useFocusEffect(useCallback(() => {
    load();
  }, [load]));

  const handleRefreshLocation = async () => {
    setLoading(true);
    setError(null);
    const result = await requestLocationAndGetCoords();
    if (result.error) {
      setLocationStatus(result.error);
      setLoading(false);
      return;
    }
    if (result.coords) {
      await setLocationCoords(result.coords);
      const data = await fetchPrayerTimesByCoords(result.coords.latitude, result.coords.longitude);
      setTimings(data);
      setQiblaAngle(qiblaAngleFromCoords(result.coords.latitude, result.coords.longitude));
      if (data) await setPrayerTimesCache({ date: new Date().toISOString().slice(0, 10), timings: data });
    }
    setLocationStatus(null);
    setLoading(false);
  };

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
      accessibilityLabel={t("prayer_times")}
    >
      <View className="p-6 pt-4">
        <Text className="text-xl font-bold text-foreground dark:text-foreground-dark">
          {t("prayer_times")}
        </Text>
        <Text className="mt-1 text-muted-foreground">
          Today's prayer times · Qibla direction
        </Text>

        {locationStatus && (
          <Pressable
            onPress={handleRefreshLocation}
            className="mt-4 min-h-[44px] flex-row items-center justify-center gap-2 rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark px-4 py-3 active:opacity-80"
            accessibilityLabel="Use device location"
          >
            <FontAwesome name="location-arrow" size={18} color="#0f766e" />
            <Text className="text-foreground dark:text-foreground-dark">{locationStatus}</Text>
            <Text className="text-primary dark:text-primary-dark">Tap to enable</Text>
          </Pressable>
        )}

        {loading && (
          <View className="mt-6 items-center py-8">
            <ActivityIndicator size="large" color="#0f766e" />
            <Text className="mt-2 text-muted-foreground">{t("loading")}</Text>
          </View>
        )}

        {!loading && error && (
          <View className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <Text className="text-foreground dark:text-foreground-dark">{error}</Text>
            <Pressable onPress={load} className="mt-3 min-h-[44px] items-center justify-center rounded bg-primary py-2">
              <Text className="font-medium text-primaryForeground">Retry</Text>
            </Pressable>
          </View>
        )}

        {!loading && timings && (
          <View className="mt-6 rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark p-4">
            {PRAYER_ORDER.map((key) => (
              <View key={key} className="flex-row justify-between py-2 border-b border-border dark:border-border-dark last:border-b-0">
                <Text className="text-foreground dark:text-foreground-dark">{t(key.toLowerCase())}</Text>
                <Text className="text-muted-foreground">{formatTimeFromApi(timings[key])}</Text>
              </View>
            ))}
          </View>
        )}

        {!loading && qiblaAngle !== null && (
          <View className="mt-6 rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark p-4">
            <Text className="font-semibold text-foreground dark:text-foreground-dark">{t("qibla")}</Text>
            <Text className="mt-2 text-2xl text-primary dark:text-primary-dark">
              {qiblaAngle}° {t("degrees")}
            </Text>
            <Text className="mt-1 text-muted-foreground">{qiblaDescription(qiblaAngle)}</Text>
            <Text className="mt-2 text-sm text-muted-foreground">
              Face this direction from North (clockwise) for Salah.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
