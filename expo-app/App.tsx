import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }} edges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-center px-6 bg-slate-950">
          <Text className="text-2xl font-semibold text-white">Welcome to Expo + Tailwind</Text>
          <Text className="mt-3 text-base text-slate-300">
            Edit App.tsx to start building with NativeWind.
          </Text>
          <StatusBar style="light" />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
