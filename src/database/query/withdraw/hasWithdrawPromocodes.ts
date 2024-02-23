import { Database } from "../../sql";

const HAS_PROMOCODES_QUERY = 'SELECT EXISTS(SELECT * FROM `withdraw_promocodes` WHERE `userId` IS NOT NULL)';
export async function hasWithdrawPromocodes(db: Database): Promise<boolean | null> {
    return db.executeQuery(HAS_PROMOCODES_QUERY);
}