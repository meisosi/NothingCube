const LINK_PROMOCODE_QUERY = 'UPDATE `withdraw_{0}_promocodes` SET userId = ? WHERE code = ?';
const USER_ADD_QUERY = 'INSERT INTO `withdraw_{0}_users` VALUES (?, ?, NOW())';
const GIVE_PROMOCODE_QUERY = 'SELECT * FROM `withdraw_{0}_promocodes` WHERE code = ? ORDER BY `data` ASC LIMIT 1';
const DELETE_PROMOCODE_QUERY = 'DELETE FROM `withdraw_{0}_promocodes` WHERE code = ?';
const KICK_USER_QUERY = 'DELETE FROM `withdraw_{0}_users` WHERE id = ?';
const HAS_USERS_QUERY = 'SELECT EXISTS(SELECT * FROM `withdraw_{0}_users` LIMIT 1)';
const HAS_USER_QUERY = 'SELECT EXISTS(SELECT * FROM `withdraw_{0}_users` WHERE id = ? AND waitingType = ? LIMIT 1)';
const HAS_PROMOCODES_QUERY = 'SELECT EXISTS(SELECT * FROM `withdraw_{0}_promocodes` WHERE `userId` IS NULL)';
const WITHDRAW_USERS_QUERY = 'SELECT * FROM `withdraw_{0}_users` ORDER BY `data` ASC';
const GET_PROMOCODES_QUERY = 'SELECT * FROM `withdraw_{0}_promocodes` WHERE type = ?';
const CREATE_PROMOCODE = 'INSERT INTO `withdraw_{0}_promocodes` (code, type) VALUES (?, ?)';

/**
 * Проверяет существует ли свободный промокод:
 * - если да: линкует пользователя к нему;
 * - если нет: добавляет в очередь.
 *
 * @param { Database } db База данных, хранящая информация о пользователях и промокодах.
 * @param { WithdrawUser } user Пользователь, пытающийся получить промокод.
 */
async function tryPutQueue(db, user, status = 'default') {
    const promocode = await getWithdrawPromocode(db, user.waitingType, false, status);
    if (promocode) {
        await db.executeQuery(LINK_PROMOCODE_QUERY.replace('{0}', status), [user.userId, (await promocode).code]);
    }
    else {
        await db.executeQuery(USER_ADD_QUERY.replace('{0}', status), [user.userId, user.waitingType]);
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
async function deleteWithdrawPromocode(db, code, status = 'default') {
    const promocode = await db.executeQuery(GIVE_PROMOCODE_QUERY.replace('{0}', status), [code]);
    if (promocode) {
        await db.executeQuery(DELETE_PROMOCODE_QUERY.replace('{0}', status), [code])
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
async function linkWithdrawPromocode(db, user, status = 'default') {
    if (hasWithdrawUser(db, user, status)) {
        const promocode = getWithdrawPromocode(db, user.waitingType, false, status);
        if (promocode) {
            await db.executeQuery(KICK_USER_QUERY.replace('{0', status), [user.userId])
            promocode.userId = user.userId;
            return promocode;
        }
    }
}

async function hasWithdrawUsers(db, status = 'default') {
    return await db.executeQuery(HAS_USERS_QUERY.replace('{0}', status));
}

async function hasWithdrawUser(db, user, status = 'default') {
    return await db.executeQuery(HAS_USER_QUERY.replace('{0}', status), Object.values(user));
}

async function hasWithdrawPromocodes(db, status = 'default') {
    return await db.executeQuery(HAS_PROMOCODES_QUERY.replace('{0}', status));
}

async function getWithdrawUsers(db, status = 'default') {
    const users = await db.executeQueryArray(WITHDRAW_USERS_QUERY.replace('{0}', status));
    return users;
}

async function getWithdrawPromocodes(db, type, linked, status = 'default') {
    let query = GET_PROMOCODES_QUERY.replace('{0}', status);
    if(typeof linked === 'boolean') {
        query += ` AND userId ${linked? 'IS NOT NULL': 'IS NULL'}`;
    }
    query += ' ORDER BY `data` ASC';
    return await db.executeQueryArray(query, [type]);
}

async function getWithdrawPromocode(db, type, linked, status = 'default') {
    const promos = await getWithdrawPromocodes(db, type, linked, status);
    if(promos)  return promos[0];
    else return null;
}

async function createPromocode(db, code, type, status = 'default') {
    return await db.executeQuery(CREATE_PROMOCODE.replace('{0}', status), [code, type]);
}

module.exports = {
    tryPutQueue,
    deleteWithdrawPromocode,
    linkWithdrawPromocode,
    hasWithdrawUsers,
    hasWithdrawUser,
    hasWithdrawPromocodes,
    getWithdrawUsers,
    getWithdrawPromocodes,
    getWithdrawPromocode,
    createPromocode
}
