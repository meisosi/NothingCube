const mysql = require("mysql2/promise");
const { tryPutQueue, deleteWithdrawPromocode, linkWithdrawPromocode,
    hasWithdrawUsers, hasWithdrawPromocodes, getWithdrawUsers
} = require("./withdraw/queueMethods");
const { stat } = require("fs");
module.exports = class Database {
    _pool;
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
    async tryPutQueue(user, status = 'default') {
        return await tryPutQueue(this, user, status);
    }
    async deleteWithdrawPromocode(code, status = 'default') {
        return await deleteWithdrawPromocode(this, code, status);
    }
    async linkWithdrawPromocode(user, status = 'default') {
        return await linkWithdrawPromocode(this, user, status);
    }
    async getWithdrawUsers(status = 'default') {
        return await getWithdrawUsers(this, status);
    }
    async hasWithdrawUsers(status = 'default') {
        return await hasWithdrawUsers(this, status);
    }
    async hasWithdrawPromocodes(status = 'default') {
        return await hasWithdrawPromocodes(this, status);
    }
    /**
     * Выполняет заданый SQL запрос и возвращает его результат
     * @param {string} sqlQuery - SQL запрос для выполнения
     * @param {any[]} params - значения параметров запроса (если требуются)
     */
    async executeQuery(sqlQuery, params) {
        try {
            const connection = await this._pool.getConnection();
            const [rows] = await connection.execute(sqlQuery, params);
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
    }
    async executeQueryArray(sqlQuery, params) {
        try {
            const connection = await this._pool.getConnection();
            const [rows] = await connection.execute(sqlQuery, params);
            connection.release();
            console.log(rows, rows.length)
            if (Array.isArray(rows))
                return rows.length > 0 ? rows : null;
            else
                return null;
        }
        catch (error) {
            console.error("Error executing query:", error);
            return null;
        }
    }
}
