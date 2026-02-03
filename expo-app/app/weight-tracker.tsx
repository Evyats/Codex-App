/** @jsxImportSource nativewind */
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { WeightTrackerScreen } from '../src/screens/WeightTrackerScreen';
import { useWeightTracker } from '../src/state/weightTracker';

export default function WeightTrackerRoute() {
  const { entries, selectedDate, setSelectedDate, addEntry } = useWeightTracker();

  useFocusEffect(
    useCallback(() => {
      setSelectedDate(new Date());
    }, [setSelectedDate])
  );

  return (
    <WeightTrackerScreen
      entries={entries}
      selectedDate={selectedDate}
      onChangeDate={setSelectedDate}
      onAdd={addEntry}
    />
  );
}
