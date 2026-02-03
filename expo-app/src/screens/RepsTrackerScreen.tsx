/** @jsxImportSource nativewind */
import { Alert, Modal, Pressable, ScrollView, View } from 'react-native';
import { useState } from 'react';

import { ExerciseRow } from '../components/ExerciseRow';
import { Button, Card, CardContent, IconButton, TextInput } from '../components/paper';
import { Exercise } from '../types';

type RepsTab = {
  id: string;
  name: string;
};

type RepsTrackerScreenProps = {
  tabs: RepsTab[];
  selectedTabId: string;
  onSelectTab: (id: string) => void;
  onAddTab: (name?: string) => void;
  onRemoveTab: (id: string) => void;
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
  tabs,
  selectedTabId,
  onSelectTab,
  onAddTab,
  onRemoveTab,
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
  const [newTabName, setNewTabName] = useState('');
  const [showTabModal, setShowTabModal] = useState(false);
  const selectedTab = tabs.find((tab) => tab.id === selectedTabId);
  const canRemoveTab = selectedTab && selectedTab.id !== 'all';

  return (
    <ScrollView>
      <View className="px-6 py-8 flex flex-col gap-7">
        <Card className="rounded-[18px]" mode="outlined">
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

        <Card className="rounded-[18px]" mode="outlined">
          <CardContent>
            <View className="flex-row items-center gap-1">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
                <View className="flex-row items-center gap-2 pr-2">
                  {tabs.map((tab) => {
                    const isSelected = tab.id === selectedTabId;
                    return (
                      <Button
                        key={tab.id}
                        mode="contained"
                        compact
                        icon={isSelected ? 'check' : undefined}
                        onPress={() => onSelectTab(tab.id)}
                      >
                        {tab.name}
                      </Button>
                    );
                  })}
                </View>
              </ScrollView>
              <IconButton
                icon="delete-outline"
                mode="contained-tonal"
                disabled={!canRemoveTab}
                accessibilityLabel="Remove tab"
                onPress={() => {
                  if (!canRemoveTab || !selectedTab) return;
                  Alert.alert('Remove tab?', `Delete "${selectedTab.name}" and its data?`, [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Remove', style: 'destructive', onPress: () => onRemoveTab(selectedTab.id) },
                  ]);
                }}
              />
              <IconButton
                icon="plus"
                mode="contained"
                onPress={() => {
                  setNewTabName('');
                  setShowTabModal(true);
                }}
                accessibilityLabel="Add tab"
              />
            </View>
          </CardContent>
        </Card>

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
      </View>

      <Modal visible={showTabModal} transparent animationType="fade" onRequestClose={() => setShowTabModal(false)}>
        <Pressable className="flex-1 bg-black/50 justify-center px-6" onPress={() => setShowTabModal(false)}>
          <Pressable className="rounded-[18px] bg-white p-5 dark:bg-slate-900" onPress={(event) => event.stopPropagation()}>
            <View className="flex flex-col gap-4">
              <TextInput
                mode="outlined"
                label="Tab name"
                value={newTabName}
                onChangeText={setNewTabName}
                autoFocus
              />
              <View className="flex-row justify-end gap-2">
                <Button mode="text" onPress={() => setShowTabModal(false)}>
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={() => {
                    onAddTab(newTabName.trim() || undefined);
                    setShowTabModal(false);
                  }}
                >
                  Add
                </Button>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}
