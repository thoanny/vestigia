import { apiClient } from '@/services/apiClient';
import { GOAL_CONFIGS, type GoalConfig, type GoalStatus } from '@/types/goal';
import { ITEMS_LIST, type InventoryItemDetails } from '@/types/item';
import { getCurrentWeekDateKeys, getDateKey } from '@/utils/date';
import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import { useStepsStore } from './steps';

interface characterState {
  goalsLoading: number[];
}
function mergeExpandInventory(items: InventoryItemDetails[]): InventoryItemDetails[] {
  const merged = new Map<number, InventoryItemDetails>();
  const nonStackable: InventoryItemDetails[] = [];

  for (const item of items) {
    if (!item.data?.stackable) {
      const count = Math.max(1, item.quantity);
      for (let i = 0; i < count; i++) {
        nonStackable.push({ ...item, quantity: 1 });
      }
      continue;
    }

    const existing = merged.get(item.item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      merged.set(item.item.id, { ...item });
    }
  }

  return [...merged.values(), ...nonStackable];
}

export const useCharacterStore = defineStore('character', {
  state: (): characterState => ({ goalsLoading: [] }),

  getters: {
    getGoalsBy(state) {
      const stepsStore = useStepsStore();
      const auth = useAuthStore();
      const userGoals = auth.user?.goals;
      return (goalType: string): GoalConfig[] => {
        return GOAL_CONFIGS.filter((goal) => goal.type === goalType).map((goal) => {
          const progress = goal.type === 'weekly' ? stepsStore.weekSteps : stepsStore.todaySteps;

          let status: GoalStatus = 'available';

          if (state.goalsLoading.find((goalId) => goal.id === goalId)) {
            status = 'loading';
          } else {
            if (progress >= goal.steps) {
              if (goal.type === 'weekly') {
                const userGoal = userGoals?.find((userGoal) => userGoal.goalId === goal.id);
                if (userGoal) {
                  status =
                    getCurrentWeekDateKeys().indexOf(userGoal.date) >= 0 ? 'rewarded' : 'achieved';
                } else {
                  status = 'achieved';
                }
              } else {
                // daily
                const userGoal = userGoals?.find((userGoal) => userGoal.goalId === goal.id);
                if (userGoal) {
                  status = userGoal.date === getDateKey() ? 'rewarded' : 'achieved';
                } else {
                  status = 'achieved';
                }
              }
            } else {
              status = 'available';
            }
          }

          return {
            ...goal,
            status,
            progress,
          };
        });
      };
    },
    cleanInventory() {
      const auth = useAuthStore();
      const inventoryItems: InventoryItemDetails[] =
        auth.user?.inventory?.map((inventory): InventoryItemDetails => {
          const details = ITEMS_LIST.find((i) => i.id === inventory.item.id);
          return { ...inventory, data: details };
        }) ?? [];
      return mergeExpandInventory(inventoryItems);
    },
  },

  actions: {
    async validateGoal(
      goalId: number,
    ): Promise<{ success: boolean; steps: number; missing: number }> {
      const auth = useAuthStore();
      const goal = GOAL_CONFIGS.find((goal) => goal.id === goalId);
      if (!goal) return { success: false, steps: 0, missing: 0 };

      const stepsStore = useStepsStore();
      const steps = goal.type === 'weekly' ? stepsStore.weekSteps : stepsStore.todaySteps;
      if (steps >= goal.steps) {
        try {
          this.goalsLoading.push(goalId);

          const req = await apiClient.post('/goals/add', {
            goalId,
            date: getDateKey(),
          });
          if (!req.ok) {
            throw new Error(req.statusText);
          }

          const res = await req.json();

          if (auth.user) {
            if (auth.user.goals) {
              const idx = auth.user?.goals.findIndex((userGoal) => userGoal.goalId === res.goal.id);
              if (idx >= 0) {
                auth.user.goals[idx] = { goalId: res.goal.id, date: res.date, status: res.status };
              } else {
                auth.user.goals.push({ goalId: res.goal.id, date: res.date, status: res.status });
              }
            } else {
              auth.user.goals = [];
              auth.user.goals.push({ goalId: res.goal.id, date: res.date, status: res.status });
            }
          }

          await this.addToInventory(res.goal.rewardItem.id, res.goal.rewardQuantity);

          return { success: true, steps: steps, missing: goal.steps - steps };
        } catch (err) {
          console.error(err);
        } finally {
          const idx = this.goalsLoading.findIndex((goal) => goal === goalId);
          if (idx >= 0) {
            this.goalsLoading.splice(idx, 1);
          }
        }
      }
      return { success: false, steps: 0, missing: 0 };
    },

    async addToInventory(itemId: number, quantity: number) {
      const auth = useAuthStore();
      if (!auth.user) return;
      if (!auth.user?.inventory) {
        auth.user.inventory = [{ item: { id: itemId }, quantity }];
      } else {
        const idx = auth.user.inventory.findIndex(
          (userInventory) => userInventory.item.id === itemId,
        );
        if (auth.user.inventory[idx]) {
          auth.user.inventory[idx].quantity += quantity;
        } else {
          auth.user.inventory.push({ item: { id: itemId }, quantity });
        }
      }
    },
    async removeFromInventory(itemId: number, quantity: number) {
      const auth = useAuthStore();
      if (!auth.user?.inventory) return;
      const idx = auth.user.inventory.findIndex(
        (userInventory) => userInventory.item.id === itemId,
      );
      if (auth.user.inventory[idx]) {
        if (auth.user.inventory[idx].quantity < quantity) {
          throw new Error('Not enought items in inventory');
        } else if (auth.user.inventory[idx].quantity === quantity) {
          auth.user.inventory.splice(idx, 1);
        } else {
          auth.user.inventory[idx].quantity -= quantity;
        }
      }
    },
  },
});
