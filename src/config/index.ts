import { Capacitor } from '@capacitor/core';

function resolveApiBaseUrl(): string {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL;
  }

  const platform = Capacitor.getPlatform(); // 'web' | 'android' | 'ios'

  if (platform === 'android') {
    return `http://${import.meta.env.VITE_ANDROID_EMULATOR}:3000`;
  }

  if (platform === 'ios') {
    return `http://${import.meta.env.VITE_LOCAL_IP}:3000`;
  }

  return import.meta.env.VITE_API_URL;
}

export const API_BASE_URL = resolveApiBaseUrl();
