import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";
import { theme } from "@/constants/theme";
import { STORAGE_KEYS } from "@/lib/storage";

const ONBOARDING_DONE_KEY = STORAGE_KEYS.ONBOARDING_DONE;

export default function IndexScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [checking, setChecking] = useState(true);
  const navigated = useRef(false);
  const primaryColor = colorScheme === "dark" ? theme.dark.primary : theme.light.primary;

  useEffect(() => {
    if (navigated.current) return;
    (async () => {
      try {
        const done = await AsyncStorage.getItem(ONBOARDING_DONE_KEY);
        if (navigated.current) return;
        navigated.current = true;
        if (done === "1") {
          router.replace("/(tabs)");
        } else {
          router.replace("/onboarding");
        }
      } catch {
        if (!navigated.current) {
          navigated.current = true;
          router.replace("/onboarding");
        }
      } finally {
        setChecking(false);
      }
    })();
  }, [router]);

  if (!checking) return null;
  return (
    <View
      className="flex-1 items-center justify-center bg-background dark:bg-background-dark"
      accessibilityLabel="Loading"
    >
      <ActivityIndicator size="large" color={primaryColor} />
    </View>
  );
}
