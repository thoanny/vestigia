import { healthService } from '@/services/healthService';
import { defineStore } from 'pinia';

interface StepsState {
  initialized: boolean;
  healthAvailable: boolean;
  loading: boolean;
  error: string | null;
  todaySteps: number;
  lastSyncedAt: Date | null;
}

export const useStepsStore = defineStore('steps', {
  state: (): StepsState => ({
    initialized: false,
    healthAvailable: false,
    loading: false,
    error: null,
    todaySteps: 0,
    lastSyncedAt: null,
  }),

  getters: {
    todayStepsLabel: (state): number => {
      return Number(state.todaySteps.toLocaleString('fr-FR'));
    },
  },

  actions: {
    async init() {
      if (this.initialized) return;

      this.loading = true;
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
        this.loading = false;
      }

      if (this.healthAvailable) {
        await this.refreshTodaySteps();
      }
    },

    async refreshTodaySteps() {
      if (!this.healthAvailable) return;

      this.loading = true;
      this.error = null;

      try {
        this.todaySteps = await healthService.getStepsToday();
        this.lastSyncedAt = new Date();
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Erreur lors de la lecture des pas.';
      } finally {
        this.loading = false;
      }
    },

    reset() {
      this.initialized = false;
      this.healthAvailable = false;
      this.loading = false;
      this.error = null;
      this.todaySteps = 0;
      this.lastSyncedAt = null;
    },
  },
});
