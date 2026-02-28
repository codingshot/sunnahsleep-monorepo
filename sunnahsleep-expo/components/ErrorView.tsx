import { Pressable, Text, View } from "react-native";

type Props = {
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorView({ message = "Something went wrong.", onRetry, retryLabel = "Try again" }: Props) {
  return (
    <View className="rounded-xl border border-destructive/50 bg-destructive/10 p-4">
      <Text className="text-foreground dark:text-foreground-dark">{message}</Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          className="mt-3 min-h-[44px] items-center justify-center rounded bg-primary py-2"
          accessibilityLabel={retryLabel}
        >
          <Text className="font-medium text-primaryForeground">{retryLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}
