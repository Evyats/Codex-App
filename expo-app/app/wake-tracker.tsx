/** @jsxImportSource nativewind */
import { WakeTrackerScreen } from '../src/screens/WakeTrackerScreen';
import { useWakeTracker } from '../src/state/wakeTracker';

export default function WakeTrackerRoute() {
  const { entries, selectedDate, setSelectedDate, addEntry, removeEntry, resetToSeed } = useWakeTracker();

  return (
    <WakeTrackerScreen
      entries={entries}
      selectedDate={selectedDate}
      onChangeDate={setSelectedDate}
      onAdd={addEntry}
      onRemoveEntry={removeEntry}
      onResetToSeed={resetToSeed}
    />
  );
}
