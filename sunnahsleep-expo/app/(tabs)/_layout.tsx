import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Notifications from "expo-notifications";
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { theme } from "@/constants/theme";
import { scheduleSnoozeNotification } from "@/lib/notifications";

type IconName = React.ComponentProps<typeof FontAwesome>["name"];

function TabBarIcon(props: { name: IconName; color: string }) {
  return <FontAwesome size={24} style={{ marginBottom: -2 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tint = colorScheme === "dark" ? theme.dark.primary : theme.light.primary;
  const router = useRouter();

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
      screenOptions={{
        tabBarActiveTintColor: tint,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="sleep"
        options={{
          title: "Sleep",
          tabBarIcon: ({ color }) => <TabBarIcon name="moon-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="alarms"
        options={{
          title: "Alarms",
          tabBarIcon: ({ color }) => <TabBarIcon name="bell" color={color} />,
        }}
      />
      <Tabs.Screen
        name="duas"
        options={{
          title: "Duas",
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          title: "Prayer",
          tabBarIcon: ({ color }) => <TabBarIcon name="compass" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
