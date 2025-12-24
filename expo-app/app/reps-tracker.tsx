/** @jsxImportSource nativewind */
import { RepsTrackerScreen } from '../src/screens/RepsTrackerScreen';
import { useRepsTracker } from '../src/state/repsTracker';

export default function RepsTrackerRoute() {
  const {
    exercises,
    newExerciseName,
    setNewExerciseName,
    changeReps,
    adjustReps,
    adjustStep,
    resetExercise,
    removeExercise,
    addExercise,
  } = useRepsTracker();

  return (
    <RepsTrackerScreen
      exercises={exercises}
      newExerciseName={newExerciseName}
      onChangeNewExerciseName={setNewExerciseName}
      onChangeReps={changeReps}
      onAdjustReps={adjustReps}
      onAdjustStep={adjustStep}
      onReset={resetExercise}
      onRemove={removeExercise}
      onAddExercise={addExercise}
    />
  );
}
