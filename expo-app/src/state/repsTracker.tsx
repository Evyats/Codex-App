/** @jsxImportSource nativewind */
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { Exercise } from '../types';
import { loadJSON, saveJSON } from './storage';

type RepsTab = {
  id: string;
  name: string;
  exercises: Exercise[];
};

type RepsTrackerContextValue = {
  tabs: RepsTab[];
  selectedTabId: string;
  setSelectedTabId: (id: string) => void;
  addTab: (name?: string) => void;
  removeTab: (id: string) => void;
  exercises: Exercise[];
  newExerciseName: string;
  setNewExerciseName: (value: string) => void;
  changeReps: (id: string, value: number) => void;
  adjustReps: (id: string, delta: number) => void;
  adjustStep: (id: string, delta: number) => void;
  resetExercise: (id: string) => void;
  removeExercise: (id: string) => void;
  addExercise: () => void;
  moveExercise: (id: string, direction: 'up' | 'down') => void;
};

type RepsTrackerPersistedState = {
  tabs: RepsTab[];
  selectedTabId: string;
};

const DEFAULT_EXERCISES: Exercise[] = [
  { id: 'pullups', name: 'Pull Ups', reps: 0, step: 1 },
  { id: 'pushups', name: 'Push Ups', reps: 0, step: 1 },
];

const DEFAULT_TABS: RepsTab[] = [{ id: 'all', name: 'All', exercises: DEFAULT_EXERCISES }];

const STORAGE_KEY = 'reps-tracker/state/v2';

const RepsTrackerContext = createContext<RepsTrackerContextValue | undefined>(undefined);

export function RepsTrackerProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<RepsTab[]>(() => DEFAULT_TABS);
  const [selectedTabId, setSelectedTabId] = useState('all');
  const [newExerciseName, setNewExerciseName] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const stored = await loadJSON<RepsTrackerPersistedState | Exercise[]>(STORAGE_KEY);
      if (!isMounted) return;
      if (Array.isArray(stored)) {
        setTabs([{ id: 'all', name: 'All', exercises: stored }]);
        setSelectedTabId('all');
      } else if (stored && Array.isArray(stored.tabs) && stored.tabs.length) {
        setTabs(stored.tabs);
        setSelectedTabId(stored.selectedTabId || stored.tabs[0]?.id || 'all');
      }
      setHydrated(true);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveJSON(STORAGE_KEY, { tabs, selectedTabId });
  }, [tabs, selectedTabId, hydrated]);

  useEffect(() => {
    if (!tabs.some((tab) => tab.id === selectedTabId)) {
      setSelectedTabId(tabs[0]?.id ?? 'all');
    }
  }, [tabs, selectedTabId]);

  const updateExercises = (updater: (exercises: Exercise[]) => Exercise[], tabId?: string) => {
    const targetId = tabId ?? selectedTabId;
    setTabs((prev) =>
      prev.map((tab) => (tab.id === targetId ? { ...tab, exercises: updater(tab.exercises) } : tab))
    );
  };

  const parseCompositeId = (id: string) => {
    const parts = id.split('::');
    if (parts.length === 2) {
      return { tabId: parts[0], exerciseId: parts[1] };
    }
    return { tabId: selectedTabId, exerciseId: id };
  };

  const updateExercise = (id: string, updater: (exercise: Exercise) => Exercise) => {
    const { tabId, exerciseId } = parseCompositeId(id);
    updateExercises(
      (prev) => prev.map((exercise) => (exercise.id === exerciseId ? updater(exercise) : exercise)),
      tabId
    );
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
    const { tabId, exerciseId } = parseCompositeId(id);
    updateExercises((prev) => prev.filter((exercise) => exercise.id !== exerciseId), tabId);
  };

  const moveExercise = (id: string, direction: 'up' | 'down') => {
    const { tabId, exerciseId } = parseCompositeId(id);
    updateExercises((prev) => {
      const index = prev.findIndex((exercise) => exercise.id === exerciseId);
      if (index === -1) return prev;
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    }, tabId);
  };

  const ensureDefaultTab = () => {
    const fallback = tabs.find((tab) => tab.id !== 'all');
    if (fallback) return fallback.id;
    const newTab = { id: `tab-${Date.now()}`, name: 'Tab 1', exercises: [] };
    setTabs((prev) => [...prev, newTab]);
    return newTab.id;
  };

  const addExercise = () => {
    const trimmed = newExerciseName.trim();
    if (!trimmed) return;
    const targetId = selectedTabId === 'all' ? ensureDefaultTab() : selectedTabId;
    updateExercises(
      (prev) => [{ id: `${trimmed}-${Date.now()}`, name: trimmed, reps: 0, step: 1 }, ...prev],
      targetId
    );
    setNewExerciseName('');
  };

  const addTab = (name?: string) => {
    const count = tabs.filter((tab) => tab.id !== 'all').length + 1;
    const trimmed = name?.trim();
    const label = trimmed && trimmed.length ? trimmed : `Tab ${count}`;
    const newTab = { id: `tab-${Date.now()}`, name: label, exercises: [] };
    setTabs((prev) => [...prev, newTab]);
    setSelectedTabId(newTab.id);
  };

  const removeTab = (id: string) => {
    if (id === 'all') return;
    setTabs((prev) => prev.filter((tab) => tab.id !== id));
    setSelectedTabId((prev) => (prev === id ? 'all' : prev));
  };

  const selectedTab = useMemo(() => tabs.find((tab) => tab.id === selectedTabId), [tabs, selectedTabId]);
  const exercises = useMemo(() => {
    if (selectedTabId !== 'all') return selectedTab?.exercises ?? [];
    const flattened: Exercise[] = [];
    tabs.forEach((tab) => {
      tab.exercises.forEach((exercise) => {
        flattened.push({ ...exercise, id: `${tab.id}::${exercise.id}` });
      });
    });
    return flattened;
  }, [selectedTabId, selectedTab, tabs]);

  const value = useMemo(
    () => ({
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
    }),
    [tabs, selectedTabId, exercises, newExerciseName]
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
