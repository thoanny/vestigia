<template>
  <div>
    <h1>Inventaire</h1>
    <div class="grid grid-cols-4 gap-2 mt-2">
      <div
        v-for="item in characterStore.cleanInventory"
        :key="item.data!.id"
        class="aspect-square w-full rounded-box overflow-hidden bg-base-300 p-2 relative"
      >
        <img :src="item.data!.icon" class="object-contain w-full h-full" />
        <span
          class="badge badge-neutral badge-xs absolute bottom-1 right-1 px-1"
          v-if="item.quantity > 1"
        >
          {{ item.quantity }}
        </span>
      </div>
    </div>
    <!-- <pre>{{ inventory }}</pre> -->
  </div>
</template>

<script setup lang="ts">
import { useCharacterStore } from '@/stores/character';

const characterStore = useCharacterStore();
// function mergeExpandInventory(items: InventoryItem[]): InventoryItem[] {
//   const merged = new Map<string, InventoryItem>();
//   const nonStackable: InventoryItem[] = [];

//   for (const item of items) {
//     if (!item.data!.stackable) {
//       const count = Math.max(1, item.quantity);
//       for (let i = 0; i < count; i++) {
//         nonStackable.push({ ...item, quantity: 1 });
//       }
//       continue;
//     }

//     const existing = merged.get(item.itemId);
//     if (existing) {
//       existing.quantity += item.quantity;
//     } else {
//       merged.set(item.itemId, { ...item });
//     }
//   }

//   return [...merged.values(), ...nonStackable];
// }

// const inventory = computed(() => {
//   const inventoryItems = [
//     { itemId: 'gold', quantity: 100 },
//     { itemId: 'chest', quantity: 3 },
//     { itemId: 'chest', quantity: 10 },
//     { itemId: 'gold', quantity: 50 },
//     { itemId: 'chest', quantity: 1 },
//     { itemId: 'gem', quantity: 20 },
//   ].map((item) => {
//     const details = ITEMS_LIST.find((i) => i.id === item.itemId);
//     return { ...item, data: details };
//   });

//   return mergeExpandInventory(inventoryItems);
// });
</script>
