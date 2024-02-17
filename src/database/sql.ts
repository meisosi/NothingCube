import * as mysql from "mysql2/promise";

import { getUser } from "./query/users/getUser";
import { createUser } from "./query/users/createUser";
import { deleteUser } from "./query/users/deleteUser";
import { getPromocode } from "./query/promocodes/getPromocode"
import { createPromocode } from "./query/promocodes/createPromocode"
import { getPromocodeUsage } from "./query/promocodes/getPromocodeUsage"
import { getUserInventory } from "./query/inventory/getInventory"
import { updateUserInventory } from "./query/inventory/updateInventory"
import { getUserSubscriptions } from './query/subscriptions/getUserSubscriptions'
import { setUserSubscriptions } from './query/subscriptions/setUserSubscriptions'
import { getRequiredChannels } from './query/subscriptions/getRequiredChannels'
import { getStats } from './query/stats/getStats'

import { User } from "src/interface/user";
import { Promocode } from "src/interface/promocode";
import { Inventory } from "src/interface/inventory";



export class Database {
  private _pool: mysql.Pool;

  constructor() {
    const dbConfig: mysql.PoolOptions = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };
    this._pool = mysql.createPool(dbConfig);
  }

  // Импорт всех запросов
  public async getUser(userId: number) {
    return getUser(this, userId);
  }
  public async deleteUser(userId: number) {
    return deleteUser(this, userId);
  }
  public async createUser(user: User) {
    return createUser(this, user);
  }

  public async getPromocode(promo: string) {
    return getPromocode(this, promo);
  }
  public async createPromocode(promocode: Promocode) {
    return createPromocode(this, promocode);
  }
  public async getPromocodeUsage(userId: number, code: string) {
    return getPromocodeUsage(this, userId, code);
  }

  public async getUserInventory(userId: number, type?: keyof Omit<Inventory, 'user_id'>) {
    if(type)
      return (await getUserInventory(this, userId)[type]);
    return getUserInventory(this, userId);
  }
  public async updateUserInventory(userId: number, type: keyof Omit<Inventory, 'user_id'>, value: number) {
    return (await updateUserInventory(this, userId, type, value));
  }

  public async getUserSubscriptions(userId: number) {
    return getUserSubscriptions(this, userId);
  }
  public async setUserSubscriptions(userId: number, newChannels: Array<number>) {
    return setUserSubscriptions(this, userId, newChannels);
  }
  public async getRequiredChannels() {
    return getRequiredChannels(this);
  }
  public async getUserStats(userId: number) {
    return getStats(this, userId);
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
