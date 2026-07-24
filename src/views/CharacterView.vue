<script setup lang="ts">
import { default as GoalList } from '@/components/GoalList.vue';
import InventoryItemBlock from '@/components/InventoryItemBlock.vue';
import ProgressStatus from '@/components/ProgressStatus.vue';
import ProgressSteps from '@/components/ProgressSteps.vue';
import { useCharacterStore } from '@/stores/character';
import { useStepsStore } from '@/stores/steps';
import {
  IconAlertSmall,
  IconBoltFilled,
  IconHeartFilled,
  IconInfoSmall,
  IconPlus,
} from '@tabler/icons-vue';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const stepsStore = useStepsStore();
const characterStore = useCharacterStore();

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
    <RouterLink to="/battlepass" class="card card-xs bg-base-100 border border-base-300">
      <div class="card-body">
        <h4 class="card-title">Battle pass</h4>
        <div>TODO : widget le plus simple possible</div>
      </div>
    </RouterLink>

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

    <RouterLink to="/inventory" class="card card-sm bg-base-100 border border-base-300">
      <div class="card-body">
        <h4 class="card-title">Inventaire</h4>
        <div class="grid grid-cols-4 gap-2">
          <InventoryItemBlock
            v-for="item in characterStore.cleanInventory.slice(0, 3)"
            :key="item.data!.id"
            :item="item"
          />
          <div class="btn btn-soft btn-primary btn-square h-full w-full">
            <IconPlus />
          </div>
        </div>
      </div>
    </RouterLink>

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
        <div class="card-actions">
          <RouterLink to="/history" class="btn btn-primary btn-link btn-xs">
            Historique de pas
          </RouterLink>
        </div>
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

        <GoalList v-if="goalsTabActive === 'daily'" type="daily" />
        <GoalList v-else-if="goalsTabActive === 'weekly'" type="weekly" />
        <GoalList v-else-if="goalsTabActive === 'challenge'" type="challenge" />
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
