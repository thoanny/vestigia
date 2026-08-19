import { GOAL_CONFIGS, type GoalConfig, type GoalStatus } from '@/types/goal';
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
  // inventory: Record<string, InventoryItem[]>;
  activity: Record<string, ActivityEntry>;
}

const STORAGE_KEY_ACTIVITY = 'vestigia_activity';

function mergeExpandInventory(items: InventoryItem[]): InventoryItem[] {
  const merged = new Map<number, InventoryItem>();
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
    // inventory: {},
    activity: {},
  }),

  getters: {
    getGoalsBy(state) {
      const stepsStore = useStepsStore();
      return (goalType: string): GoalConfig[] => {
        return GOAL_CONFIGS.filter((goal) => goal.type === goalType).map((goal) => {
          const progress = goal.type === 'weekly' ? stepsStore.weekSteps : stepsStore.todaySteps;

          let status: GoalStatus = 'available';
          if (goal.type === 'challenge') {
            status = state.activity[goal.id]!.status;
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
    cleanInventory() {
      const inventoryItems = [
        { itemId: 1, quantity: 100 },
        { itemId: 2, quantity: 20 },
        { itemId: 3, quantity: 3 },
        { itemId: 4, quantity: 10 },
        { itemId: 5, quantity: 50 },
        { itemId: 6, quantity: 1 },
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

      const activityResult = await Preferences.get({ key: STORAGE_KEY_ACTIVITY });

      if (activityResult.value) {
        this.activity = JSON.parse(activityResult.value);
      }
    },

    async addOrUpdateActivity(id: number, status: GoalStatus) {
      this.activity[id] = {
        date: getDateKey(),
        status,
      };

      await Preferences.set({ key: STORAGE_KEY_ACTIVITY, value: JSON.stringify(this.activity) });
    },

    async validateGoal(
      goalId: number,
    ): Promise<{ success: boolean; steps: number; missing: number }> {
      console.log('validate', goalId);
      const goal = GOAL_CONFIGS.find((goal) => goal.id === goalId);
      if (!goal) return { success: false, steps: 0, missing: 0 };

      const stepsStore = useStepsStore();
      const steps = goal.type === 'weekly' ? stepsStore.weekSteps : stepsStore.todaySteps;
      if (steps >= goal.steps) {
        await this.addOrUpdateActivity(goalId, 'rewarded');
        return { success: true, steps: steps, missing: goal.steps - steps };
      }
      return { success: false, steps: 0, missing: 0 };

      // TODO : Chercher le type de challenge :
      // Si challenge, vérifier si objectif atteint sur le laps de temps
      // Si autre, vérifier si nombre de pas requis dans la fenêtre (aujourd'hui ou semaine)
      // Ajouter dans l'inventaire un coffre
    },
  },
});
