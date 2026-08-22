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
          <div class="font-semibold text-xs">{{ goal.label }} ({{ goal.status }})</div>
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
        :disabled="goal.status !== 'achieved' && goal.status !== 'rewarded'"
      >
        <span class="loading loading-spinner loading-sm" v-if="goal.status === 'loading'"></span>
        <IconCheck class="size-5" v-else-if="goal.status !== 'achieved'" />
        <IconGift class="size-5" v-else />
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useCharacterStore } from '@/stores/character';
import { IconCheck, IconGift, IconWalk } from '@tabler/icons-vue';

defineProps(['type']);

const characterStore = useCharacterStore();
</script>
