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
  data?: Item;
}

export const ITEMS_LIST: Item[] = [
  {
    id: 'coin',
    name: 'Or',
    description: 'Description...',
    type: 'currency',
    rarity: 'rare',
    icon: '/img/icons/coin.png',
    stackable: true,
  },
  {
    id: 'gold',
    name: "Barre d'or",
    description: 'Description...',
    type: 'currency',
    rarity: 'rare',
    icon: '/img/icons/gold.png',
    stackable: true,
  },
  {
    id: 'gem',
    name: 'Gemmes',
    description: 'Description gemmes...',
    type: 'currency',
    rarity: 'rare',
    icon: '/img/icons/gem.png',
    stackable: true,
  },
  {
    id: 'chest',
    name: 'Coffre',
    description: 'Description coffre...',
    type: 'consumable',
    rarity: 'rare',
    icon: '/img/icons/chest.png',
    stackable: false,
  },
];
