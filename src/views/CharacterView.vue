<script setup lang="ts">
import ProgressStatus from '@/components/ProgressStatus.vue';
import ProgressSteps from '@/components/ProgressSteps.vue';
import { useStepsStore } from '@/stores/steps';
import {
  IconAlertSmall,
  IconBoltFilled,
  IconCheckFilled,
  IconHeartFilled,
  IconInfoSmall,
  IconStopwatch,
  IconWalk,
} from '@tabler/icons-vue';
import { ref } from 'vue';

const stepsStore = useStepsStore();

const goalsTabs = [
  {
    id: 'daily',
    name: 'Quotidiens',
  },
  {
    id: 'weekly',
    name: 'Hebdomadaires',
  },
  {
    id: 'challenge',
    name: 'Défis',
  },
];
const goalsTabActive = ref(goalsTabs[0]!.id);
</script>

<template>
  <div class="flex flex-col gap-4">
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
        <ProgressSteps :value="stepsStore.todaySteps" :loading="stepsStore.loading" />
      </div>
    </div>

    <div class="card card-sm bg-base-100 border border-base-300">
      <div class="card-body">
        <h4 class="card-title leading-none">Objectifs</h4>

        <div role="tablist" class="tabs tabs-border tabs-sm -mx-2">
          <a
            role="tab"
            class="tab"
            v-for="tab in goalsTabs"
            :key="tab.id"
            @click="goalsTabActive = tab.id"
            :class="{
              'tab-active': goalsTabActive === tab.id,
            }"
            >{{ tab.name }}</a
          >
        </div>

        <ul
          class="list border-t border-base-content/5 -mt-2 -mb-4 -mx-4"
          v-if="goalsTabActive === 'daily'"
        >
          <li
            class="list-row py-3"
            v-for="i in [1_000, 2_500, 5_000, 10_000, 15_000 /*, 20_000, 25_000*/]"
            :key="i"
          >
            <div>
              <div
                class="size-10 bg-primary/20 text-primary rounded flex items-center justify-center"
              >
                <IconWalk />
              </div>
            </div>
            <div class="flex flex-col justify-center gap-1">
              <div class="flex justify-between items-baseline">
                <div class="font-semibold text-xs">Valider {{ i }} pas</div>
                <div class="text-xs">
                  {{ Math.round((stepsStore.todaySteps / i) * 100) }}&thinsp;%
                </div>
              </div>
              <progress
                class="progress progress-primary h-1"
                :value="stepsStore.todaySteps"
                :max="i"
              ></progress>
            </div>
            <button class="btn btn-square btn-success" :disabled="stepsStore.todaySteps < i">
              <IconCheckFilled class="size-6" />
            </button>
          </li>
        </ul>

        <ul
          class="list border-t border-base-content/5 -mt-2 -mb-4 -mx-4"
          v-else-if="goalsTabActive === 'weekly'"
        >
          <li
            class="list-row py-3"
            v-for="i in [1_000, 2_500, 5_000, 10_000, 15_000 /*, 20_000, 25_000*/]"
            :key="i"
          >
            <div>
              <div
                class="size-10 bg-primary/20 text-primary rounded flex items-center justify-center"
              >
                <IconWalk />
              </div>
            </div>
            <div class="flex flex-col justify-center gap-1">
              <div class="flex justify-between items-baseline">
                <div class="font-semibold text-xs">Valider {{ i * 7 }} pas</div>
                <div class="text-xs">
                  {{ Math.round((stepsStore.todaySteps / i) * 7 * 100) }}&thinsp;%
                </div>
              </div>
              <progress
                class="progress progress-primary h-1"
                :value="stepsStore.todaySteps"
                :max="i * 7"
              ></progress>
            </div>
            <button class="btn btn-square btn-success" :disabled="stepsStore.todaySteps < i * 7">
              <IconCheckFilled class="size-6" />
            </button>
          </li>
        </ul>
        <ul
          class="list border-t border-base-content/5 -mt-2 -mb-4 -mx-4"
          v-else-if="goalsTabActive === 'challenge'"
        >
          <li
            class="list-row py-3"
            v-for="(time, steps) in { 500: 15, 600: 15, 1_500: 25, 2_500: 45, 5_500: 60 }"
            :key="steps"
          >
            <div>
              <div
                class="size-10 bg-primary/20 text-primary rounded flex items-center justify-center"
              >
                <IconWalk />
              </div>
            </div>
            <div class="flex flex-col justify-center gap-1">
              <div class="flex justify-between items-baseline">
                <div class="font-semibold text-xs">{{ steps }} pas en {{ time }}&thinsp;min.</div>
                <div class="text-xs">
                  {{ Math.round((stepsStore.todaySteps / parseInt(steps)) * 100) }}&thinsp;%
                </div>
              </div>
              <progress
                class="progress progress-primary h-1"
                :value="stepsStore.todaySteps"
                :max="steps"
              ></progress>
            </div>
            <button class="btn btn-square btn-success">
              <IconStopwatch class="size-6" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-row:after {
  left: 0;
  right: 0;
}
</style>
