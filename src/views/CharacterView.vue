<script setup lang="ts">
import AvatarEditModal from '@/components/AvatarEditModal.vue';
import { default as GoalList } from '@/components/GoalList.vue';
import InventoryItemBlock from '@/components/InventoryItemBlock.vue';
import ProgressStatus from '@/components/ProgressStatus.vue';
import ProgressSteps from '@/components/ProgressSteps.vue';
import { useAuthStore } from '@/stores/auth';
import { useCharacterStore } from '@/stores/character';
import { useStepsStore } from '@/stores/steps';
import {
  IconAlertSmall,
  IconArrowBigUpLines,
  IconBolt,
  IconHeart,
  IconInfoSmall,
  IconPlus,
  IconShield,
  IconSword,
} from '@tabler/icons-vue';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const stepsStore = useStepsStore();
const characterStore = useCharacterStore();
const authStore = useAuthStore();

const goalsTabs = [
  {
    id: 'daily',
    name: 'Quotidiens',
  },
  {
    id: 'weekly',
    name: 'Hebdomadaires',
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
        <div class="flex gap-3">
          <AvatarEditModal />
          <h4 class="card-title leading-none flex-1 text-lg">
            {{ authStore.user?.account?.fullnickname || 'Inconnu#0000' }}
          </h4>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-2">
          <div class="flex gap-1 items-center justify-center bg-base-300 rounded-box py-3 px-4">
            <IconShield class="size-8 shrink-0 opacity-60" stroke-width="1.5" />
            <div class="px-1 flex gap-1 items-baseline">
              <div class="text-base font-bold">
                {{ authStore.user?.character?.atk }}
              </div>
              <div>ATK</div>
            </div>
          </div>
          <div class="flex gap-1 items-center justify-center bg-base-300 rounded-box py-3 px-4">
            <IconSword class="size-8 shrink-0 opacity-60" stroke-width="1.5" />
            <div class="px-1 flex gap-1 items-baseline">
              <div class="text-base font-bold">
                {{ authStore.user?.character?.def }}
              </div>
              <div>DEF</div>
            </div>
          </div>
        </div>

        <div class="flex gap-2 items-center mt-2">
          <IconHeart class="size-8 text-error shrink-0" stroke="1.5" />
          <ProgressStatus
            label="Santé"
            :value="authStore.user?.character?.hpMin || 0"
            :max="authStore.user?.character?.hpMax || 0"
            color="error"
            class="grow"
          />
        </div>
        <div class="flex gap-2 items-center">
          <IconBolt class="size-8 text-warning shrink-0" stroke="1.5" />
          <ProgressStatus
            label="Énergie"
            :value="authStore.user?.character?.apMin || 0"
            :max="authStore.user?.character?.apMax || 0"
            color="warning"
            class="grow"
          />
        </div>
        <div class="flex gap-2 items-center">
          <IconArrowBigUpLines class="size-8 text-info shrink-0" stroke="1.5" />
          <!-- TODO : Calculer l'XP max côté serveur -->
          <ProgressStatus
            label="Expérience"
            :value="authStore.user?.character?.xp || 0"
            :max="authStore.user?.character?.xp || 0"
            color="info"
            class="grow"
          />
        </div>
      </div>
    </div>

    <div
      class="card card-sm bg-base-100 border border-base-300"
      v-if="characterStore.cleanInventory.length > 0"
    >
      <div class="card-body">
        <h4 class="card-title">Inventaire</h4>
        <div class="grid grid-cols-4 gap-2">
          <InventoryItemBlock
            v-for="(item, i) in characterStore.cleanInventory.slice(0, 3)"
            :key="i"
            :item="item"
          />
          <RouterLink
            to="/inventory"
            class="btn btn-soft btn-primary btn-square h-full w-full rounded-box"
            v-if="characterStore.cleanInventory.length > 3"
          >
            <IconPlus />
          </RouterLink>
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
        <ProgressSteps />
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
