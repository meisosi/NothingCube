import { Database } from '../../sql';

import { Promocode } from '../../../interface/promocode'

export async function deductPromocode(db: Database, code: string): Promise<Promocode | null> {
    const sqlQuery = `UPDATE promocodes SET activations = activations - 1 WHERE code = ?;`;
    return db.executeQuery<Promocode>(sqlQuery, [code]);
  }
  
