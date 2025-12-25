/** @jsxImportSource nativewind */
import { useColorScheme } from 'nativewind';
import { Pressable, Text } from 'react-native';

type RoundButtonProps = {
  label: string;
  onPress: () => void;
};

export function RoundButton({ label, onPress }: RoundButtonProps) {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme ?? 'dark';
  const ripple = resolvedScheme === 'dark' ? '#1f2937' : '#e2e8f0';

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: ripple, borderless: true }}
      className="h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
    >
      <Text className="text-lg font-semibold text-slate-900 dark:text-white">{label}</Text>
    </Pressable>
  );
}
