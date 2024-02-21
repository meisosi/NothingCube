import { Database } from '../../sql';

import { Promocode, PromocodeType } from '../../../interface/promocode'

const validPromocodeValues = Object.keys(PromocodeType);

export async function createPromocode(db: Database, promocode: Promocode): Promise<Promocode | null> {
    if(!promocode.code) {
        return null;
    }
    if (validPromocodeValues.includes(promocode.code)) {
        return null;
    }
    
    promocode.type = promocode.type || null;
    promocode.count = promocode.count || 0;
    promocode.expires_at = promocode.expires_at || new Date(9999, 11);
    const sqlQuery = "INSERT INTO promocodes (code, type, activations, count, expires_at) VALUES (?, ?, ?, ?, ?)";
    await db.executeQuery(sqlQuery, [
        promocode.code,
        promocode.type,
        promocode.activations,
        promocode.count,
        promocode.expires_at.toISOString().slice(0, 19).replace('T', ' '),
    ]);
    return promocode;
}
