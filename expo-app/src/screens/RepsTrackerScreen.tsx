/** @jsxImportSource nativewind */
import { ScrollView, View } from 'react-native';

import { ExerciseRow } from '../components/ExerciseRow';
import { Card, CardContent, CardTitle, IconButton, TextInput } from '../components/paper';
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
  onMoveExercise: (id: string, direction: 'up' | 'down') => void;
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
  onMoveExercise,
}: RepsTrackerScreenProps) {
  return (
    <ScrollView>
      <View className="px-6 py-8 flex flex-col gap-7">
        {exercises.map((exercise, index) => (
          <ExerciseRow
            key={exercise.id}
            exercise={exercise}
            onChangeReps={(value) => onChangeReps(exercise.id, value)}
            onAdjustReps={(delta) => onAdjustReps(exercise.id, delta)}
            onAdjustStep={(delta) => onAdjustStep(exercise.id, delta)}
            onReset={() => onReset(exercise.id)}
            onRemove={() => onRemove(exercise.id)}
            onMoveUp={() => onMoveExercise(exercise.id, 'up')}
            onMoveDown={() => onMoveExercise(exercise.id, 'down')}
            canMoveUp={index > 0}
            canMoveDown={index < exercises.length - 1}
          />
        ))}

        <Card className="rounded-[18px]" mode="outlined">
          <CardTitle title="Add exercise" />
          <CardContent>
            <View className="flex-row items-center gap-3">
              <TextInput
                mode="outlined"
                label="Exercise name"
                value={newExerciseName}
                onChangeText={onChangeNewExerciseName}
                returnKeyType="done"
                className="flex-1"
              />
              <IconButton
                icon="plus"
                mode="contained"
                onPress={onAddExercise}
                disabled={!newExerciseName.trim().length}
                accessibilityLabel="Add exercise"
              />
            </View>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
