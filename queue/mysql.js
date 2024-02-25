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
exports.Database = void 0;
const mysql = require("mysql2/promise");
const getWithdrawUsers_1 = require("./withdraw/getWithdrawUsers");
const hasWithdrawPromocodes_1 = require("./withdraw/hasWithdrawPromocodes");
const hasWithdrawUsers_1 = require("./withdraw/hasWithdrawUsers");
const queueMethods_1 = require("./withdraw/queueMethods");
class Database {
    constructor() {
        const dbConfig = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        };
        this._pool = mysql.createPool(dbConfig);
    }
    tryPutQueue(user, status = 'default') {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, queueMethods_1.tryPutQueue)(this, user, status);
        });
    }
    deleteWithdrawPromocode(code, status = 'default') {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, queueMethods_1.deleteWithdrawPromocode)(this, code, status);
        });
    }
    linkWithdrawPromocode(user, status = 'default') {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, queueMethods_1.linkWithdrawPromocode)(this, user, status);
        });
    }
    getWithdrawUsers(status = 'default') {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, getWithdrawUsers_1.getWithdrawUsers)(this, status);
        });
    }
    hasWithdrawUsers(status = 'default') {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, hasWithdrawUsers_1.hasWithdrawUsers)(this, status);
        });
    }
    hasWithdrawPromocodes(status = 'default') {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, hasWithdrawPromocodes_1.hasWithdrawPromocodes)(this, status);
        });
    }
    /**
     * Выполняет заданый SQL запрос и возвращает его результат
     * @param {string} sqlQuery - SQL запрос для выполнения
     * @param {any[]} params - значения параметров запроса (если требуются)
     */
    executeQuery(sqlQuery, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield this._pool.getConnection();
                const [rows] = yield connection.execute(sqlQuery, params);
                connection.release();
                if (Array.isArray(rows))
                    return rows.length > 0 ? rows[0] : null;
                else
                    return null;
            }
            catch (error) {
                console.error("Error executing query:", error);
                return null;
            }
        });
    }
    executeQueryArray(sqlQuery, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield this._pool.getConnection();
                const [rows] = yield connection.execute(sqlQuery, params);
                connection.release();
                if (Array.isArray(rows))
                    return rows.length > 0 ? rows : null;
                else
                    return null;
            }
            catch (error) {
                console.error("Error executing query:", error);
                return null;
            }
        });
    }
}
exports.Database = Database;
