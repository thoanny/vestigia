<template>
  <dialog ref="dialogEl" @close="$emit('update:modelValue', false)" class="modal modal-bottom">
    <div class="modal-box" v-if="selectedItem">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" v-if="!isLoading">
          ✕
        </button>
      </form>
      <div class="flex gap-3 items-center">
        <img
          :src="image.getUrl(`/items/${selectedItem.data.icon}`)"
          class="object-contain aspect-square size-10 shrink-0"
          v-if="selectedItem.data?.icon"
        />
        <h4 class="text-lg font-bold">
          {{ selectedItem.data.name }}
          <template v-if="selectedItem.quantity > 1">&times;{{ selectedItem.quantity }}</template>
        </h4>
      </div>

      <div v-if="selectedItem.data.description" v-html="selectedItem.data.description"></div>
      <div
        class="modal-action flex-col gap-2 mt-4"
        v-if="selectedItem.data?.lootable || selectedItem.data?.consumable"
      >
        <button
          class="btn btn-primary"
          v-if="selectedItem.data?.lootable"
          @click="handleOpen"
          :disabled="isLoading"
        >
          <span class="loading loading-spinner" v-if="isLoading"></span>
          {{ isLoading ? 'Veuillez patienter...' : 'Ouvrir' }}
        </button>
        <!-- TODO -->
        <div class="flex gap-2" v-if="selectedItem.data?.consumable">
          <button class="btn btn-primary grow" @click="handleConsume(1)">Consommer &times;1</button>
          <button
            class="btn btn-primary grow"
            v-if="selectedItem.quantity >= 10"
            @click="handleConsume(10)"
          >
            Consommer &times;10
          </button>
          <button class="btn btn-primary grow" @click="handleConsume('all')">Consommer tout</button>
        </div>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button v-if="!isLoading">close</button>
    </form>
  </dialog>
</template>

<script lang="ts" setup>
import { apiClient } from '@/services/apiClient';
import { imageService } from '@/services/imageService';
import { useCharacterStore } from '@/stores/character';
import type { InventoryItem } from '@/types/item';
import { ref, watch } from 'vue';

const props = defineProps(['modelValue', 'selectedItem']);
const emits = defineEmits(['update:modelValue', 'decrementQuantity']);

const dialogEl = ref<HTMLDialogElement | null>(null);
const isLoading = ref<boolean>(false);
const character = useCharacterStore();
const { addToInventory, removeFromInventory } = character;
const image = imageService;

const handleOpen = async () => {
  try {
    isLoading.value = true;
    const res = await apiClient.post('/actions/open', { itemId: props.selectedItem.item.id });
    if (!res.ok) return;

    const items = await res.json();
    items.forEach(async (item: InventoryItem) => {
      await addToInventory(item.item.id, item.quantity);
    });

    await removeFromInventory(props.selectedItem.item.id, 1);
    emits('decrementQuantity', 1);

    if (props.selectedItem.quantity <= 0) {
      dialogEl.value?.close();
    }
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const handleConsume = (quantity: number | 'all') => {
  console.log('handleConsume', quantity);
};

watch(
  () => props.modelValue,
  (isOpen: boolean) => {
    if (isOpen) dialogEl.value?.showModal();
    else dialogEl.value?.close();
  },
);
</script>
