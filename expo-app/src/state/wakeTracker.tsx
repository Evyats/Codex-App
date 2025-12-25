import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { WakeEntry } from '../types';
import { loadJSON, saveJSON } from './storage';

type WakeTrackerContextValue = {
  entries: WakeEntry[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  addEntry: () => void;
  removeEntry: (id: string) => void;
  resetToSeed: () => void;
};

type WakeTrackerPersistedState = {
  entries: WakeEntry[];
  selectedDate?: string;
};

const WakeTrackerContext = createContext<WakeTrackerContextValue | null>(null);
const STORAGE_KEY = 'wake-tracker/state/v1';

function minutesFromDate(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function withTime(date: Date, hours: number, minutes: number) {
  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function dateKey(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}

const now = new Date();
const seedEntries: WakeEntry[] = [
  { id: 'w1', timestamp: withTime(addDays(now, -4), 6, 45).toISOString(), minutes: minutesFromDate(withTime(addDays(now, -4), 6, 45)) },
  { id: 'w2', timestamp: withTime(addDays(now, -3), 6, 30).toISOString(), minutes: minutesFromDate(withTime(addDays(now, -3), 6, 30)) },
  { id: 'w3', timestamp: withTime(addDays(now, -2), 7, 10).toISOString(), minutes: minutesFromDate(withTime(addDays(now, -2), 7, 10)) },
  { id: 'w4', timestamp: withTime(addDays(now, -1), 6, 55).toISOString(), minutes: minutesFromDate(withTime(addDays(now, -1), 6, 55)) },
  { id: 'w5', timestamp: now.toISOString(), minutes: minutesFromDate(now) },
];

const resetSeedEntries: WakeEntry[] = [
  { id: 'seed-2025-12-01', timestamp: withTime(new Date(2025, 11, 1), 8, 30).toISOString(), minutes: 510 },
  { id: 'seed-2025-12-02', timestamp: withTime(new Date(2025, 11, 2), 7, 30).toISOString(), minutes: 450 },
  { id: 'seed-2025-12-07', timestamp: withTime(new Date(2025, 11, 7), 11, 45).toISOString(), minutes: 705 },
  { id: 'seed-2025-12-08', timestamp: withTime(new Date(2025, 11, 8), 8, 0).toISOString(), minutes: 480 },
  { id: 'seed-2025-12-09', timestamp: withTime(new Date(2025, 11, 9), 10, 30).toISOString(), minutes: 630 },
  { id: 'seed-2025-12-10', timestamp: withTime(new Date(2025, 11, 10), 8, 0).toISOString(), minutes: 480 },
  { id: 'seed-2025-12-11', timestamp: withTime(new Date(2025, 11, 11), 9, 30).toISOString(), minutes: 570 },
  { id: 'seed-2025-12-12', timestamp: withTime(new Date(2025, 11, 12), 11, 0).toISOString(), minutes: 660 },
  { id: 'seed-2025-12-13', timestamp: withTime(new Date(2025, 11, 13), 9, 0).toISOString(), minutes: 540 },
  { id: 'seed-2025-12-14', timestamp: withTime(new Date(2025, 11, 14), 8, 0).toISOString(), minutes: 480 },
  { id: 'seed-2025-12-15', timestamp: withTime(new Date(2025, 11, 15), 7, 30).toISOString(), minutes: 450 },
  { id: 'seed-2025-12-16', timestamp: withTime(new Date(2025, 11, 16), 7, 20).toISOString(), minutes: 440 },
  { id: 'seed-2025-12-17', timestamp: withTime(new Date(2025, 11, 17), 7, 0).toISOString(), minutes: 420 },
  { id: 'seed-2025-12-18', timestamp: withTime(new Date(2025, 11, 18), 7, 50).toISOString(), minutes: 470 },
  { id: 'seed-2025-12-19', timestamp: withTime(new Date(2025, 11, 19), 8, 30).toISOString(), minutes: 510 },
  { id: 'seed-2025-12-20', timestamp: withTime(new Date(2025, 11, 20), 15, 0).toISOString(), minutes: 900 },
  { id: 'seed-2025-12-21', timestamp: withTime(new Date(2025, 11, 21), 7, 0).toISOString(), minutes: 420 },
  { id: 'seed-2025-12-22', timestamp: withTime(new Date(2025, 11, 22), 7, 15).toISOString(), minutes: 435 },
  { id: 'seed-2025-12-23', timestamp: withTime(new Date(2025, 11, 23), 7, 0).toISOString(), minutes: 420 },
  { id: 'seed-2025-12-24', timestamp: withTime(new Date(2025, 11, 24), 8, 0).toISOString(), minutes: 480 },
  { id: 'seed-2025-12-25', timestamp: withTime(new Date(2025, 11, 25), 10, 15).toISOString(), minutes: 615 },
].sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1));

export function WakeTrackerProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<WakeEntry[]>(seedEntries);
  const [selectedDate, setSelectedDate] = useState<Date>(now);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const stored = await loadJSON<WakeTrackerPersistedState>(STORAGE_KEY);
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

  const value = useMemo<WakeTrackerContextValue>(() => {
    const addEntry = () => {
      const minutes = minutesFromDate(selectedDate);
      const key = dateKey(selectedDate);
      setEntries((prev) => {
        const withoutDay = prev.filter((e) => dateKey(e.timestamp) !== key);
        return [
          {
            id: `w-${Date.now()}`,
            timestamp: selectedDate.toISOString(),
            minutes,
          },
          ...withoutDay,
        ].sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1));
      });
    };

    const removeEntry = (id: string) => {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    };

    const resetToSeed = () => {
      setEntries(resetSeedEntries);
      setSelectedDate(new Date(resetSeedEntries[resetSeedEntries.length - 1].timestamp));
    };

    return {
      entries,
      selectedDate,
      setSelectedDate,
      addEntry,
      removeEntry,
      resetToSeed,
    };
  }, [entries, selectedDate]);

  return <WakeTrackerContext.Provider value={value}>{children}</WakeTrackerContext.Provider>;
}

export function useWakeTracker() {
  const ctx = useContext(WakeTrackerContext);
  if (!ctx) {
    throw new Error('useWakeTracker must be used within WakeTrackerProvider');
  }
  return ctx;
}
