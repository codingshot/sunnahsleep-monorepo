import { useFocusEffect } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useCallback, useState } from "react";
import { Pressable, RefreshControl, ScrollView, Text, TextInput, useColorScheme, View } from "react-native";
import { theme } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useLocale } from "@/lib/i18n";
import { getDuaFavorites, setDuaFavorites } from "@/lib/storage";

const DUAS = [
  { id: "before-sleeping", title: "Before sleeping", arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", transliteration: "Bismika Allahumma amutu wa ahya", meaning: "In Your name, O Allah, I die and I live." },
  { id: "ayat-al-kursi", title: "Ayat al-Kursi", arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", transliteration: "Allahu la ilaha illa Huwa, Al-Hayyul-Qayyum...", meaning: "Allah - there is no deity except Him, the Ever-Living, the Sustainer..." },
  { id: "last-two-baqarah", title: "Last two verses of Al-Baqarah", arabic: "آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ", transliteration: "Amnar-Rasoolu bimaa unzila ilayhi...", meaning: "The Messenger has believed in what was revealed to him from his Lord..." },
];

export default function DuasScreen() {
  const colorScheme = useColorScheme();
  const { t } = useLocale();
  const { placeholder } = useThemeColors();
  const destructiveColor = colorScheme === "dark" ? theme.dark.destructive : theme.light.destructive;
  const mutedColor = colorScheme === "dark" ? theme.dark.mutedForeground : theme.light.mutedForeground;
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getDuaFavorites().then(setFavorites);
    }, [])
  );

  const toggleFavorite = async (id: string) => {
    const next = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(next);
    try {
      await setDuaFavorites(next);
    } catch {
      setFavorites(favorites);
    }
  };

  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const filtered = DUAS.filter(
    (d) =>
      (showFavoritesOnly ? favorites.includes(d.id) : true) &&
      (!search.trim() ||
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.transliteration.toLowerCase().includes(search.toLowerCase()))
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const list = await getDuaFavorites();
      setFavorites(list);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
      accessibilityLabel="Bedtime Duas screen"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="p-6 pt-4">
        <Text className="text-xl font-bold text-foreground dark:text-foreground-dark">
          {t("duas_title")}
        </Text>
        <Text className="mt-1 text-muted-foreground">
          {t("duas_subtitle")}
        </Text>

        <TextInput
          className="mt-4 rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark px-4 py-3 text-foreground dark:text-foreground-dark"
          placeholder={t("search_duas")}
          placeholderTextColor={placeholder}
          value={search}
          onChangeText={setSearch}
          accessibilityLabel="Search duas"
        />

        {favorites.length > 0 && (
          <View className="mt-4 flex-row gap-2">
            <Pressable
              onPress={() => setShowFavoritesOnly(false)}
              className={`min-h-[44px] min-w-[44px] items-center justify-center rounded-lg px-4 py-2 ${
                !showFavoritesOnly ? "bg-primary" : "border border-border dark:border-border-dark bg-card dark:bg-card-dark"
              }`}
              accessibilityLabel={t("all")}
            >
              <Text className={!showFavoritesOnly ? "font-medium text-primaryForeground" : "text-foreground dark:text-foreground-dark"}>
                {t("all")}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setShowFavoritesOnly(true)}
              className={`min-h-[44px] min-w-[44px] items-center justify-center rounded-lg px-4 py-2 ${
                showFavoritesOnly ? "bg-primary" : "border border-border dark:border-border-dark bg-card dark:bg-card-dark"
              }`}
              accessibilityLabel={t("favorites")}
            >
              <Text className={showFavoritesOnly ? "font-medium text-primaryForeground" : "text-foreground dark:text-foreground-dark"}>
                {t("favorites")} ({favorites.length})
              </Text>
            </Pressable>
          </View>
        )}

        <View className="mt-6 gap-4">
          {filtered.map((dua) => (
            <View
              key={dua.id}
              className="rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark p-4"
              accessibilityLabel={`Dua: ${dua.title}`}
            >
              <View className="flex-row items-center justify-between">
                <Text className="font-semibold text-primary dark:text-primary-dark">
                  {dua.title}
                </Text>
                <Pressable
                  onPress={() => toggleFavorite(dua.id)}
                  className="min-h-[44px] min-w-[44px] items-center justify-center active:opacity-80"
                  accessibilityLabel={favorites.includes(dua.id) ? "Remove from favorites" : "Add to favorites"}
                >
                  <FontAwesome
                    name={favorites.includes(dua.id) ? "heart" : "heart-o"}
                    size={22}
                    color={favorites.includes(dua.id) ? destructiveColor : mutedColor}
                  />
                </Pressable>
              </View>
              <Text className="mt-3 text-right text-xl text-foreground dark:text-foreground-dark">
                {dua.arabic}
              </Text>
              <Text className="mt-2 italic text-muted-foreground">
                {dua.transliteration}
              </Text>
              <Text className="mt-2 text-foreground dark:text-foreground-dark">
                {dua.meaning}
              </Text>
            </View>
          ))}
        </View>

        {filtered.length === 0 && (
          <Text className="mt-4 text-center text-muted-foreground">
            {t("no_matching_duas")}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
