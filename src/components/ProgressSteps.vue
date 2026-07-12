<template>
  <div
    class="radial-progress mx-auto text-sm border-10 text-center"
    :class="{
      'text-primary bg-primary-content border-primary-content':
        !stepsStore.loading && !stepsStore.error,
      'text-neutral bg-neutral-content border-neutral-content':
        stepsStore.loading && !stepsStore.error,
      'text-error bg-error-content border-error-content': stepsStore.error,
    }"
    :style="`--value: ${percent}; --size: 8rem; --thickness: 0.5rem`"
    :aria-valuenow="percent"
    role="progressbar"
  >
    <IconWalk class="mx-auto mb-1 size-6" />
    <strong>{{ value }}</strong> <span>/&thinsp;{{ max }}</span>
  </div>
</template>

<script setup lang="ts">
import { useStepsStore } from '@/stores/steps';
import { IconWalk } from '@tabler/icons-vue';
import { computed } from 'vue';

interface Props {
  value: number;
  max?: number;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  max: 25000,
});

const stepsStore = useStepsStore();

const percent = computed(() => {
  return (props.value / props.max) * 100;
});
</script>
