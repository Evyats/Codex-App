/** @jsxImportSource nativewind */
import { RepsTrackerScreen } from '../src/screens/RepsTrackerScreen';
import { useRepsTracker } from '../src/state/repsTracker';

export default function RepsTrackerRoute() {
  const {
    tabs,
    selectedTabId,
    setSelectedTabId,
    addTab,
    removeTab,
    exercises,
    newExerciseName,
    setNewExerciseName,
    changeReps,
    adjustReps,
    adjustStep,
    resetExercise,
    removeExercise,
    addExercise,
    moveExercise,
  } = useRepsTracker();

  return (
    <RepsTrackerScreen
      tabs={tabs}
      selectedTabId={selectedTabId}
      onSelectTab={setSelectedTabId}
      onAddTab={addTab}
      onRemoveTab={removeTab}
      exercises={exercises}
      newExerciseName={newExerciseName}
      onChangeNewExerciseName={setNewExerciseName}
      onChangeReps={changeReps}
      onAdjustReps={adjustReps}
      onAdjustStep={adjustStep}
      onReset={resetExercise}
      onRemove={removeExercise}
      onAddExercise={addExercise}
      onMoveExercise={moveExercise}
    />
  );
}
