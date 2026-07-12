<script setup lang="ts">
import { useStepsStore } from '@/stores/steps';
import { App } from '@capacitor/app';
import { onMounted, onUnmounted } from 'vue';
import MenuFooter from './components/MenuFooter.vue';
import MenuHeader from './components/MenuHeader.vue';

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
  <div>
    <header>
      <MenuHeader />
    </header>
    <main class="p-4 top-16 h-[calc(100dvh-8rem)] relative overflow-auto">
      <RouterView />
    </main>
    <footer>
      <MenuFooter />
    </footer>
  </div>
</template>

<style scoped></style>
