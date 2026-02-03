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
import { ThemePaletteProvider, useThemePalette } from '../src/state/theme';
import { WakeTrackerProvider } from '../src/state/wakeTracker';
import { WeightTrackerProvider } from '../src/state/weightTracker';

type RootProvidersProps = {
  children: ReactNode;
  theme: MD3Theme;
};

function RootProviders({ children, theme }: RootProvidersProps) {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <RepsTrackerProvider>
          <WakeTrackerProvider>
            <WeightTrackerProvider>{children}</WeightTrackerProvider>
          </WakeTrackerProvider>
        </RepsTrackerProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

function ThemedLayout() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();
  const { palette } = useThemePalette();
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
    const paletteColors = resolvedScheme === 'dark' ? palette.dark : palette.light;
    return {
      ...base,
      roundness: 18,
      colors: {
        ...base.colors,
        primary: paletteColors.primary,
        secondary: paletteColors.secondary,
        background: paletteColors.background,
        surface: paletteColors.surface,
      },
    };
  }, [palette.dark, palette.light, resolvedScheme]);

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
            <View className="flex-row items-center">
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
        <Stack.Screen name="wake-tracker" options={{ title: 'Wake-up Tracker' }} />
        <Stack.Screen name="weight-tracker" options={{ title: 'Weight Tracker' }} />
        <Stack.Screen name="design-lab" options={{ title: 'Design Lab' }} />
      </Stack>
    </RootProviders>
  );
}

export default function RootLayout() {
  return (
    <ThemePaletteProvider>
      <ThemedLayout />
    </ThemePaletteProvider>
  );
}
