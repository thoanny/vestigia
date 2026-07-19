export type ItemType = 'currency' | 'consumable' | 'material' | 'equipment' | 'cosmetic' | 'quest';

export type Rarity = 'commun' | 'rare' | 'epique' | 'legendaire' | 'mythique';

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: Rarity;
  icon: string;
  stackable: boolean;
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
}
