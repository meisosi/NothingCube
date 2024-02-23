import * as mysql from "mysql2/promise";

import { getUser } from "./query/users/getUser";
import { createUser } from "./query/users/createUser";
import { deleteUser } from "./query/users/deleteUser";
import { getPromocode } from "./query/promocodes/getPromocode";
import { createPromocode } from "./query/promocodes/createPromocode";
import { getPromocodeUsage } from "./query/promocodes/getPromocodeUsage";
import { usagePromocode } from './query/promocodes/usagePromocode';
import { createInactivePromo } from "./query/promocodes/createInactivePromo";
import { foundInactivePromo } from "./query/promocodes/foundInactivePromo";
import { deductPromocode } from './query/promocodes/deductPromocode';
import { deletePromo } from './query/promocodes/deletePromo';
import { getUserInventory } from "./query/inventory/getInventory";
import { updateUserInventory } from "./query/inventory/updateInventory";
import { getUserSubscriptions } from './query/subscriptions/getUserSubscriptions';
import { setUserSubscriptions } from './query/subscriptions/setUserSubscriptions';
import { getRequiredChannels } from './query/subscriptions/getRequiredChannels';
import { createStats } from "./query/stats/createStats";
import { getStats } from './query/stats/getStats';
import { createReferal } from "./query/referals/createUserRef";
import { addReferal } from "./query/referals/addReferal";
import { removeReferal } from "./query/referals/removeReferal";
import { getReferal } from "./query/referals/getReferals";
import { addAdViews } from './query/ad/addViews'

import { User } from "src/interface/user";
import { Promocode } from "src/interface/promocode";
import { Inventory } from "src/interface/inventory";
import { createUserInventory } from "./query/inventory/createInventory";
import { linkReferal } from "./query/referals/linkReferal";



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
  public async deductPromocode(promocode: Promocode) {
    return deductPromocode(this, promocode.code);
  }
  public async deletePromo(code: string) {
    return deletePromo(this, code);
  }
  public async usagePromocode(userId: number, promocode: string) {
    return usagePromocode(this, userId, promocode);
  }
  public async getPromocodeUsage(userId: number, code: string) {
    return getPromocodeUsage(this, userId, code);
  }
  public async createInactivePromo(promocode: Promocode) {
    return createInactivePromo(this, promocode);
  }
  public async foundInactivePromo(promo: string) {
    return foundInactivePromo(this, promo);
  }

  public async getUserInventory(userId: number, type?: keyof Omit<Inventory, 'user_id'>) {
    if(type)
      return (await getUserInventory(this, userId)[type]);
    return getUserInventory(this, userId);
  }
  public async updateUserInventory(userId: number, type: keyof Omit<Inventory, 'user_id'>, value: number) {
    return await updateUserInventory(this, userId, type, value);
  }
  public async createUserInventory(userId: number) {
    return await createUserInventory(this, userId);
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
  public async createUserStats(userId: number) {
    return createStats(this, userId);
  }

  public async createUserRef(userId: number) {
    return createReferal(this, userId);
  }
  public async addReferal(userId: number, referalId: number) {
    return addReferal(this, userId, referalId);
  }
  public async removeReferal(userId: number, referalId: number) {
    return removeReferal(this, userId, referalId);
  }
  public async getReferal(userId: number) {
    return getReferal(this, userId);
  }
  public async linkReferal(userId: number, referalId: number) {
    return linkReferal(this, userId, referalId);
  }

  public async addAdViews(adcode: string) {
    return addAdViews(this, adcode);
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
