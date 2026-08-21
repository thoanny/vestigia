<template>
  <div
    class="radial-progress mx-auto text-sm border-10 text-center"
    :class="{
      'text-primary bg-primary-content border-primary-content':
        stepsStore.initialized && !stepsStore.error,
      'text-neutral bg-neutral-content border-neutral-content':
        !stepsStore.initialized && !stepsStore.error,
      'text-error bg-error-content border-error-content': stepsStore.error,
    }"
    :style="`--value: ${percent}; --size: 8rem; --thickness: 0.5rem`"
    :aria-valuenow="percent"
    role="progressbar"
  >
    <IconWalk class="mx-auto mb-1 size-6" />
    <strong>{{ stepsStore.todaySteps }}</strong> <span>/&thinsp;{{ max }}</span>
  </div>
</template>

<script setup lang="ts">
import { useStepsStore } from '@/stores/steps';
import { IconWalk } from '@tabler/icons-vue';
import { computed } from 'vue';

interface Props {
  max?: number;
}

const props = withDefaults(defineProps<Props>(), {
  max: 25000,
});

const stepsStore = useStepsStore();

const percent = computed(() => {
  return (stepsStore.todaySteps / props.max) * 100;
});
</script>
