import { Database } from '../../sql';

import { Inventory } from '../../../interface/inventory'

export async function createUserInventory(db: Database, userId: number): Promise<Inventory | null> {
    const sqlQuery = "INSERT INTO users_inventory" + 
    "(user_id, coins, rolls, gems, big_gems, moons, refs)" +
    "VALUES (?, 0, 1, 0, 0, 0, 0";
  return db.executeQuery<Inventory>(sqlQuery, [userId]);
}
