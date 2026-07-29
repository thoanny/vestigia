import type { AvatarLayerType } from '@/types/avatar';
import { AVATAR_LAYER_ORDER } from '@/types/avatar';
import { computed } from 'vue';

const rawSvgModules = import.meta.glob('@/assets/avatar/**/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

export function useAvatarAssets() {
  const svgIndex = computed(() => {
    const index: Record<string, Record<string, string>> = {};

    for (const [path, content] of Object.entries(rawSvgModules)) {
      const match = path.match(/avatar\/([^/]+)\/([^/]+)\.svg$/);
      if (!match) continue;
      const [, category, id] = match;
      if (typeof category === 'undefined' || typeof id === 'undefined') continue;
      if (!index[category]) index[category] = {};
      index[category][id] = content;
    }

    return index;
  });

  function getIdsForCategory(category: AvatarLayerType): string[] {
    return Object.keys(svgIndex.value[category] ?? {}).sort();
  }

  const idsByCategory = computed(() => {
    const result = {} as Record<AvatarLayerType, string[]>;
    for (const category of AVATAR_LAYER_ORDER) {
      result[category] = getIdsForCategory(category);
    }
    return result;
  });

  return { svgIndex, getIdsForCategory, idsByCategory };
}
