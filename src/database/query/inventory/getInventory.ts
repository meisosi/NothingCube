import { Database } from '../../sql';

import { Inventory } from '../../../interface/inventory'

export async function getUserInventory(db: Database, userId: number): Promise<Inventory | null> {
  const sqlQuery = 'SELECT * FROM users_inventory WHERE user_id = ?';
  return db.executeQuery<Inventory>(sqlQuery, [userId]);
}
