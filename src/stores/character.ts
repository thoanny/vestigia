import { healthService } from '@/services/healthService';
import {
  GOAL_CONFIGS,
  VALIDATION_GRACE_MS,
  type ActiveChallenge,
  type GoalConfig,
  type GoalStatus,
} from '@/types/goal';
import { ITEMS_LIST, type InventoryItem } from '@/types/item';
import { getCurrentWeekDateKeys, getDateKey } from '@/utils/date';
import { Preferences } from '@capacitor/preferences';
import { defineStore } from 'pinia';
import { useStepsStore } from './steps';

interface ActivityEntry {
  date: string;
  status: GoalStatus;
}

interface characterState {
  goals: Record<string, GoalConfig[]>;
  activeChallenge: ActiveChallenge | null;
  // inventory: Record<string, InventoryItem[]>;
  activity: Record<string, ActivityEntry>;
}

const STORAGE_KEY_ACTIVE_CHALLENGE = 'vestigia_active_challenge';
const STORAGE_KEY_ACTIVITY = 'vestigia_activity';

function mergeExpandInventory(items: InventoryItem[]): InventoryItem[] {
  const merged = new Map<string, InventoryItem>();
  const nonStackable: InventoryItem[] = [];

  for (const item of items) {
    if (!item.data!.stackable) {
      const count = Math.max(1, item.quantity);
      for (let i = 0; i < count; i++) {
        nonStackable.push({ ...item, quantity: 1 });
      }
      continue;
    }

    const existing = merged.get(item.itemId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      merged.set(item.itemId, { ...item });
    }
  }

  return [...merged.values(), ...nonStackable];
}

