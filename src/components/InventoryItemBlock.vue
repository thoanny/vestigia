<template>
  <div class="aspect-square w-full rounded-box overflow-hidden bg-base-300 p-2 relative">
    <img :src="item.data!.icon" class="object-contain w-full h-full" />
    <span
      class="badge badge-neutral badge-xs absolute bottom-1 right-1 px-1"
      v-if="item.quantity > 1"
    >
      {{ item.quantity }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps(['item']);
</script>
