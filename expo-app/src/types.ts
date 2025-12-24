export type InnerAppId = 'reps-tracker' | 'wake-tracker';

export type Exercise = {
  id: string;
  name: string;
  reps: number;
  step: number;
};

export type WakeEntry = {
  id: string;
  timestamp: string; // ISO string
  minutes: number; // minutes after midnight
};
