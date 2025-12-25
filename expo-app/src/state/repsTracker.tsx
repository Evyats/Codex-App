/** @jsxImportSource nativewind */
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { Exercise } from '../types';
import { loadJSON, saveJSON } from './storage';

type RepsTrackerContextValue = {
  exercises: Exercise[];
  newExerciseName: string;
  setNewExerciseName: (value: string) => void;
  changeReps: (id: string, value: number) => void;
  adjustReps: (id: string, delta: number) => void;
  adjustStep: (id: string, delta: number) => void;
  resetExercise: (id: string) => void;
  removeExercise: (id: string) => void;
  addExercise: () => void;
};

const DEFAULT_EXERCISES: Exercise[] = [
  { id: 'pullups', name: 'Pull Ups', reps: 0, step: 1 },
  { id: 'pushups', name: 'Push Ups', reps: 0, step: 1 },
];

const STORAGE_KEY = 'reps-tracker/state/v1';

const RepsTrackerContext = createContext<RepsTrackerContextValue | undefined>(undefined);

export function RepsTrackerProvider({ children }: { children: ReactNode }) {
  const [exercises, setExercises] = useState<Exercise[]>(() => DEFAULT_EXERCISES);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const stored = await loadJSON<Exercise[]>(STORAGE_KEY);
      if (!isMounted) return;
      if (Array.isArray(stored)) {
        setExercises(stored);
      }
      setHydrated(true);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveJSON(STORAGE_KEY, exercises);
  }, [exercises, hydrated]);

  const updateExercise = (id: string, updater: (exercise: Exercise) => Exercise) => {
    setExercises((prev) => prev.map((exercise) => (exercise.id === id ? updater(exercise) : exercise)));
  };

  const changeReps = (id: string, value: number) => {
    updateExercise(id, (exercise) => ({
      ...exercise,
      reps: Number.isNaN(value) ? exercise.reps : Math.max(0, value),
    }));
  };

  const adjustReps = (id: string, delta: number) => {
    updateExercise(id, (exercise) => ({ ...exercise, reps: Math.max(0, exercise.reps + delta) }));
  };

  const adjustStep = (id: string, delta: number) => {
    updateExercise(id, (exercise) => ({ ...exercise, step: Math.max(1, exercise.step + delta) }));
  };

  const resetExercise = (id: string) => {
    updateExercise(id, (exercise) => ({ ...exercise, reps: 0 }));
  };

  const removeExercise = (id: string) => {
    setExercises((prev) => prev.filter((exercise) => exercise.id !== id));
  };

  const addExercise = () => {
    const trimmed = newExerciseName.trim();
    if (!trimmed) return;
    setExercises((prev) => [
      ...prev,
      { id: `${trimmed}-${Date.now()}`, name: trimmed, reps: 0, step: 1 },
    ]);
    setNewExerciseName('');
  };

  const value = useMemo(
    () => ({
      exercises,
      newExerciseName,
      setNewExerciseName,
      changeReps,
      adjustReps,
      adjustStep,
      resetExercise,
      removeExercise,
      addExercise,
    }),
    [exercises, newExerciseName]
  );

  return <RepsTrackerContext.Provider value={value}>{children}</RepsTrackerContext.Provider>;
}

export function useRepsTracker() {
  const context = useContext(RepsTrackerContext);
  if (!context) {
    throw new Error('useRepsTracker must be used within a RepsTrackerProvider');
  }
  return context;
}
