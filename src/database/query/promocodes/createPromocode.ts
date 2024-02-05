import { Database } from '../../sql';

import { Promocode, PromocodeType } from '../../../interface/promocode'

export async function createPromocode(db: Database, promocode: Promocode): Promise<Promocode | null> {
    if(!promocode.code) {
        throw new Error("Code is required for create a new promocode")
    }
    if (!(promocode.code in PromocodeType)) {
        throw new Error("Code must be a valid PromocodeType");
    }
    
    promocode.type = promocode.type || null;
    promocode.count = promocode.count || 0;
    promocode.expires_at = promocode.expires_at || true;
    const sqlQuery = "INSERT INTO promocodes (id, code, type, count, expires_at) VALUES (?, ?, ?, ?, ?)";
    return db.executeQuery(sqlQuery, [
        promocode.code,
        promocode.type,
        promocode.count,
        promocode.expires_at,
    ]);
}
