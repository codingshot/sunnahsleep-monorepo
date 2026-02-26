import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { useReduceMotionEnabled } from "@/lib/accessibility";
import { STORAGE_KEYS } from "@/lib/storage";

const ONBOARDING_DONE_KEY = STORAGE_KEYS.ONBOARDING_DONE;
const { width } = Dimensions.get("window");

const SLIDES = [
  {
    title: "Welcome to Sunnah Sleep",
    body: "Track your sleep, set gentle alarms, and follow the Sunnah of the Prophet (ﷺ) for restful nights.",
  },
  {
    title: "Sleep & Wake on Time",
    body: "Log your sleep, view history, and get reminders for bedtime and Fajr.",
  },
  {
    title: "Duas & Reminders",
    body: "Access bedtime and morning duas, and prayer time reminders in one place.",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const reduceMotion = useReduceMotionEnabled();
  const [index, setIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (index < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: index + 1, animated: !reduceMotion });
      setIndex(index + 1);
    } else {
      finishOnboarding();
    }
  };

  const handleSkip = () => {
    finishOnboarding();
  };

  const finishOnboarding = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        // User denied; continue anyway
      }
    } catch {
      // Ignore permission errors
    }
    await AsyncStorage.setItem(ONBOARDING_DONE_KEY, "1");
    router.replace("/(tabs)");
  };

  return (
    <View
      className="flex-1 bg-background dark:bg-background-dark"
      accessibilityLabel="Onboarding"
    >
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(i);
        }}
        decelerationRate={reduceMotion ? "fast" : "normal"}
        renderItem={({ item }) => (
          <View style={{ width }} className="flex-1 px-8 pt-24">
            <Text className="text-3xl font-bold text-foreground dark:text-foreground-dark">
              {item.title}
            </Text>
            <Text className="mt-4 text-lg text-muted-foreground">
              {item.body}
            </Text>
          </View>
        )}
      />
      <View className="flex-row items-center justify-between px-8 pb-12">
        <View className="flex-row gap-2" accessibilityLabel={`Slide ${index + 1} of ${SLIDES.length}`}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              className={`h-2 w-2 rounded-full ${
                i === index ? "bg-primary w-6" : "bg-muted-foreground opacity-50"
              }`}
            />
          ))}
        </View>
        <View className="flex-row gap-4">
          <Pressable
            onPress={handleSkip}
            className="rounded-lg px-4 py-3 active:opacity-70"
            accessibilityLabel="Skip onboarding"
          >
            <Text className="text-base text-muted-foreground">Skip</Text>
          </Pressable>
          <Pressable
            onPress={handleNext}
            className="rounded-lg bg-primary px-6 py-3 active:opacity-90"
            accessibilityLabel={index === SLIDES.length - 1 ? "Get started" : "Next"}
          >
            <Text className="text-base font-semibold text-primaryForeground">
              {index === SLIDES.length - 1 ? "Get Started" : "Next"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
