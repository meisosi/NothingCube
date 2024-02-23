import { WithdrawUser } from "../../../interface/withdraw";
import { Database } from "../../sql";

const WITHDRAW_USERS_QUERY = 'SELECT * FROM `withdraw_users`';
export async function getWithdrawUsers(db: Database): Promise<WithdrawUser[] | null> {
    return db.executeQueryArray(WITHDRAW_USERS_QUERY);
}