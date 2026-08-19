import goalsData from '@/data/goals.json';
import { z } from 'zod';

export type GoalType = 'daily' | 'weekly' | 'challenge';

export type GoalStatus =
  | 'available'
  | 'unavailable'
  | 'running'
  | 'achieved'
  | 'failed'
  | 'rewarded';

export const VALIDATION_GRACE_MS = 120_000;

const GoalSchema = z.object({
  id: z.number(),
  label: z.string(),
  type: z.enum(['daily', 'weekly', 'challenge']),
  duration: z.number(),
  steps: z.number(),
  progress: z.number().default(0),
  status: z
    .enum(['available', 'unavailable', 'running', 'achieved', 'failed', 'rewarded'])
    .optional(),
  rewardItem: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullable(),
  rewardQuantity: z.number(),
});

export type GoalConfig = z.infer<typeof GoalSchema>;

export const GOAL_CONFIGS: GoalConfig[] = z.array(GoalSchema).parse(goalsData);
