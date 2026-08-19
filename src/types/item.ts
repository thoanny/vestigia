import itemsData from '@/data/items.json';
import { z } from 'zod';

const ItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  type: z.enum(['currency', 'consumable', 'material', 'equipment', 'cosmetic', 'quest']),
  rarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']),
  icon: z.string(),
  stackable: z.boolean(),
  lootable: z.boolean(),
  consumable: z.boolean(),
});

export type Item = z.infer<typeof ItemSchema>;

export interface InventoryItem {
  itemId: number;
  quantity: number;
  data?: Item;
}

export const ITEMS_LIST: Item[] = z.array(ItemSchema).parse(itemsData);
