/** @jsxImportSource nativewind */
import { View } from 'react-native';

import { Exercise } from '../types';
import { Button, Card, CardContent, IconButton, Text, TextInput } from './paper';

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
  return (
    <Card className="rounded-2xl border-l-4 border-l-sky-300" mode="elevated">
      <CardContent className="flex flex-col gap-5">
        <View className="flex-row items-center justify-between">
          <Text variant="titleMedium">{exercise.name}</Text>
          <View className="flex-row gap-2">
            <Button mode="text" compact onPress={onReset}>
              Reset
            </Button>
            <Button
              mode="text"
              compact
              textColor="#ef4444"
              icon="delete-outline"
              onPress={onRemove}
            >
              Remove
            </Button>
          </View>
        </View>

        <View className="flex-row items-start justify-between">
          <View className="w-32 flex flex-col gap-2">
            <Text className="text-xs tracking-[0.6px] text-slate-500 dark:text-slate-400" variant="labelSmall">
              Reps
            </Text>
            <TextInput
              mode="outlined"
              keyboardType="numeric"
              value={exercise.reps.toString()}
              onChangeText={(text) => onChangeReps(Number.parseInt(text || '0', 10))}
              className="w-20"
              contentStyle={{ fontSize: 24, fontWeight: '700', textAlign: 'center' }}
            />
          </View>

          <View className="flex-1 items-center flex flex-col gap-3">
            <Text className="text-xs tracking-[0.6px] text-slate-500 dark:text-slate-400" variant="labelSmall">
              Step size ({exercise.step})
            </Text>
            <View className="flex-row items-center gap-2">
              <IconButton icon="minus-circle-outline" size={22} onPress={() => onAdjustStep(-1)} />
              <IconButton icon="plus-circle-outline" size={22} onPress={() => onAdjustStep(1)} />
            </View>
            <View className="flex-row items-center gap-2">
              <IconButton icon="minus" mode="contained-tonal" onPress={() => onAdjustReps(-exercise.step)} />
              <IconButton icon="plus" mode="contained-tonal" onPress={() => onAdjustReps(exercise.step)} />
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}
