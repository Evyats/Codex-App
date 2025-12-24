/** @jsxImportSource nativewind */
import { ScrollView, View } from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';

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
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}>
      <View className="space-y-4">
        {exercises.map((exercise) => (
          <View key={exercise.id} style={{ marginBottom: 12 }}>
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

        <Card mode="outlined" style={{ borderRadius: 16, marginTop: 4 }}>
          <Card.Title title="Add exercise" />
          <Card.Content>
            <View className="flex-row items-center space-x-3">
              <TextInput
                mode="outlined"
                label="Exercise name"
                value={newExerciseName}
                onChangeText={onChangeNewExerciseName}
                returnKeyType="done"
                style={{ flex: 1 }}
              />
              <Button
                mode="contained"
                icon="plus"
                onPress={onAddExercise}
                disabled={!newExerciseName.trim().length}
                compact
              >
                Add exercise
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}
