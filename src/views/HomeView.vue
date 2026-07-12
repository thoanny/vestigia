<script setup lang="ts">
import ProgressStatus from '@/components/ProgressStatus.vue';
import ProgressSteps from '@/components/ProgressSteps.vue';
import { useStepsStore } from '@/stores/steps';
import { IconAlertSmall, IconBoltFilled, IconHeartFilled, IconInfoSmall } from '@tabler/icons-vue';

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

    <div class="card card-sm bg-base-100 border border-base-300">
      <div class="card-body">
        <div class="flex justify-between min-h-6">
          <h4 class="card-title leading-none">Pas</h4>
          <div
            class="tooltip tooltip-left tooltip-error before:max-w-[12rem]"
            v-if="stepsStore.error"
            :data-tip="stepsStore.error"
          >
            <button class="btn btn-circle btn-error btn-soft btn-xs"><IconAlertSmall /></button>
          </div>
          <div
            class="tooltip tooltip-left tooltip-primary"
            v-if="stepsStore.lastSyncedAt"
            :data-tip="`Synchronisé à ${stepsStore.lastSyncedAt.toLocaleTimeString('fr-FR')}`"
          >
            <button class="btn btn-circle btn-primary btn-soft btn-xs"><IconInfoSmall /></button>
          </div>
        </div>
        <ProgressSteps :value="stepsStore.todayStepsLabel" :loading="stepsStore.loading" />
      </div>
    </div>
  </div>
</template>
