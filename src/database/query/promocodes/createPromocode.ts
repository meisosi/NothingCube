import { Database } from '../../sql';

import { Promocode } from '../../../interface/promocode'

export async function createPromocode(db: Database, promocode: Promocode): Promise<Promocode | null> {
    if(!promocode.code) {
        throw new Error("Code is required for create a new promocode")
    }
    promocode.id = -1;
    promocode.type = promocode.type || null;
    promocode.count = promocode.count || 0;
    promocode.expires_at = promocode.expires_at || true;
    const sqlQuery = "INSERT INTO promocodes (id, code, type, count, expires_at) VALUES (?, ?, ?, ?, ?)";
    return db.executeQuery(sqlQuery, [
        promocode.id,
        promocode.code,
        promocode.type,
        promocode.count,
        promocode.expires_at,
    ]);
}
