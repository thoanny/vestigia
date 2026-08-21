<template>
  <div>
    <h1>Inventaire</h1>
    <div class="grid grid-cols-4 gap-2 mt-2">
      <InventoryItemBlock
        v-for="(item, i) in characterStore.cleanInventory"
        :key="i"
        :item="item"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import InventoryItemBlock from '@/components/InventoryItemBlock.vue';
import { useCharacterStore } from '@/stores/character';

const characterStore = useCharacterStore();
</script>
