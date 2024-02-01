import { Database } from '../../sql';

import { Inventory } from '../../../interface/inventory'

export async function updateUserInventory(db: Database, userId: number, type: keyof Omit<Inventory, 'user_id'>, value: number): Promise<Inventory | null> {
    const sqlQuery = `UPDATE users_inventory SET ${type} = ${type} + ? WHERE user_id = ?;`;
    return db.executeQuery<Inventory>(sqlQuery, [value, userId]);
  }
  
