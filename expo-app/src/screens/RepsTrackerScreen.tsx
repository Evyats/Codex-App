/** @jsxImportSource nativewind */
import { ScrollView, View } from 'react-native';

import { ExerciseRow } from '../components/ExerciseRow';
import { Button, Card, CardContent, CardTitle, TextInput } from '../components/paper';
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
  return (
    <ScrollView>
      <View className="px-6 py-8    flex flex-col gap-7">
        {exercises.map((exercise) => (
          <ExerciseRow
            key={exercise.id}
            exercise={exercise}
            onChangeReps={(value) => onChangeReps(exercise.id, value)}
            onAdjustReps={(delta) => onAdjustReps(exercise.id, delta)}
            onAdjustStep={(delta) => onAdjustStep(exercise.id, delta)}
            onReset={() => onReset(exercise.id)}
            onRemove={() => onRemove(exercise.id)}
          />
        ))}

        <Card className="rounded-2xl" mode="outlined">
          <CardTitle title="Add exercise" />
          <CardContent>
            <View className="flex flex-col gap-4">
              <TextInput
                mode="outlined"
                label="Exercise name"
                value={newExerciseName}
                onChangeText={onChangeNewExerciseName}
                returnKeyType="done"
                className="rounded-3xl"
              />
              <Button
                mode="contained"
                icon="plus"
                onPress={onAddExercise}
                disabled={!newExerciseName.trim().length}
              >
                Add exercise
              </Button>
            </View>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
