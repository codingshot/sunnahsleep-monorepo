import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

/** True when the user has "Reduce motion" enabled in system settings. */
export function useReduceMotionEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setEnabled);
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setEnabled);
    return () => sub.remove();
  }, []);

  return enabled;
}
