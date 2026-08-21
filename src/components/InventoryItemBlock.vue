<template>
  <div
    class="aspect-square w-full rounded-box overflow-hidden bg-base-300 p-2 relative"
    @click="openDialog(item)"
  >
    <img
      :src="image.getUrl(`/items/${item.data.icon}`)"
      class="object-contain w-full h-full"
      v-if="item.data.icon"
    />
    <span class="flex items-center justify-center text-center w-full h-full" v-else>{{
      item.data.name
    }}</span>
    <span
      class="badge badge-neutral badge-xs absolute bottom-1 right-1 px-1"
      v-if="item.quantity > 1"
    >
      {{ item.quantity }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useItemDialog } from '@/composables/useItemDialog';
import { imageService } from '@/services/imageService';

defineProps(['item']);

const { openDialog } = useItemDialog();
const image = imageService;
</script>
