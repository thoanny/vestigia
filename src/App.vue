<script setup lang="ts">
import { useStepsStore } from '@/stores/steps';
import { App } from '@capacitor/app';
import { onMounted, onUnmounted } from 'vue';
import MenuFooter from './components/MenuFooter.vue';
import MenuHeader from './components/MenuHeader.vue';
import { useAuthStore } from './stores/auth.ts';
import { useCharacterStore } from './stores/character.ts';

const stepsStore = useStepsStore();
const characterStore = useCharacterStore();
const authStore = useAuthStore();

let pollInterval: ReturnType<typeof setInterval> | null = null;
let appStateListener: Awaited<ReturnType<typeof App.addListener>> | null = null;

onMounted(async () => {
  stepsStore.init();
  await characterStore.restoreGoals();

  appStateListener = await App.addListener('appStateChange', async ({ isActive }) => {
    if (isActive) {
      stepsStore.refreshTotalSteps();
      await characterStore.checkChallengeTimeout();
    }
  });

  pollInterval = setInterval(() => {
    stepsStore.refreshTotalSteps();
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
    <main
      class="p-4 top-16 relative overflow-auto"
      :class="{
        'h-[calc(100dvh-8rem)]': authStore.isAuthenticated,
        'h-full bottom-0': !authStore.isAuthenticated,
      }"
    >
      <RouterView />
    </main>
    <footer>
      <MenuFooter />
    </footer>
  </div>
</template>

<style scoped></style>
