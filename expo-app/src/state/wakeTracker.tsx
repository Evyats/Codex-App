import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

import { WakeEntry } from '../types';

type WakeTrackerContextValue = {
  entries: WakeEntry[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  addEntry: () => void;
  removeEntry: (id: string) => void;
};

const WakeTrackerContext = createContext<WakeTrackerContextValue | null>(null);

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

export function WakeTrackerProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<WakeEntry[]>(seedEntries);
  const [selectedDate, setSelectedDate] = useState<Date>(now);

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

    return {
      entries,
      selectedDate,
      setSelectedDate,
      addEntry,
      removeEntry,
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
