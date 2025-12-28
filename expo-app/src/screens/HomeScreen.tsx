/** @jsxImportSource nativewind */
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { INNER_APPS } from '../data/innerApps';
import { Button, Card, CardActions, CardTitle, Text } from '../components/paper';
import { useThemePalette } from '../state/theme';

export function HomeScreen() {
  const router = useRouter();
  const { palettes, paletteId, setPaletteId } = useThemePalette();

  const handleSelect = (appId: string) => {
    if (appId === 'reps-tracker') {
      router.push('/reps-tracker');
    }
    if (appId === 'wake-tracker') {
      router.push('/wake-tracker');
    }
  };

  return (
    <View className="flex-1">
      <View className="px-7 py-10">
        {INNER_APPS.map((app) => (
          <View key={app.id} className="mb-6">
            <Card className="rounded-[20px]" mode="elevated" onPress={() => handleSelect(app.id)}>
              <View className="px-6 py-5 flex flex-col gap-4">
                <CardTitle title={app.title} subtitle={app.description} />
                <View className="pt-3">
                  <CardActions>
                    <Button mode="contained" icon="arrow-right" onPress={() => handleSelect(app.id)}>
                      Open
                    </Button>
                  </CardActions>
                </View>
              </View>
            </Card>
          </View>
        ))}

        <View className="mt-4">
          <Text variant="titleMedium">Color themes</Text>
          <View className="mt-3 flex flex-row flex-wrap gap-3">
            {palettes.map((palette) => {
              const isSelected = palette.id === paletteId;
              return (
                <Pressable
                  key={palette.id}
                  onPress={() => setPaletteId(palette.id)}
                  className={`rounded-2xl border px-3 py-2 ${isSelected ? 'border-sky-400' : 'border-slate-200 dark:border-slate-700'}`}
                >
                  <View className="flex-row items-center gap-2">
                    <View
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: palette.light.primary }}
                    />
                    <View
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: palette.light.secondary }}
                    />
                    <Text variant="labelMedium">{palette.name}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}
