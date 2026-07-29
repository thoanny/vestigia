<script setup lang="ts">
import { useAvatarAssets } from '@/composables/useAvatarAssets';
import type { AvatarConfig, AvatarLayerType } from '@/types/avatar';
import { AVATAR_LAYER_ORDER } from '@/types/avatar';
import { computed } from 'vue';

const props = defineProps<{
  config: AvatarConfig;
}>();

const { svgIndex } = useAvatarAssets();

const layers = computed(() => {
  return AVATAR_LAYER_ORDER.map((type) => {
    const itemId = props.config[type];
    if (!itemId) return null;

    const svg = svgIndex.value[type]?.[itemId];
    if (!svg) {
      console.warn(`[AvatarRenderer] SVG introuvable : ${type}/${itemId}`);
      return null;
    }

    return { type, svg };
  }).filter((l): l is { type: AvatarLayerType; svg: string } => l !== null);
});
</script>

<template>
  <div class="avatar-renderer w-full h-full aspect-square">
    <div
      v-for="layer in layers"
      :key="layer.type"
      :class="`avatar-layer avatar-layer-${layer.type}`"
      v-html="layer.svg"
    />
  </div>
</template>

<style scoped>
.avatar-renderer {
  position: relative;
  overflow: hidden;
}

.avatar-layer {
  position: absolute;
  inset: 0;
  left: -17%;
  top: -20%;
  width: 130%;
  height: auto;
  aspect-ratio: 1136/1533;
  opacity: 100%;
}

.avatar-layer :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
