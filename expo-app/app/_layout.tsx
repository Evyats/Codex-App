/** @jsxImportSource nativewind */
import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Button,
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
  type MD3Theme,
} from 'react-native-paper';

import { RepsTrackerProvider } from '../src/state/repsTracker';

type RootProvidersProps = {
  children: ReactNode;
  theme: MD3Theme;
};

function RootProviders({ children, theme }: RootProvidersProps) {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <RepsTrackerProvider>{children}</RepsTrackerProvider>
      </PaperProvider>
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

  const paperTheme = useMemo<MD3Theme>(() => {
    const base = resolvedScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: '#8b5cf6',
        secondary: '#14b8a6',
        background: resolvedScheme === 'dark' ? '#0f172a' : '#f8fafc',
        surface: resolvedScheme === 'dark' ? '#111827' : '#ffffff',
      },
    };
  }, [resolvedScheme]);

  const headerColors = useMemo(
    () => ({
      headerBackground: paperTheme.colors.surface,
      contentBackground: paperTheme.colors.background,
      headerText: paperTheme.colors.onSurface,
    }),
    [paperTheme.colors.background, paperTheme.colors.onSurface, paperTheme.colors.surface]
  );

  const themeIcon = resolvedScheme === 'dark' ? 'weather-sunny' : 'moon-waning-crescent';
  const themeLabel = resolvedScheme === 'dark' ? 'Light' : 'Dark';

  return (
    <RootProviders theme={paperTheme}>
      <StatusBar style={resolvedScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: headerColors.headerBackground },
          headerTintColor: headerColors.headerText,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: headerColors.contentBackground },
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Button
                mode="text"
                icon={themeIcon}
                onPress={toggleColorScheme}
                textColor={headerColors.headerText}
                compact
              >
                {themeLabel}
              </Button>
            </View>
          ),
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Mini Apps' }} />
        <Stack.Screen name="reps-tracker" options={{ title: 'Reps Tracker' }} />
      </Stack>
    </RootProviders>
  );
}
