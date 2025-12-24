/** @jsxImportSource nativewind */
import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Pressable, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RepsTrackerProvider } from '../src/state/repsTracker';

type RootProvidersProps = {
  children: ReactNode;
};

function RootProviders({ children }: RootProvidersProps) {
  return (
    <SafeAreaProvider>
      <RepsTrackerProvider>{children}</RepsTrackerProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();
  const [didInitScheme, setDidInitScheme] = useState(false);
  const resolvedScheme = colorScheme ?? 'dark';

  useEffect(() => {
    if (!didInitScheme) {
      setColorScheme('dark');
      setDidInitScheme(true);
    }
  }, [didInitScheme, setColorScheme]);

  const colors = useMemo(
    () => ({
      headerBackground: resolvedScheme === 'dark' ? '#0f172a' : '#ffffff',
      contentBackground: resolvedScheme === 'dark' ? '#0f172a' : '#f8fafc',
      headerText: resolvedScheme === 'dark' ? '#f8fafc' : '#0f172a',
      ripple: resolvedScheme === 'dark' ? '#1f2937' : '#e2e8f0',
      buttonBackground: resolvedScheme === 'dark' ? '#111827' : '#f1f5f9',
      buttonBorder: resolvedScheme === 'dark' ? '#1f2937' : '#e2e8f0',
    }),
    [resolvedScheme]
  );

  const themeIcon = resolvedScheme === 'dark' ? '☀️' : '🌙';
  const themeLabel = resolvedScheme === 'dark' ? 'Light' : 'Dark';

  return (
    <RootProviders>
      <StatusBar style={resolvedScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.headerBackground },
          headerTintColor: colors.headerText,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: colors.contentBackground },
          headerRight: () => (
            <Pressable
              onPress={toggleColorScheme}
              android_ripple={{ color: colors.ripple, borderless: false }}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: colors.buttonBorder,
                backgroundColor: colors.buttonBackground,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Text style={{ color: colors.headerText }}>{themeIcon}</Text>
              <Text style={{ color: colors.headerText }}>{themeLabel}</Text>
            </Pressable>
          ),
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Mini Apps' }} />
        <Stack.Screen name="reps-tracker" options={{ title: 'Reps Tracker' }} />
      </Stack>
    </RootProviders>
  );
}
