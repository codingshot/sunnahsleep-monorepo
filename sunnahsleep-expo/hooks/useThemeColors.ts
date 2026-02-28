import { useColorScheme } from "react-native";
import { theme } from "@/constants/theme";

/** Returns theme-derived colors for use in components that need non-class styling (e.g. placeholderTextColor, ActivityIndicator color). */
export function useThemeColors() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  return {
    primary: isDark ? theme.dark.primary : theme.light.primary,
    placeholder: isDark ? theme.dark.mutedForeground : theme.light.mutedForeground,
    destructive: isDark ? theme.dark.destructive : theme.light.destructive,
  };
}
