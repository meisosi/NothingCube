import { Database } from "../../sql";

const CREATE_PROMOCODE = 'INSERT INTO `withdraw_promocodes` (code, type) VALUES (?, ?)';
export async function createPromocode(
    db: Database,
    code: string,
    type: 'gems' | 'moons' | 'big_gems'
): Promise<void | null> {
    return db.executeQuery(CREATE_PROMOCODE, [code, type]);
}