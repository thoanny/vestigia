<template>
  <div
    class="radial-progress text-primary mx-auto text-sm bg-primary-content border-10 border-primary-content"
    :style="`--value: ${percent}; --size: 8rem; --thickness: 0.5rem`"
    :aria-valuenow="percent"
    role="progressbar"
  >
    <IconWalk class="mx-auto mb-1 size-6" />
    <strong>{{ value }}</strong> <span>/&thinsp;{{ max }}</span>
  </div>
</template>

<script setup lang="ts">
import { IconWalk } from '@tabler/icons-vue';
import { computed } from 'vue';

interface Props {
  value: number;
  max?: number;
}

const props = withDefaults(defineProps<Props>(), {
  max: 10000,
});

const percent = computed(() => {
  return (props.value / props.max) * 100;
});
</script>
