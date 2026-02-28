import { useColorScheme } from "react-native";
import { theme } from "@/constants/theme";
import { usePlayer } from "@/context/PlayerContext";
import { Pressable, Text, View } from "react-native";

const PLAYER_BAR_HEIGHT = 56;

/** Sticky bar shown above the tab bar when "player" is active. Use usePlayer().show() / hide() to toggle. */
export function StickyPlayerBar() {
  const { visible, title, hide } = usePlayer();
  const colorScheme = useColorScheme();
  const primary = colorScheme === "dark" ? theme.dark.primary : theme.light.primary;
  const bg = colorScheme === "dark" ? theme.dark.card : theme.light.card;
  const border = colorScheme === "dark" ? theme.dark.border : theme.light.border;
  const text = colorScheme === "dark" ? theme.dark.foreground : theme.light.foreground;
  const muted = colorScheme === "dark" ? theme.dark.mutedForeground : theme.light.mutedForeground;

  if (!visible) return null;

  return (
    <View
      style={{
        height: PLAYER_BAR_HEIGHT,
        backgroundColor: bg,
        borderTopWidth: 1,
        borderTopColor: border,
      }}
      className="flex-row items-center justify-between px-4"
    >
      <View className="flex-1 flex-row items-center gap-3">
        <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: primary + "20" }} />
        <View>
          <Text style={{ color: text, fontSize: 14, fontWeight: "600" }} numberOfLines={1}>
            {title ?? "Now playing"}
          </Text>
          <Text style={{ color: muted, fontSize: 12 }} numberOfLines={1}>
            Tap to expand
          </Text>
        </View>
      </View>
      <Pressable
        onPress={hide}
        style={{ paddingVertical: 8, paddingHorizontal: 12 }}
        accessibilityLabel="Close player"
      >
        <Text style={{ color: primary, fontSize: 14, fontWeight: "500" }}>Close</Text>
      </Pressable>
    </View>
  );
}

export const STICKY_PLAYER_BAR_HEIGHT = PLAYER_BAR_HEIGHT;
