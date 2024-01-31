import { Database } from '../../sql';

import { Promocode } from '../../../interface/promocode'

export async function getPromocode(db: Database, promoId: number): Promise<Promocode | null> {
  const sqlQuery = 'SELECT * FROM promocodes WHERE id = ?';
  return db.executeQuery<Promocode>(sqlQuery, [promoId]);
}
