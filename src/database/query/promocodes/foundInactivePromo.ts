import { Database } from '../../sql';

import { expressPromocode } from '../../../interface/expressPromo';

export async function foundInactivePromo(db: Database, promoCode: string): Promise<expressPromocode | null> {
  const sqlQuery = 'SELECT * FROM inactive_promocodes WHERE code = ?';
  return db.executeQuery<expressPromocode>(sqlQuery, [promoCode]);
}
