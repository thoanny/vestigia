export type GoalType = 'daily' | 'weekly' | 'challenge';

export type GoalStatus =
  | 'available'
  | 'unavailable'
  | 'running'
  | 'achieved'
  | 'failed'
  | 'rewarded';

export interface ActiveChallenge {
  id: string;
  startedAt: number;
  resolvedAt?: number;
  status: GoalStatus;
  steps: number;
  currentSteps: number;
  duration: number;
}

export interface GoalConfig {
  id: string;
  label: string;
  type: GoalType;
  duration: number;
  steps: number;
  progress: number;
  status?: GoalStatus;
  reward?: string;
}

export const VALIDATION_GRACE_MS = 120_000;

export const GOAL_CONFIGS: GoalConfig[] = [
  {
    id: 'test_100',
    label: 'Valider 100 pas',
    type: 'daily',
    duration: 0,
    steps: 100,
    progress: 0,
    reward: '',
  },
  {
    id: 'daily_1_000',
    label: 'Valider 1 000 pas',
    type: 'daily',
    duration: 0,
    steps: 1_000,
    progress: 0,
    reward: '',
  },
  {
    id: 'daily_2_500',
    label: 'Valider 2 500 pas',
    type: 'daily',
    duration: 0,
    steps: 2_500,
    progress: 0,
    reward: '',
  },
  {
    id: 'daily_5_000',
    label: 'Valider 5 000 pas',
    type: 'daily',
    duration: 0,
    steps: 5_000,
    progress: 0,
    reward: '',
  },
  {
    id: 'daily_10_000',
    label: 'Valider 10 000 pas',
    type: 'daily',
    duration: 0,
    steps: 10_000,
    progress: 0,
    reward: '',
  },
  {
    id: 'daily_15_000',
    label: 'Valider 15 000 pas',
    type: 'daily',
    duration: 0,
    steps: 15_000,
    progress: 0,
    reward: '',
  },
  {
    id: 'test_1_000',
    label: 'Valider 1 000 pas',
    type: 'weekly',
    duration: 0,
    steps: 1_000,
    progress: 0,
    reward: '',
  },
  {
    id: 'weekly_35_000',
    label: 'Valider 35 000 pas',
    type: 'weekly',
    duration: 0,
    steps: 35_000,
    progress: 0,
    reward: '',
  },
  {
    id: 'weekly_50_000',
    label: 'Valider 50 000 pas',
    type: 'weekly',
    duration: 0,
    steps: 50_000,
    progress: 0,
    reward: '',
  },
  {
    id: 'weekly_70_000',
    label: 'Valider 70 000 pas',
    type: 'weekly',
    duration: 0,
    steps: 70_000,
    progress: 0,
    reward: '',
  },
  {
    id: 'weekly_100_000',
    label: 'Valider 100 000 pas',
    type: 'weekly',
    duration: 0,
    steps: 100_000,
    progress: 0,
    reward: '',
  },
  {
    id: 'weekly_150_000',
    label: 'Valider 150 000 pas',
    type: 'weekly',
    duration: 0,
    steps: 150_000,
    progress: 0,
    reward: '',
  },
  {
    id: 'challenge_100',
    label: '100 pas en 1 min.',
    type: 'challenge',
    duration: 1,
    steps: 100,
    progress: 0,
    reward: '',
  },
  {
    id: 'challenge_1_200',
    label: '1 200 pas en 10 min.',
    type: 'challenge',
    duration: 10,
    steps: 1_200,
    progress: 0,
    reward: '',
  },
  {
    id: 'challenge_1_650',
    label: '1 650 pas en 15 min.',
    type: 'challenge',
    duration: 15,
    steps: 1_650,
    progress: 0,
    reward: '',
  },
  {
    id: 'challenge_2_625',
    label: '2 625 pas en 25 min.',
    type: 'challenge',
    duration: 25,
    steps: 2_625,
    progress: 0,
    reward: '',
  },
  {
    id: 'challenge_4_500',
    label: '4 500 pas en 45 min.',
    type: 'challenge',
    duration: 45,
    steps: 4_500,
    progress: 0,
    reward: '',
  },
  {
    id: 'challenge_5_700',
    label: '5 700 pas en 60 min.',
    type: 'challenge',
    duration: 60,
    steps: 5_700,
    progress: 0,
    reward: '',
  },
];
