<script setup lang="ts">
import { useStepsStore } from '@/stores/steps';
import { onMounted } from 'vue';
import AppDock from './components/AppDock.vue';

const stepsStore = useStepsStore();

onMounted(() => {
  stepsStore.init();
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
