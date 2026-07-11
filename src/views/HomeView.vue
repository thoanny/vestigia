<script setup lang="ts">
import AppLoading from '@/components/AppLoading.vue';
import ProgressStatus from '@/components/ProgressStatus.vue';
import ProgressSteps from '@/components/ProgressSteps.vue';
import { useStepsStore } from '@/stores/steps';
import {
  IconBoltFilled,
  IconExclamationCircle,
  IconHeartFilled,
  IconInfoSmall,
  IconRefresh,
} from '@tabler/icons-vue';

const stepsStore = useStepsStore();
</script>

<template>
  <div class="p-6 max-w-sm mx-auto text-center flex flex-col gap-4">
    <h1 class="text-xl font-bold">Vestigia — POC</h1>

    <div class="card card-sm bg-base-100 border border-base-300">
      <div class="card-body">
        <h4 class="card-title leading-none">Personnage#1234</h4>
        <div class="flex gap-2 items-center">
          <IconHeartFilled class="size-8 text-error shrink-0" stroke-width="1.5" />
          <ProgressStatus label="Santé" :value="55" :max="100" color="error" class="grow" />
        </div>
        <div class="flex gap-2 items-center">
          <IconBoltFilled class="size-8 text-warning shrink-0" stroke-width="1.5" />
          <ProgressStatus label="Énergie" :value="100" :max="1000" color="warning" class="grow" />
        </div>
      </div>
    </div>

    <AppLoading v-if="stepsStore.loading" />

    <div role="alert" class="alert alert-error alert-soft" v-else-if="stepsStore.error">
      <IconExclamationCircle class="size-6 shrink-0" />
      <span>{{ stepsStore.error }}</span>
    </div>

    <div
      class="card card-sm bg-base-100 border border-base-300"
      v-else-if="stepsStore.healthAvailable"
    >
      <div class="card-body">
        <div class="flex justify-between">
          <h4 class="card-title leading-none">Pas</h4>
          <div
            class="tooltip tooltip-left tooltip-primary"
            v-if="stepsStore.lastSyncedAt"
            :data-tip="`Synchronisé à ${stepsStore.lastSyncedAt.toLocaleTimeString('fr-FR')}`"
          >
            <button class="btn btn-circle btn-primary btn-soft btn-xs"><IconInfoSmall /></button>
          </div>
        </div>
        <ProgressSteps :value="stepsStore.todayStepsLabel" />

        <div class="card-actions mt-2">
          <button
            class="btn btn-primary btn-block"
            :disabled="stepsStore.loading"
            @click="stepsStore.refreshTodaySteps()"
          >
            <IconRefresh class="size-5" />Actualiser
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
