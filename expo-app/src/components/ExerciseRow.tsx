/** @jsxImportSource nativewind */
import { View } from 'react-native';
import { Button, Card, IconButton, Text, TextInput, useTheme } from 'react-native-paper';

import { Exercise } from '../types';

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
  const theme = useTheme();

  return (
    <Card
      mode="elevated"
      style={{
        borderRadius: 16,
        backgroundColor: theme.colors.elevation.level2,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.primary,
      }}
    >
      <Card.Content>
        <View className="flex-row items-center justify-between">
          <Text variant="titleMedium">{exercise.name}</Text>
          <View className="flex-row">
            <Button mode="text" compact onPress={onReset}>
              Reset
            </Button>
            <Button
              mode="text"
              compact
              textColor={theme.colors.error}
              icon="delete-outline"
              onPress={onRemove}
            >
              Remove
            </Button>
          </View>
        </View>

        <View className="mt-3 flex-row items-start justify-between">
          <View style={{ width: 120 }}>
            <Text
              variant="labelSmall"
              style={{
                marginBottom: 6,
                letterSpacing: 0.6,
                color: theme.colors.onSurfaceVariant,
              }}
            >
              Reps
            </Text>
            <TextInput
              mode="outlined"
              dense
              keyboardType="numeric"
              value={exercise.reps.toString()}
              onChangeText={(text) => onChangeReps(Number.parseInt(text || '0', 10))}
              contentStyle={{ fontSize: 20, fontWeight: '700' }}
            />
          </View>

          <View className="flex-1 items-center">
            <Text
              variant="labelSmall"
              style={{
                marginBottom: 6,
                letterSpacing: 0.6,
                color: theme.colors.onSurfaceVariant,
              }}
            >
              Step size ({exercise.step})
            </Text>
            <View className="flex-row items-center">
              <IconButton
                icon="minus-circle-outline"
                size={22}
                onPress={() => onAdjustStep(-1)}
              />
              <IconButton icon="plus-circle-outline" size={22} onPress={() => onAdjustStep(1)} />
            </View>
            <View className="mt-1 flex-row items-center">
              <IconButton
                icon="minus"
                mode="contained-tonal"
                onPress={() => onAdjustReps(-exercise.step)}
              />
              <IconButton
                icon="plus"
                mode="contained-tonal"
                onPress={() => onAdjustReps(exercise.step)}
              />
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}
