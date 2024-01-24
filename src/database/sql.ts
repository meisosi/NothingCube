import * as mysql from "mysql2/promise";

import { User } from "../interfaces/user";
import { getUser } from "./query/getUser";
import { deleteUser } from "./query/deleteUser";
import { createUser } from "./query/createUser";



export class Database {
  private _pool: mysql.Pool;

  constructor() {
    const dbConfig: mysql.PoolOptions = {
      host: "your_database_host",
      user: "your_database_user",
      password: "your_database_password",
      database: "your_database_name",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };
    this._pool = mysql.createPool(dbConfig);
  }

  // Импорт всех запросов
  async getUser(userId: number) {
    return getUser(this, userId);
  }
  async deleteUser(userId: number) {
    return deleteUser(this, userId);
  }
  async createUser(userId: number, username: string, premium: number | null) {
    const user: User = {
      id: userId,
      username: username,
      premium: premium,
    };
    return createUser(this, user);
  }
  
  
  /**
   * Выполняет заданый SQL запрос и возвращает его результат
   * @param {string} sqlQuery - SQL запрос для выполнения
   * @param {any[]} params - значения параметров запроса (если требуются)
   */
  public async executeQuery<T>(
    sqlQuery: string,
    params?: any[]
  ): Promise<T | null> {
    try {
      const connection = await this._pool.getConnection();
      const [rows] = await connection.execute(sqlQuery, params);
      connection.release();

      if (Array.isArray(rows)) return rows.length > 0 ? (rows[0] as T) : null;
      else return null;
    } catch (error) {
      console.error("Error executing query:", error);
      return null;
    }
  }
}
