import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { WeightEntry } from '../types';
import { loadJSON, saveJSON } from './storage';

type WeightTrackerContextValue = {
  entries: WeightEntry[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  addEntry: (weight: number) => void;
};

type WeightTrackerPersistedState = {
  entries: WeightEntry[];
  selectedDate?: string;
};

const WeightTrackerContext = createContext<WeightTrackerContextValue | null>(null);
const STORAGE_KEY = 'weight-tracker/state/v1';

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function dateKey(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}

const now = new Date();
const seedEntries: WeightEntry[] = [
  { id: 'weight-1', timestamp: addDays(now, -6).toISOString(), weight: 78.6 },
  { id: 'weight-2', timestamp: addDays(now, -5).toISOString(), weight: 78.3 },
  { id: 'weight-3', timestamp: addDays(now, -4).toISOString(), weight: 78.1 },
  { id: 'weight-4', timestamp: addDays(now, -3).toISOString(), weight: 77.9 },
  { id: 'weight-5', timestamp: addDays(now, -2).toISOString(), weight: 77.8 },
  { id: 'weight-6', timestamp: addDays(now, -1).toISOString(), weight: 77.6 },
  { id: 'weight-7', timestamp: now.toISOString(), weight: 77.5 },
].sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1));

export function WeightTrackerProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<WeightEntry[]>(seedEntries);
  const [selectedDate, setSelectedDate] = useState<Date>(now);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const stored = await loadJSON<WeightTrackerPersistedState>(STORAGE_KEY);
      if (!isMounted) return;
      if (stored && Array.isArray(stored.entries)) {
        setEntries(stored.entries);
      }
      if (stored?.selectedDate) {
        const parsed = new Date(stored.selectedDate);
        if (!Number.isNaN(parsed.getTime())) {
          setSelectedDate(parsed);
        }
      }
      setHydrated(true);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveJSON(STORAGE_KEY, { entries, selectedDate: selectedDate.toISOString() });
  }, [entries, selectedDate, hydrated]);

  const value = useMemo<WeightTrackerContextValue>(() => {
    const addEntry = (weight: number) => {
      if (Number.isNaN(weight)) return;
      const key = dateKey(selectedDate);
      setEntries((prev) => {
        const withoutDay = prev.filter((entry) => dateKey(entry.timestamp) !== key);
        return [
          { id: `weight-${Date.now()}`, timestamp: selectedDate.toISOString(), weight },
          ...withoutDay,
        ].sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1));
      });
    };

    return {
      entries,
      selectedDate,
      setSelectedDate,
      addEntry,
    };
  }, [entries, selectedDate]);

  return <WeightTrackerContext.Provider value={value}>{children}</WeightTrackerContext.Provider>;
}

export function useWeightTracker() {
  const ctx = useContext(WeightTrackerContext);
  if (!ctx) {
    throw new Error('useWeightTracker must be used within WeightTrackerProvider');
  }
  return ctx;
}
