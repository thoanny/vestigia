<script setup lang="ts">
import { useAvatarAssets } from '@/composables/useAvatarAssets';
import type { AvatarConfig, AvatarLayerType } from '@/types/avatar';
import { AVATAR_LAYER_LABELS, AVATAR_LAYER_ORDER, OPTIONAL_AVATAR_LAYERS } from '@/types/avatar';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-vue';
import { computed } from 'vue';

const props = defineProps<{
  config: AvatarConfig;
}>();

const emit = defineEmits<{
  'update:config': [config: AvatarConfig];
}>();

const { idsByCategory } = useAvatarAssets();

function getOptions(category: AvatarLayerType): (string | null)[] {
  const ids = idsByCategory.value[category] ?? [];
  return OPTIONAL_AVATAR_LAYERS.includes(category) ? [null, ...ids] : ids;
}

function getDisplayName(category: AvatarLayerType): string {
  const value = props.config[category];
  if (!value) return 'Aucun';
  return value;
}

function cycle(category: AvatarLayerType, direction: 1 | -1) {
  const options = getOptions(category);
  if (options.length === 0) return;

  const currentValue = props.config[category] ?? null;
  const currentIndex = options.indexOf(currentValue);

  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const nextIndex = (safeIndex + direction + options.length) % options.length;
  const nextValue = options[nextIndex];

  emit('update:config', {
    ...props.config,
    [category]: nextValue ?? undefined,
  });
}

const rows = computed(() =>
  AVATAR_LAYER_ORDER.map((category) => ({
    category,
    label: AVATAR_LAYER_LABELS[category],
    displayName: getDisplayName(category),
    hasOptions: getOptions(category).length > 0,
  })),
);
</script>

<template>
  <div class="flex flex-col gap-2">
    <div v-for="row in rows" :key="row.category" class="flex items-center justify-between gap-3">
      <span class="flex-[0_0_90px] text-base-content/50">{{ row.label }}</span>

      <div class="flex flex-1 items-center justify-between gap-2">
        <button
          type="button"
          class="btn btn-circle btn-neutral btn-sm"
          :disabled="!row.hasOptions"
          @click="cycle(row.category, -1)"
        >
          <IconArrowLeft class="size-4" />
        </button>

        <span class="flex-1 font-semibold text-center">{{ row.displayName }}</span>

        <button
          type="button"
          class="btn btn-circle btn-neutral btn-sm"
          :disabled="!row.hasOptions"
          @click="cycle(row.category, 1)"
        >
          <IconArrowRight class="size-4" />
        </button>
      </div>
    </div>
  </div>
</template>
