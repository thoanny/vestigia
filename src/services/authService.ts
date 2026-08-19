import { Preferences } from '@capacitor/preferences';
import { apiClient } from './apiClient';

const TOKEN_KEY = 'vestigia_token';
const REFRESH_KEY = 'vestigia_refresh_token';

export const authService = {
  async login(email: string, password: string) {
    const res = await apiClient.post('~/token', { email, password });
    if (!res.ok) throw new Error('Identifiants invalides');

    const data = await res.json();
    await Preferences.set({ key: TOKEN_KEY, value: data.token });
    await Preferences.set({ key: REFRESH_KEY, value: data.refresh_token });
  },

  async getToken() {
    const { value } = await Preferences.get({ key: TOKEN_KEY });
    return value;
  },

  async refresh() {
    await Preferences.remove({ key: TOKEN_KEY });

    const { value: refreshToken } = await Preferences.get({ key: REFRESH_KEY });
    if (!refreshToken) throw new Error('No refresh token');

    const res = await apiClient.post('~/token/refresh', { refresh_token: refreshToken });

    if (!res.ok) throw new Error('Refresh failed');

    const data = await res.json();
    await Preferences.set({ key: TOKEN_KEY, value: data.token });
    await Preferences.set({ key: REFRESH_KEY, value: data.refresh_token });
    return data.token;
  },

  async logout() {
    await Preferences.remove({ key: TOKEN_KEY });
    await Preferences.remove({ key: REFRESH_KEY });
  },

  async register(nickname: string, email: string, password: string) {
    const res = await apiClient.post('~/user/create', { nickname, email, password });
    if (!res.ok) throw new Error('Inscription impossible');
  },

  async me() {
    const res = await apiClient.get('/@me');
    if (!res.ok) throw new Error('Session invalide');
    return res.json();
  },
};
