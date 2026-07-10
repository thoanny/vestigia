<script setup lang="ts">
import { useStepsStore } from '@/stores/steps';

const stepsStore = useStepsStore();
</script>

<template>
  <div class="p-6 max-w-sm mx-auto text-center">
    <h1 class="text-xl font-bold mb-4">Vestigia — POC pas</h1>

    <div v-if="stepsStore.loading" class="opacity-60">Chargement...</div>

    <div v-else-if="stepsStore.error" class="text-red-500 text-sm">
      {{ stepsStore.error }}
    </div>

    <div v-else-if="stepsStore.healthAvailable">
      <p class="text-4xl font-bold">{{ stepsStore.todayStepsLabel }}</p>
      <p class="text-sm opacity-60 mt-1">pas aujourd'hui</p>
      <p v-if="stepsStore.lastSyncedAt" class="text-xs opacity-40 mt-2">
        Synchronisé à {{ stepsStore.lastSyncedAt.toLocaleTimeString('fr-FR') }}
      </p>
    </div>

    <button
      class="mt-6 px-4 py-2 rounded bg-black text-white text-sm"
      :disabled="stepsStore.loading"
      @click="stepsStore.refreshTodaySteps()"
    >
      Actualiser
    </button>
  </div>
</template>
