import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import * as Notifications from "expo-notifications";
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "@/constants/theme";
import { StickyPlayerBar } from "@/components/StickyPlayerBar";
import { useLocale } from "@/lib/i18n";
import { scheduleSnoozeNotification } from "@/lib/notifications";

type IconName = React.ComponentProps<typeof FontAwesome>["name"];

function TabBarIcon(props: { name: IconName; color: string }) {
  return <FontAwesome size={24} style={{ marginBottom: -2 }} {...props} />;
}

function StickyBottomTabBar(props: React.ComponentProps<typeof BottomTabBar>) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const bg = colorScheme === "dark" ? theme.dark.card : theme.light.card;
  const border = colorScheme === "dark" ? theme.dark.border : theme.light.border;

  return (
    <View
      style={{
        backgroundColor: bg,
        borderTopWidth: 1,
        borderTopColor: border,
        paddingBottom: insets.bottom,
      }}
    >
      <StickyPlayerBar />
      <BottomTabBar {...props} />
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tint = colorScheme === "dark" ? theme.dark.primary : theme.light.primary;
  const router = useRouter();
  const { t } = useLocale();

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const actionId = response.actionIdentifier;
      const data = response.notification.request.content.data as { alarmId?: string; alarmLabel?: string } | undefined;
      if (actionId === "SNOOZE" && data?.alarmId && data?.alarmLabel) {
        scheduleSnoozeNotification(data.alarmId, data.alarmLabel);
      }
      if (actionId === Notifications.DEFAULT_ACTION_IDENTIFIER || actionId === "DISMISS" || actionId === "SNOOZE") {
        router.replace("/(tabs)/alarms");
      }
    });
    return () => sub.remove();
  }, [router]);

  return (
    <Tabs
      tabBar={(props) => <StickyBottomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: tint,
        headerShown: true,
        tabBarHideOnKeyboard: true,
        tabBarStyle: { position: "relative" },
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("home"),
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="sleep"
        options={{
          title: t("sleep"),
          tabBarIcon: ({ color }) => <TabBarIcon name="moon-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="alarms"
        options={{
          title: t("alarms"),
          tabBarIcon: ({ color }) => <TabBarIcon name="bell" color={color} />,
        }}
      />
      <Tabs.Screen
        name="duas"
        options={{
          title: t("duas"),
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          title: t("prayer"),
          tabBarIcon: ({ color }) => <TabBarIcon name="compass" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("settings"),
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
