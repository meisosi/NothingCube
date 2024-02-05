import { Database } from '../../sql';

import { Promocode } from '../../../interface/promocode'

export async function getPromocode(db: Database, promoCode: string): Promise<Promocode | null> {
  const sqlQuery = 'SELECT * FROM promocodes WHERE code = ?';
  return db.executeQuery<Promocode>(sqlQuery, [promoCode]);
}
