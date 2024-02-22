import { Database } from '../../sql';

import { Promocode } from '../../../interface/promocode'

export async function deletePromo(db: Database, code: string): Promise<Promocode | null> {
  const sqlQuery = 'DELETE FROM promocodes WHERE code = ?';
  return db.executeQuery<Promocode>(sqlQuery, [code]);
}
