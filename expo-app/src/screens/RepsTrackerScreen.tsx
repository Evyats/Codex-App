/** @jsxImportSource nativewind */
import { useColorScheme } from 'nativewind';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { ExerciseRow } from '../components/ExerciseRow';
import { Exercise } from '../types';

type RepsTrackerScreenProps = {
  exercises: Exercise[];
  newExerciseName: string;
  onChangeNewExerciseName: (value: string) => void;
  onChangeReps: (id: string, value: number) => void;
  onAdjustReps: (id: string, delta: number) => void;
  onAdjustStep: (id: string, delta: number) => void;
  onReset: (id: string) => void;
  onRemove: (id: string) => void;
  onAddExercise: () => void;
};

export function RepsTrackerScreen({
  exercises,
  newExerciseName,
  onChangeNewExerciseName,
  onChangeReps,
  onAdjustReps,
  onAdjustStep,
  onReset,
  onRemove,
  onAddExercise,
}: RepsTrackerScreenProps) {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme ?? 'dark';
  const ripple = resolvedScheme === 'dark' ? '#1f2937' : '#e2e8f0';

  return (
    <View className="flex-1">
      <ScrollView className="flex-1 px-5 py-4">
        {exercises.map((exercise, index) => (
          <View key={exercise.id} className={index === exercises.length - 1 ? '' : 'mb-3'}>
            <ExerciseRow
              exercise={exercise}
              onChangeReps={(value) => onChangeReps(exercise.id, value)}
              onAdjustReps={(delta) => onAdjustReps(exercise.id, delta)}
              onAdjustStep={(delta) => onAdjustStep(exercise.id, delta)}
              onReset={() => onReset(exercise.id)}
              onRemove={() => onRemove(exercise.id)}
            />
          </View>
        ))}

        <View className="mt-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <Text className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
            Add exercise
          </Text>
          <View className="flex-row items-center space-x-3">
            <TextInput
              value={newExerciseName}
              onChangeText={onChangeNewExerciseName}
              placeholder="Exercise name"
              placeholderTextColor="#94a3b8"
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
            <Pressable
              onPress={onAddExercise}
              android_ripple={{ color: ripple }}
              className="rounded-lg bg-emerald-600 px-4 py-2 dark:bg-emerald-500"
              style={{ overflow: 'hidden' }}
            >
              <Text className="font-semibold text-white">Add</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
