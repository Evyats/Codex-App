/** @jsxImportSource nativewind */
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

import { INNER_APPS } from '../data/innerApps';

export function HomeScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme ?? 'dark';
  const ripple = resolvedScheme === 'dark' ? '#1f2937' : '#e2e8f0';

  const handleSelect = (appId: string) => {
    if (appId === 'reps-tracker') {
      router.push('/reps-tracker');
    }
  };

  return (
    <View className="flex-1 px-5 py-6">
      <View className="space-y-4">
        {INNER_APPS.map((app) => (
          <Pressable
            key={app.id}
            onPress={() => handleSelect(app.id)}
            android_ripple={{ color: ripple }}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
            style={{ overflow: 'hidden' }}
          >
            <Text className="text-xl font-semibold text-slate-900 dark:text-white">
              {app.title}
            </Text>
            <Text className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {app.description}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
