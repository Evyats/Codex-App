export type InnerAppId = 'reps-tracker' | 'wake-tracker' | 'weight-tracker' | 'design-lab';

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

export type WeightEntry = {
  id: string;
  timestamp: string; // ISO string
  weight: number;
};
