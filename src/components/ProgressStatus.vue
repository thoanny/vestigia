<template>
  <div>
    <div class="flex justify-between text-xs px-1">
      <div class="font-bold">{{ label }}</div>
      <div>
        <strong>{{ value }}</strong> / {{ max }}
      </div>
    </div>
    <progress
      class="progress h-3"
      :value="value"
      :max="max"
      :class="{
        'progress-neutral': color === 'neutral',
        'progress-primary': color === 'primary',
        'progress-secondary': color === 'secondary',
        'progress-accent': color === 'accent',
        'progress-info': color === 'info',
        'progress-success': color === 'success',
        'progress-warning': color === 'warning',
        'progress-error': color === 'error',
      }"
    ></progress>
  </div>
</template>

<script setup lang="ts">
type ProgressColor =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

interface Props {
  label: string;
  value: number;
  max?: number;
  color?: ProgressColor;
}

withDefaults(defineProps<Props>(), {
  max: 100,
  color: 'neutral',
});
</script>
