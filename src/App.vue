<script setup lang="ts">
import { useStepsStore } from '@/stores/steps';
import { App } from '@capacitor/app';
import { onMounted, onUnmounted } from 'vue';
import AppDock from './components/AppDock.vue';

const stepsStore = useStepsStore();

let pollInterval: ReturnType<typeof setInterval> | null = null;
let appStateListener: Awaited<ReturnType<typeof App.addListener>> | null = null;

onMounted(async () => {
  stepsStore.init();

  appStateListener = await App.addListener('appStateChange', ({ isActive }) => {
    if (isActive) {
      stepsStore.refreshTodaySteps();
    }
  });

  pollInterval = setInterval(() => {
    stepsStore.refreshTodaySteps();
  }, 60_000);
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
  appStateListener?.remove();
});
</script>

<template>
  <header>
    <AppDock />
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>
