/** @jsxImportSource nativewind */
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';

import { INNER_APPS } from '../data/innerApps';

export function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();

  const handleSelect = (appId: string) => {
    if (appId === 'reps-tracker') {
      router.push('/reps-tracker');
    }
  };

  return (
    <View className="flex-1 px-5 py-6 space-y-4">
      <Card mode="contained" style={{ borderRadius: 16 }}>
        <Card.Content>
          <View className="space-y-2">
            <Text variant="titleMedium">React Native Paper is hooked up</Text>
            <Button mode="contained-tonal" icon="check-circle-outline" onPress={() => {}}>
              Paper Button
            </Button>
          </View>
        </Card.Content>
      </Card>

      <View className="space-y-3">
        {INNER_APPS.map((app) => (
          <Card
            key={app.id}
            mode="elevated"
            onPress={() => handleSelect(app.id)}
            style={{ borderRadius: 16, backgroundColor: theme.colors.surface }}
          >
            <Card.Title title={app.title} subtitle={app.description} />
            <Card.Actions>
              <Button mode="contained" icon="arrow-right" onPress={() => handleSelect(app.id)}>
                Open
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </View>
    </View>
  );
}
