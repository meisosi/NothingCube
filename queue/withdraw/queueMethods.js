"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkWithdrawPromocode = exports.deleteWithdrawPromocode = exports.tryPutQueue = void 0;
const getWithdrawPromocode_1 = require("./getWithdrawPromocode");
const hasWithdrawUsers_1 = require("./hasWithdrawUsers");
const LINK_PROMOCODE_QUERY = 'UPDATE `withdraw_{0}_promocodes` SET userId = ? WHERE code = ?';
const USER_ADD_QUERY = 'INSERT INTO `withdraw_{0}s_users` VALUES (?, ?, NOW())';
const GIVE_PROMOCODE_QUERY = 'SELECT * FROM `withdraw_{0}_promocodes` WHERE code = ? ORDER BY `data` LIMIT 1';
const DELETE_PROMOCODE_QUERY = 'DELETE FROM `withdraw_{0}_promocodes` WHERE code = ?';
const KICK_USER_QUERY = 'DELETE FROM `withdraw_{0}_users` WHERE id = ?';
/**
 * Проверяет существует ли свободный промокод:
 * - если да: линкует пользователя к нему;
 * - если нет: добавляет в очередь.
 *
 * @param { Database } db База данных, хранящая информация о пользователях и промокодах.
 * @param { WithdrawUser } user Пользователь, пытающийся получить промокод.
 */
function tryPutQueue(db, user, status = 'default') {
    return __awaiter(this, void 0, void 0, function* () {
        const promocode = yield (0, getWithdrawPromocode_1.getWithdrawPromocode)(db, user.waitingType, false, status);
        if (promocode) {
            db.executeQuery(LINK_PROMOCODE_QUERY.replace('{0}', status), [user.userId, (yield promocode).code]);
        }
        else {
            db.executeQuery(USER_ADD_QUERY.replace('{0}', status), [user.userId, user.waitingType]);
        }
        return promocode;
    });
}
exports.tryPutQueue = tryPutQueue;
/**
 * Удаляет промокод с заданным айди и возвращает
 * удалённый промокод.
 *
 * @param { Database } db База данных, хранящая информация о пользователях и промокодах.
 * @param { string } code Айди промокода.
 * @returns { WithdrawPromocode } Удалённый промокод.
 */
function deleteWithdrawPromocode(db, code, status = 'default') {
    return __awaiter(this, void 0, void 0, function* () {
        const promocode = yield db.executeQuery(GIVE_PROMOCODE_QUERY.replace('{0}', status), [code]);
        if (promocode) {
            db.executeQuery(DELETE_PROMOCODE_QUERY.replace('{0}', status), [code]);
            return promocode;
        }
    });
}
exports.deleteWithdrawPromocode = deleteWithdrawPromocode;
/**
 * Линкует промокод, в случае, если данный
 * пользователь находится в списке ожидания.
 *
 * @param { Database } db База данных, хранящая информация о пользователях и промокодах.
 * @param { WithdrawUser } user Пользователь, к которому линкуется промокод.
 */
function linkWithdrawPromocode(db, user, status = 'default') {
    return __awaiter(this, void 0, void 0, function* () {
        if ((0, hasWithdrawUsers_1.hasWithdrawUser)(db, user, status)) {
            const promocode = yield (0, getWithdrawPromocode_1.getWithdrawPromocode)(db, user.waitingType, false, status);
            if (promocode) {
                db.executeQuery(KICK_USER_QUERY.replace('{0', status), [user.userId]);
                return promocode;
            }
        }
    });
}
exports.linkWithdrawPromocode = linkWithdrawPromocode;
