import { healthService } from '@/services/healthService';
import { defineStore } from 'pinia';

interface StepsState {
  initialized: boolean;
  healthAvailable: boolean;
  error: string | null;
  todaySteps: number;
  weekSteps: number;
  lastSyncedAt: Date | null;
}

export const useStepsStore = defineStore('steps', {
  state: (): StepsState => ({
    initialized: false,
    healthAvailable: false,
    error: null,
    todaySteps: 0,
    weekSteps: 0,
    lastSyncedAt: null,
  }),

  getters: {
    todayStepsLabel: (state): string => {
      return state.todaySteps.toLocaleString('fr-FR');
    },
  },

  actions: {
    async init() {
      if (this.initialized) return;

      this.error = null;

      try {
        this.healthAvailable = await healthService.init();
        if (!this.healthAvailable) {
          this.error = 'API santé indisponible ou autorisation refusée.';
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : "Erreur inconnue à l'initialisation.";
        this.healthAvailable = false;
      } finally {
        this.initialized = true;
      }

      if (this.healthAvailable) {
        await this.refreshTotalSteps();
      }
    },

    async refreshTotalSteps() {
      if (!this.healthAvailable) return;

      this.error = null;

      try {
        this.todaySteps = await healthService.getStepsToday();
        this.weekSteps = await healthService.getStepsWeek();
        this.lastSyncedAt = new Date();
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Erreur lors de la lecture des pas.';
      }
    },

    reset() {
      this.initialized = false;
      this.healthAvailable = false;
      this.error = null;
      this.todaySteps = 0;
      this.weekSteps = 0;
      this.lastSyncedAt = null;
    },
  },
});
