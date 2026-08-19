<template>
  <ul class="list border-t border-base-content/5 -mt-2 -mb-4 -mx-4">
    <li class="list-row py-3" v-for="goal in characterStore.getGoalsBy(type)" :key="goal.id">
      <div>
        <div class="size-8 bg-primary/20 text-primary rounded flex items-center justify-center">
          <IconWalk class="size-6" />
        </div>
      </div>
      <div class="flex flex-col justify-center gap-1">
        <div class="flex justify-between items-baseline">
          <div class="font-semibold text-xs">{{ goal.label }}</div>
          <div class="flex gap-2">
            <div class="text-xs">
              {{ Math.min(Math.round((goal.progress / goal.steps) * 100), 100) }}&thinsp;%
            </div>
          </div>
        </div>
        <progress
          class="progress progress-primary h-1"
          :value="goal.progress"
          :max="goal.steps"
        ></progress>
      </div>
      <!-- Daily/Weekly -->
      <button
        class="btn btn-square btn-sm"
        :class="{
          'btn-primary': goal.status !== 'rewarded',
          'btn-success btn-soft': goal.status === 'rewarded',
        }"
        @click="
          () => {
            if (goal.status === 'achieved') {
              characterStore.validateGoal(goal.id);
            }
          }
        "
        v-if="goal.type !== 'challenge'"
        :disabled="goal.status !== 'achieved' && goal.status !== 'rewarded'"
      >
        <IconCheck class="size-5" v-if="goal.status !== 'achieved'" />
        <IconGift class="size-5" v-else />
      </button>
      <!-- Challenge -->
      <button
        class="btn btn-square btn-sm"
        :class="{
          'btn-success btn-soft': ['rewarded', 'achieved'].indexOf(goal.status!) >= 0,
          'btn-primary': ['rewarded', 'achieved'].indexOf(goal.status!) < 0,
        }"
        :disabled="['available', 'running'].indexOf(goal.status!) < 0"
        v-else
      >
        <IconStopwatch v-if="goal.status === 'available'" class="size-5" />
        <IconGift v-else-if="goal.status === 'achieved'" class="size-5" />
        <IconCheck v-else-if="goal.status === 'rewarded'" class="size-5" />
        <IconX v-else-if="goal.status === 'failed'" class="size-5" />
        <IconLock v-else-if="goal.status === 'unavailable'" class="size-5" />
        <IconPlayerPlay v-else-if="goal.status === 'running'" class="size-5" />
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useCharacterStore } from '@/stores/character';
import {
  IconCheck,
  IconGift,
  IconLock,
  IconPlayerPlay,
  IconStopwatch,
  IconWalk,
  IconX,
} from '@tabler/icons-vue';

defineProps(['type']);

const characterStore = useCharacterStore();
</script>
