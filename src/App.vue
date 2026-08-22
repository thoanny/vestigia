<script setup lang="ts">
import ItemDialog from '@/components/ItemDialog.vue';
import MenuFooter from '@/components/MenuFooter.vue';
import MenuHeader from '@/components/MenuHeader.vue';
import { useItemDialog } from '@/composables/useItemDialog.ts';
import { useAuthStore } from '@/stores/auth.ts';
import { useStepsStore } from '@/stores/steps';
import { App } from '@capacitor/app';
import { onMounted, onUnmounted } from 'vue';

const stepsStore = useStepsStore();
const authStore = useAuthStore();

const { dialogOpen, selectedItem, decrementQuantity } = useItemDialog();

let pollInterval: ReturnType<typeof setInterval> | null = null;
let appStateListener: Awaited<ReturnType<typeof App.addListener>> | null = null;

onMounted(async () => {
  stepsStore.init();

  appStateListener = await App.addListener('appStateChange', async ({ isActive }) => {
    if (isActive) {
      stepsStore.refreshTotalSteps();
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
      <ItemDialog
        v-model="dialogOpen"
        :selected-item="selectedItem"
        @decrement-quantity="decrementQuantity"
      />
    </main>
    <footer>
      <MenuFooter />
    </footer>
  </div>
</template>

<style scoped></style>
