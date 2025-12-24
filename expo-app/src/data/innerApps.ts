import { InnerAppId } from '../types';

export const INNER_APPS: { id: InnerAppId; title: string; description: string }[] = [
  {
    id: 'reps-tracker',
    title: 'Reps Tracker',
    description: 'Track exercise repetitions with adjustable steps.',
  },
  {
    id: 'wake-tracker',
    title: 'Wake-up Tracker',
    description: 'Log your wake-up time daily and see it on a simple graph.',
  },
];