export const useCharacterStore = defineStore('character', {
  state: (): characterState => ({
    goals: {},
    activeChallenge: null,
    // inventory: {},
    activity: {},
  }),

  getters: {
    getGoalsBy(state) {
      const stepsStore = useStepsStore();
      return (goalType: string): GoalConfig[] => {
        return GOAL_CONFIGS.filter((goal) => goal.type === goalType).map((goal) => {
          let progress = 0;
          if (goal.type === 'challenge' && goal.id === state.activeChallenge?.id) {
            progress = state.activeChallenge.currentSteps;
          } else if (goal.type !== 'challenge') {
            progress = goal.type === 'weekly' ? stepsStore.weekSteps : stepsStore.todaySteps;
          }

          let status: GoalStatus = 'available';
          if (goal.type === 'challenge') {
            if (state.activity[goal.id] && state.activity[goal.id]?.date === getDateKey()) {
              status = state.activity[goal.id]!.status;
            } else if (state.activeChallenge) {
              if (goal.id === state.activeChallenge.id) {
                if (state.activeChallenge.currentSteps >= goal.steps) {
                  status = 'achieved';
                } else {
                  status = state.activeChallenge.status;
                }
              } else {
                status = 'unavailable';
              }
            }
          } else {
            if (progress >= goal.steps) {
              if (goal.type === 'weekly') {
                if (state.activity[goal.id]?.date) {
                  status =
                    getCurrentWeekDateKeys().indexOf(state.activity[goal.id]!.date) >= 0
                      ? 'rewarded'
                      : 'achieved';
                } else {
                  status = 'achieved';
                }
              } else {
                status = state.activity[goal.id]?.date === getDateKey() ? 'rewarded' : 'achieved';
              }
            } else {
              status = 'available';
            }
          }

          return {
            ...goal,
            status: status,
            progress: progress,
          };
        });
      };
    },
    activeChallengeDeadline(): number | null {
      if (!this.activeChallenge) return null;
      return this.activeChallenge.startedAt + this.activeChallenge.duration;
    },
    cleanInventory() {
      const inventoryItems = [
        { itemId: 'coin', quantity: 100 },
        { itemId: 'gem', quantity: 20 },
        { itemId: 'gold', quantity: 10 },
        { itemId: 'chest', quantity: 3 },
        { itemId: 'chest', quantity: 10 },
        { itemId: 'gold', quantity: 50 },
        { itemId: 'chest', quantity: 1 },
      ].map((item) => {
        const details = ITEMS_LIST.find((i) => i.id === item.itemId);
        return { ...item, data: details };
      });

      return mergeExpandInventory(inventoryItems);
    },
  },

  actions: {
    async restoreGoals() {
      console.log('restore goals');

      const [activeChallengeResult, activityResult] = await Promise.all([
        Preferences.get({ key: STORAGE_KEY_ACTIVE_CHALLENGE }),
        Preferences.get({ key: STORAGE_KEY_ACTIVITY }),
      ]);

      if (activityResult.value) {
        this.activity = JSON.parse(activityResult.value);
      }

      if (activeChallengeResult.value) {
        console.log('restored');
        this.activeChallenge = JSON.parse(activeChallengeResult.value);
        if (this.activeChallenge) {
          this.refreshChallengeSteps();
        }

        await this.checkChallengeTimeout();
        await this.refreshChallengeSteps();
      }
    },

    async addOrUpdateActivity(id: string, status: GoalStatus) {
      this.activity[id] = {
        date: getDateKey(),
        status,
      };

      await Preferences.set({ key: STORAGE_KEY_ACTIVITY, value: JSON.stringify(this.activity) });
    },

    async refreshChallengeSteps() {
      if (!this.activeChallenge || this.activeChallenge.status !== 'running') return;
      console.log('refreshChallengeSteps');
      this.activeChallenge.currentSteps = await healthService.getStepsBetween(
        new Date(this.activeChallenge.startedAt),
        new Date(Date.now()),
      );
    },

    async checkChallengeTimeout() {
      if (
        !this.activeChallenge ||
        this.activeChallenge.status !== 'running' ||
        !this.activeChallengeDeadline
      )
        return;

      if (Date.now() < this.activeChallengeDeadline + VALIDATION_GRACE_MS) return;

      this.addOrUpdateActivity(this.activeChallenge.id, 'failed');
      this.activeChallenge = null;

      await Preferences.set({
        key: STORAGE_KEY_ACTIVE_CHALLENGE,
        value: JSON.stringify(this.activeChallenge),
      });
    },

    startChallenge(challengeId: string): boolean {
      console.log('start challenge', this.activeChallenge);

      if (this.activeChallenge) return false;

      const goal = GOAL_CONFIGS.find((goal) => goal.id === challengeId);
      if (!goal) return false;

      console.log('challenge started');

      const challenge: ActiveChallenge = {
        id: challengeId,
        startedAt: Date.now(),
        status: 'running',
        steps: goal.steps,
        currentSteps: 0,
        duration: goal.duration * 60_000,
      };
      this.activeChallenge = challenge;
      Preferences.set({ key: STORAGE_KEY_ACTIVE_CHALLENGE, value: JSON.stringify(challenge) });
      return true;
    },

    async validateGoal(
      goalId: string,
    ): Promise<{ success: boolean; steps: number; missing: number }> {
      console.log('validate', goalId);
      const goal = GOAL_CONFIGS.find((goal) => goal.id === goalId);
      if (!goal) return { success: false, steps: 0, missing: 0 };

      if (goal.type === 'challenge') {
      } else {
        const stepsStore = useStepsStore();
        const steps = goal.type === 'weekly' ? stepsStore.weekSteps : stepsStore.todaySteps;
        if (steps >= goal.steps) {
          await this.addOrUpdateActivity(goalId, 'rewarded');
          return { success: true, steps: steps, missing: goal.steps - steps };
        }
        return { success: false, steps: 0, missing: 0 };
      }

      return { success: false, steps: 0, missing: 0 };
      // TODO : Chercher le type de challenge :
      // Si challenge, vérifier si objectif atteint sur le laps de temps
      // Si autre, vérifier si nombre de pas requis dans la fenêtre (aujourd'hui ou semaine)
      // Ajouter dans l'inventaire un coffre
    },
  },
});
