import type { InventoryItem } from '@/types/item';

export interface LootEntry {
  itemId: string;
  weight: number; // poids relatif de tirage (plus haut = plus fréquent)
  minQty: number;
  maxQty: number;
}

export interface ChestDefinition {
  id: string;
  name: string;
  tier: 1 | 2 | 3 | 4 | 5;
  minRewards: number;
  maxRewards: number;
  lootTable: LootEntry[];
}

export function rollChest(chest: ChestDefinition): InventoryItem[] {
  const rewardCount =
    chest.minRewards + Math.floor(Math.random() * (chest.maxRewards - chest.minRewards + 1));

  const pool = [...chest.lootTable];
  const results: InventoryItem[] = [];

  for (let i = 0; i < rewardCount && pool.length > 0; i++) {
    const totalWeight = pool.reduce((sum, entry) => sum + entry.weight, 0);
    let roll = Math.random() * totalWeight;
    let pickedIndex = 0;

    for (let j = 0; j < pool.length; j++) {
      roll -= pool[j]!.weight;
      if (roll <= 0) {
        pickedIndex = j;
        break;
      }
    }

    const picked = pool[pickedIndex];
    const quantity =
      picked!.minQty + Math.floor(Math.random() * (picked!.maxQty - picked!.minQty + 1));

    results.push({ itemId: picked!.itemId, quantity });
    pool.splice(pickedIndex, 1); // pas de remise : un objet différent par slot
  }

  return results;
}
