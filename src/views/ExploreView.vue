<script setup lang="ts">
import {
  IconArrowBigDownFilled,
  IconArrowBigLeftFilled,
  IconArrowBigRightFilled,
  IconArrowBigUpFilled,
} from '@tabler/icons-vue';

const actions = ['chopping', 'fishing', 'harvesting', 'hunting', 'mining'];
</script>

<template>
  <div>
    <div class="flex flex-col items-center text-center w-full mb-4">
      <div class="font-bold">Nom de la carte</div>
      <div class="text-sm">[x, y]</div>
    </div>
    <!-- MAP -->
    <div
      class="grid grid-cols-8 grid-rows-8 gap-2 w-full h-full aspect-square max-w-[21rem] mx-auto"
    >
      <div class="row-start-1 col-start-2 col-span-6">
        <button class="btn w-full h-full btn-primary p-0">
          <IconArrowBigUpFilled class="size-5" />
        </button>
      </div>
      <div class="col-start-1 row-start-2 row-span-6">
        <button class="btn w-full h-full btn-primary p-0">
          <IconArrowBigLeftFilled class="size-5" />
        </button>
      </div>
      <div class="col-start-8 row-start-2 row-span-6">
        <button class="btn w-full h-full btn-primary p-0">
          <IconArrowBigRightFilled class="size-5" />
        </button>
      </div>
      <div class="col-start-2 row-start-8 col-span-6">
        <button class="btn w-full h-full btn-primary p-0">
          <IconArrowBigDownFilled class="size-5" />
        </button>
      </div>
      <div
        class="col-start-2 row-start-2 col-span-6 row-span-6 bg-base-300 rounded flex items-center justify-center"
      >
        MAP
      </div>
    </div>
    <!-- Actions -->
    <div class="grid grid-cols-4 gap-2 mt-4">
      <div
        class="aspect-square w-full rounded-box overflow-hidden bg-base-300 relative p-2"
        v-for="(action, a) in actions"
        :key="a"
      >
        <img :src="`/img/icons/${action}.png`" class="object-contain w-full h-full" />
      </div>
    </div>
  </div>
</template>
