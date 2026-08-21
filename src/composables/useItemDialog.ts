import { type InventoryItemDetails } from '@/types/item';
import { ref } from 'vue';

const selectedItem = ref<InventoryItemDetails | null>(null);
const dialogOpen = ref<boolean>(false);

export function useItemDialog() {
  function openDialog(item: InventoryItemDetails) {
    selectedItem.value = item;
    dialogOpen.value = true;
  }

  function decrementQuantity(quantity: number) {
    if (selectedItem.value?.quantity) {
      selectedItem.value.quantity -= quantity;
    }
  }

  return { selectedItem, dialogOpen, openDialog, decrementQuantity };
}
