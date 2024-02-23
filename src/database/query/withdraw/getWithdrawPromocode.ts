import { WithdrawPromocode, WithdrawUser } from "../../../interface/withdraw";
import { Database } from "../../sql";

const GET_PROMOCODES_QUERY = 'SELECT * FROM `withdraw_promocodes` WHERE type = ?'
export async function getWithdrawPromocodes(
    db: Database,
    type: 'gems' | 'moons' | 'big_gems',
    linked: boolean | 'any'
): Promise<WithdrawPromocode[] | null> {
    let query = GET_PROMOCODES_QUERY;
    if(typeof linked === 'boolean') {
        query += ` AND userId ${linked? 'IS NOT NULL': 'IS NULL'}`;
    }
    return db.executeQueryArray(query, [type]);
}

export async function getWithdrawPromocode(
    db: Database,
    type: 'gems' | 'moons' | 'big_gems',
    linked: boolean | 'any'
): Promise<WithdrawPromocode | null> {
    return await getWithdrawPromocodes(db, type, linked)[0];
}