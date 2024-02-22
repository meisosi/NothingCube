import { Database } from '../../sql';

import { Promocode } from '../../../interface/promocode'

export async function createInactivePromo(db: Database, promocode: Promocode): Promise<Promocode | null> {
    promocode.expires_at = promocode.expires_at || new Date(9999, 11);
    const sqlQuery = "INSERT INTO inactive_promocodes (code, activations, expires_at) VALUES (?, ?, ?)";
    await db.executeQuery(sqlQuery, [
        promocode.code,
        promocode.activations,
        promocode.expires_at.toISOString().slice(0, 19).replace('T', ' '),
    ]);
    return promocode;
}
