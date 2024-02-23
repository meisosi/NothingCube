import { WithdrawPromocode, WithdrawUser } from "../../../interface/withdraw";
import { Database } from "../../sql";
import { getWithdrawPromocode } from "./getWithdrawPromocode";
import { hasWithdrawUser } from "./hasWithdrawUsers";

const LINK_PROMOCODE_QUERY = 'UPDATE `withdraw_promocodes` SET userId = ? WHERE code = ?';
const USER_ADD_QUERY = 'INSERT INTO `withdraw_users` VALUES (?, ?)';

const GIVE_PROMOCODE_QUERY = 'SELECT * FROM `withdraw_promocodes` WHERE code = ? LIMIT 1';
const DELETE_PROMOCODE_QUERY = 'DELETE FROM `withdraw_promocodes` WHERE code = ?';
const KICK_USER_QUERY = 'DELETE FROM `withdraw_users` WHERE id = ?'

/**
 * Проверяет существует ли свободный промокод:
 * - если да: линкует пользователя к нему;
 * - если нет: добавляет в очередь.
 * 
 * @param { Database } db База данных, хранящая информация о пользователях и промокодах.
 * @param { WithdrawUser } user Пользователь, пытающийся получить промокод.
 */
export async function tryPutQueue(
    db: Database,
    user: WithdrawUser
): Promise<WithdrawPromocode | null> {
    const promocode = await getWithdrawPromocode(db, user.waitingType, false);
    if(promocode) {
        db.executeQuery(LINK_PROMOCODE_QUERY, [user.userId, (await promocode).code]);
    } else {
        db.executeQuery(USER_ADD_QUERY, [user.userId, user.waitingType]);
    }
    return promocode;
}

/**
 * Удаляет промокод с заданным айди и возвращает
 * удалённый промокод.
 * 
 * @param { Database } db База данных, хранящая информация о пользователях и промокодах.
 * @param { string } code Айди промокода.
 * @returns { WithdrawPromocode } Удалённый промокод.
 */
export async function deleteWithdrawPromocode(
    db: Database,
    code: string
): Promise<WithdrawPromocode | null> {
    const promocode = await db.executeQuery(GIVE_PROMOCODE_QUERY, [code]) as WithdrawPromocode;
    if(promocode) {
        db.executeQuery(DELETE_PROMOCODE_QUERY, [code])
        return promocode;
    }
}

/**
 * Линкует промокод, в случае, если данный
 * пользователь находится в списке ожидания.
 * 
 * @param { Database } db База данных, хранящая информация о пользователях и промокодах.
 * @param { WithdrawUser } user Пользователь, к которому линкуется промокод.
 */
export async function linkWithdrawPromocode(
    db: Database,
    user: WithdrawUser
): Promise<WithdrawPromocode | null> {
    if(hasWithdrawUser(db, user)) {
        const promocode = await getWithdrawPromocode(db, user.waitingType, false);
        if(promocode) {
            db.executeQuery(KICK_USER_QUERY, [user.userId])
            return promocode;
        }
    }
}