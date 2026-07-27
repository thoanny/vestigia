import { authService } from '@/services/authService';
import { defineStore } from 'pinia';

interface User {
  id: number;
  email: string;
}

interface AuthState {
  user: User | null;
  isReady: boolean;
  error: string | null;
  isLoading: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isReady: false,
    error: null,
    isLoading: false,
  }),
  getters: {
    isAuthenticated: (state) => state.user !== null,
  },
  actions: {
    async login(email: string, password: string) {
      this.isLoading = true;
      this.error = null;
      try {
        await authService.login(email, password);
        await this.fetchCurrentUser();
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Erreur de connexion';
        throw e;
      } finally {
        this.isLoading = false;
      }
    },

    async register(nickname: string, email: string, password: string) {
      this.isLoading = true;
      this.error = null;
      try {
        await authService.register(nickname, email, password);
        await this.login(email, password);
      } catch (e) {
        this.error = e instanceof Error ? e.message : "Erreur lors de l'inscription";
        throw e;
      } finally {
        this.isLoading = false;
      }
    },

    async logout() {
      await authService.logout();
      this.user = null;
    },

    async fetchCurrentUser() {
      const token = await authService.getToken();
      if (!token) {
        this.user = null;
        this.isReady = true;
        return;
      }

      try {
        const res = await authService.me();
        this.user = res;
      } catch {
        this.user = null;
        await authService.logout();
      } finally {
        this.isReady = true;
      }
    },
  },
});
