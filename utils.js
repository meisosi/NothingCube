const mysql = require("mysql2");
const { Telegraf } = require("telegraf");
const { dailyJob } = require("./cron.js");
require("dotenv").config();

const token = process.env.TOKEN_BOT;
const bot = new Telegraf(token);

const shop = {
  "Благословение полой луны 🌙": 3990,
  "Пропуск снабжения экспресса 🎫": 3990,
};

class utils {
  constructor() {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
    });
    this.connection.connect();
  }

  getUserData(userId) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT * FROM users WHERE tg_id = ${userId}`,
        (err, results) => {
          if (err) {
            console.error("Ошибка при выполнении запроса: " + err.stack);
            bot.telegram.sendMessage(userId, "Произошла ошибка.");
            reject(err);
          } else {
            resolve(results[0]);
          }
        }
      );
    });
  }

  updateUserData(userId, field, value) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `UPDATE users SET ${field} = '${value}' WHERE tg_id = ${userId}`,
        (err, results) => {
          if (err) {
            console.error("Ошибка при выполнении запроса: " + err.stack);
            bot.telegram.sendMessage(userId, "Произошла ошибка.");
            reject(err);
          } else {
            resolve(true);
          }
        }
      );
    });
  }

  createUser(userId, nickname) {
    nickname = nickname.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      ""
    );
    console.log(userId);
    return new Promise((resolve, reject) => {
      const date = new Date();
      const sql =
        "INSERT INTO users (tg_id, nickname, coins, rolls, created_at, subscribe_at) VALUES (?, ?, 0, 1, ?, '[]')";
      const values = [userId, nickname, date];

      this.connection.query(sql, values, (err) => {
        if (err) {
          console.error("Ошибка при выполнении запроса: " + err.stack);
          bot.telegram.sendMessage(userId, "Произошла ошибка.");
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  async isAdmin(userId) {
    return false
  }

  async checkUserSubscriptions(userId, channelUsernames, alreadySubs) {
    try {
      const subscriptions = alreadySubs || [];
      let i = 0;
      while (subscriptions.length < channelUsernames.length) {
        subscriptions.push(false);
      }

      for (const channelUsername of channelUsernames) {
        try {
          const chatMember = await bot.telegram.getChatMember(channelUsername.id,userId);
          const isMember = ["member", "administrator", "creator"].includes(chatMember.status);
          if (isMember && !subscriptions[i]) {
            subscriptions[i] = true;
          }
          i++;
        }
        catch(e) {
          i++;
          continue;
        }
      }
      return subscriptions;
    } catch (error) {
      console.error("Ошибка при проверке подписок:", error);
      return null;
    }
  }

  async getNewRollsChannels() {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT name, url, id FROM add_drops_channels",
        (err, results) => {
          if (err) {
            console.error(
              "Ошибка при обновлении каналов для доп.бросков:",
              err
            );
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  }

  async sendSubscribeKeyboard(ctx, args, edit = false) {
    const subscribeMessage =
      "Для использования функционала бота, пожалуйста, подпишитесь на наш канал:";
    let action = "";
    if(args) {
      action = "-" + args;
    }
    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Подписаться",
              url: `https://t.me/${process.env.MAIN_CHANEL}`,
            },
          ],
          [{ text: "Проверить", callback_data: `back_to_menu` + action }],
        ],
      },
    };
    if (edit) {
      ctx.editMessageText(subscribeMessage, keyboard);
    } else {
      await ctx.replyWithHTML(subscribeMessage, keyboard);
    }
  }

  async getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async getDeclension(number, one, few, many) {
    number = Math.abs(number);

    if (number % 100 >= 11 && number % 100 <= 19) {
      return many;
    }

    const remainder = number % 10;

    if (remainder === 1) {
      return one;
    }

    if (remainder >= 2 && remainder <= 4) {
      return few;
    }

    return many;
  }

  async getRandomResult(possibleResults) {
    let random = await this.getRandomInt(1, 100);

    for (const result of possibleResults) {
      random -= result.chance;
      if (random <= 0) {
        return result;
      }
    }
    return possibleResults[0];
  }

  async findIndexByKey(obj, keyToFind) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === keyToFind) {
        return i;
      }
    }
    return -1; // Возвращаем -1, если ключ не найден
  }

  async getKeyByIndex(obj, index) {
    const keys = Object.keys(obj);
    return keys[index];
  }

  async getUserInventory(user) {
    const items = JSON.parse(user.items);

    if (!items) return null;

    const inventoryItems = [];

    items.forEach(async (item) => {
      inventoryItems.push(await this.getKeyByIndex(shop, item));
    });

    return inventoryItems;
  }

  async getShop() {
    return shop;
  }

  async getShopCosts(item) {
    return shop[item];
  }

  async clearInventory(userId, callback) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `UPDATE users SET items = null WHERE tg_id = '${userId}'`,
        (err, results) => {
          if (err) {
            console.error("Ошибка при выполнении запроса: " + err.stack);
            bot.sendMessage(userId, "Произошла ошибка.");
            reject(err);
          } else {
            resolve(true);
          }
        }
      );
    });
  }

  async getPromocode(name) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT * FROM promocodes WHERE name = '${name}'`,
        (err, results) => {
          if (err) {
            console.error("Ошибка при выполнении запроса: " + err.stack);
            bot.telegram.sendMessage(userId, "Произошла ошибка.");
            reject(err);
          } else {
            resolve(results[0]);
          }
        }
      );
    });
  }

  async findPromocodeUses(userId, name) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT * FROM used_promocodes WHERE promocode_name = ? AND user_id = ?",
        [name, userId],
        (err, results) => {
          if (err) {
            console.error("Ошибка при выполнении запроса: " + err.stack);
            bot.telegram.sendMessage(userId, "Произошла ошибка.");
            reject(err);
          } else {
            resolve(results.length > 0);
          }
        }
      );
    });
  }

  async addUserPromoUse(userId, name) {
    return new Promise((resolve, reject) => {
      const date = new Date();
      const sql =
        "INSERT INTO used_promocodes (user_id, promocode_name) VALUES (?, ?)";
      const values = [userId, name];

      this.connection.query(sql, values, (err) => {
        if (err) {
          console.error("Ошибка при выполнении запроса: " + err.stack);
          bot.telegram.sendMessage(userId, "Произошла ошибка.");
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  async decreasePromoActivations(name) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `UPDATE promocodes SET activations = activations - 1 WHERE name = '${name}'`,
        (err, results) => {
          if (err) {
            console.error("Ошибка при выполнении запроса: " + err.stack);
            bot.telegram.sendMessage(userId, "Произошла ошибка.");
            reject(err);
          } else {
            resolve(true);
          }
        }
      );
    });
  }

  async deletePromo(name) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `DELETE FROM promocodes WHERE name = '${name}'`,
        (err, results) => {
          if (err) {
            console.error("Ошибка при выполнении запроса: " + err.stack);
            bot.telegram.sendMessage(userId, "Произошла ошибка.");
            reject(err);
          } else {
            resolve(true);
          }
        }
      );
    });
  }

  async deleteUserPromoUses(name) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `DELETE FROM user_activations WHERE name = '${name}'`,
        (err, results) => {
          if (err) {
            console.error("Ошибка при выполнении запроса: " + err.stack);
            bot.telegram.sendMessage(userId, "Произошла ошибка.");
            reject(err);
          } else {
            resolve(true);
          }
        }
      );
    });
  }

  createUserStats(userId) {
    return new Promise((resolve, reject) => {
      const date = new Date();
      const sql =
        "INSERT INTO user_statistics (tg_id, rolls, earned, cases_opened) VALUES (?, 0, 0, 0)";
      const values = [userId];

      this.connection.query(sql, values, (err) => {
        if (err) {
          console.error("Ошибка при выполнении запроса: " + err.stack);
          bot.telegram.sendMessage(userId, "Произошла ошибка.");
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  async getUserStats(userId) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT * FROM user_statistics WHERE tg_id = '${userId}'`,
        (err, results) => {
          if (err) {
            console.error("Ошибка при выполнении запроса: " + err.stack);
            bot.telegram.sendMessage(userId, "Произошла ошибка.");
            reject(err);
          } else {
            resolve(results[0]);
          }
        }
      );
    });
  }

  async increaseUserRolls(userId) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `UPDATE user_statistics SET rolls = rolls + 1 WHERE tg_id = '${userId}'`,
        (err, results) => {
          if (err) {
            console.error("Ошибка при выполнении запроса: " + err.stack);
            bot.telegram.sendMessage(userId, "Произошла ошибка.");
            reject(err);
          } else {
            resolve(true);
          }
        }
      );
    });
  }

  async increaseUserEarned(userId, earned) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `UPDATE user_statistics SET earned = earned + ${earned} WHERE tg_id = '${userId}'`,
        (err, results) => {
          if (err) {
            console.error("Ошибка при выполнении запроса: " + err.stack);
            bot.telegram.sendMessage(userId, "Произошла ошибка.");
            reject(err);
          } else {
            resolve(true);
          }
        }
      );
    });
  }

  async increaseUserCaseOpened(userId) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `UPDATE user_statistics SET cases_opened = cases_opened + 1 WHERE tg_id = '${userId}'`,
        (err, results) => {
          if (err) {
            console.error("Ошибка при выполнении запроса: " + err.stack);
            bot.telegram.sendMessage(userId, "Произошла ошибка.");
            reject(err);
          } else {
            resolve(true);
          }
        }
      );
    });
  }
}

module.exports = new utils();
