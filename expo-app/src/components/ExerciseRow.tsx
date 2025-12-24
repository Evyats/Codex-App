/** @jsxImportSource nativewind */
import { useColorScheme } from 'nativewind';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Exercise } from '../types';
import { RoundButton } from './RoundButton';

type ExerciseRowProps = {
  exercise: Exercise;
  onChangeReps: (value: number) => void;
  onAdjustReps: (delta: number) => void;
  onAdjustStep: (delta: number) => void;
  onReset: () => void;
  onRemove: () => void;
};

export function ExerciseRow({
  exercise,
  onChangeReps,
  onAdjustReps,
  onAdjustStep,
  onReset,
  onRemove,
}: ExerciseRowProps) {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme ?? 'dark';
  const ripple = resolvedScheme === 'dark' ? '#1f2937' : '#e2e8f0';
  const dangerRipple = resolvedScheme === 'dark' ? '#7f1d1d' : '#fecaca';

  return (
    <View className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 dark:border-slate-800 dark:bg-slate-900">
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-semibold text-slate-900 dark:text-white">{exercise.name}</Text>
        <View className="flex-row space-x-2">
          <Pressable
            onPress={onReset}
            android_ripple={{ color: ripple }}
            className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1 dark:border-slate-700 dark:bg-slate-800"
            style={{ overflow: 'hidden' }}
          >
            <Text className="text-sm text-slate-700 dark:text-slate-200">Reset</Text>
          </Pressable>
          <Pressable
            onPress={onRemove}
            android_ripple={{ color: dangerRipple }}
            className="rounded-lg border border-rose-300 bg-rose-100 px-3 py-1 dark:border-rose-700 dark:bg-rose-800/60"
            style={{ overflow: 'hidden' }}
          >
            <Text className="text-sm text-rose-700 dark:text-rose-100">Remove</Text>
          </Pressable>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="w-24">
          <Text className="text-xs uppercase tracking-wide text-slate-500 mb-1 dark:text-slate-400">
            Reps
          </Text>
          <TextInput
            keyboardType="numeric"
            value={exercise.reps.toString()}
            onChangeText={(text) => onChangeReps(Number.parseInt(text || '0', 10))}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-lg font-semibold text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </View>

        <View className="flex-1 items-center">
          <Text className="text-xs uppercase tracking-wide text-slate-500 mb-1 dark:text-slate-400">
            Step size ({exercise.step})
          </Text>
          <View className="flex-row items-center space-x-3 mb-2">
            <RoundButton label="-" onPress={() => onAdjustStep(-1)} />
            <RoundButton label="+" onPress={() => onAdjustStep(1)} />
          </View>
          <View className="flex-row items-center space-x-4">
            <RoundButton label="-" onPress={() => onAdjustReps(-exercise.step)} />
            <Text className="min-w-[48px] text-center text-lg font-semibold text-slate-900 dark:text-white">
              {exercise.reps}
            </Text>
            <RoundButton label="+" onPress={() => onAdjustReps(exercise.step)} />
          </View>
        </View>
      </View>
    </View>
  );
}
