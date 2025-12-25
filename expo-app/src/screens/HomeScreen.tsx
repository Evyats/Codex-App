/** @jsxImportSource nativewind */
import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { INNER_APPS } from '../data/innerApps';
import { Button, Card, CardActions, CardTitle } from '../components/paper';

export function HomeScreen() {
  const router = useRouter();

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
      </View>
    </View>
  );
}
