import { WithdrawUser } from "../../../interface/withdraw";
import { Database } from "../../sql";

const HAS_USERS_QUERY = 'SELECT EXISTS(SELECT * FROM `withdraw_users` LIMIT 1)';
const HAS_USER_QUERY = 'SELECT EXISTS(SELECT * FROM `withdraw_users` WHERE id = ? AND waitingType = ? LIMIT 1)'
export async function hasWithdrawUsers(db: Database): Promise<boolean | null> {
    return db.executeQuery(HAS_USERS_QUERY);
}

export async function hasWithdrawUser(
    db: Database,
    user: WithdrawUser
): Promise<boolean | null> {
    return db.executeQuery(HAS_USERS_QUERY, Object.values(user));
}