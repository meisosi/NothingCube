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
exports.getWithdrawPromocode = exports.getWithdrawPromocodes = void 0;
const GET_PROMOCODES_QUERY = 'SELECT * FROM `withdraw_{0}_promocodes` WHERE type = ? ORDER BY `data`';
function getWithdrawPromocodes(db, type, linked, status = 'default') {
    return __awaiter(this, void 0, void 0, function* () {
        let query = GET_PROMOCODES_QUERY.replace('{0}', status);
        if (typeof linked === 'boolean') {
            query += ` AND userId ${linked ? 'IS NOT NULL' : 'IS NULL'}`;
        }
        return db.executeQueryArray(query, [type]);
    });
}
exports.getWithdrawPromocodes = getWithdrawPromocodes;
function getWithdrawPromocode(db, type, linked, status = 'default') {
    return __awaiter(this, void 0, void 0, function* () {
        return yield getWithdrawPromocodes(db, type, linked, status)[0];
    });
}
exports.getWithdrawPromocode = getWithdrawPromocode;
