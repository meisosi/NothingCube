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
exports.hasWithdrawUser = exports.hasWithdrawUsers = void 0;
const HAS_USERS_QUERY = 'SELECT EXISTS(SELECT * FROM `withdraw_{0}_users` LIMIT 1)';
const HAS_USER_QUERY = 'SELECT EXISTS(SELECT * FROM `withdraw_{0}_users` WHERE id = ? AND waitingType = ? LIMIT 1)';
function hasWithdrawUsers(db, status = 'default') {
    return __awaiter(this, void 0, void 0, function* () {
        return db.executeQuery(HAS_USERS_QUERY.replace('{0}', status));
    });
}
exports.hasWithdrawUsers = hasWithdrawUsers;
function hasWithdrawUser(db, user, status = 'default') {
    return __awaiter(this, void 0, void 0, function* () {
        return db.executeQuery(HAS_USER_QUERY.replace('{0}', status), Object.values(user));
    });
}
exports.hasWithdrawUser = hasWithdrawUser;
