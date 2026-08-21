<template>
  <div>
    <h1>Inventaire</h1>
    <div class="grid grid-cols-4 gap-2 mt-2" v-if="characterStore.cleanInventory.length > 0">
      <InventoryItemBlock
        v-for="(item, i) in characterStore.cleanInventory"
        :key="i"
        :item="item"
      />
    </div>
    <div v-else><em>Votre inventaire est vide...</em></div>
  </div>
</template>

<script setup lang="ts">
import InventoryItemBlock from '@/components/InventoryItemBlock.vue';
import { useCharacterStore } from '@/stores/character';

const characterStore = useCharacterStore();
</script>
