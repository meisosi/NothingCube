const mysql = require("mysql2");
const { Telegraf } = require("telegraf");
const { CronJob } = require("cron");
const utils = require("./utils");
require("dotenv").config();

process.env.NTBA_FIX_319 = 1;

const token = process.env.TOKEN_BOT;
const bot = new Telegraf(token);

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
});

connection.connect();

async function getAllUsersFromDatabase() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT tg_id FROM users", (err, results) => {
      if (err) {
        console.error("Error retrieving user list from the database:", err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

async function getCountNewUsersByDate() {
  return new Promise((resolve, reject) => {
    var date = new Date();
    date.setHours(date.getHours() - 24);
    date = date.toISOString();

    connection.query(
      'SELECT count(*) FROM `users` WHERE `created_at` >= "' + date + '"',
      (err, results) => {
        if (err) {
          console.error("Error retrieving user list from the database:", err);
          reject(err);
        } else {
          resolve(results[0]["count(*)"]);
        }
      }
    );
  });
}

async function resetRolls() {
  try {
    const DELAY_BETWEEN_MESSAGES = 50; // Задержка в миллисекундах между сообщениями
    const MAX_MESSAGES_PER_SECOND = 20; // Максимальное количество сообщений в секунду

    const users = await getAllUsersFromDatabase();
    updateResetRolls();

    // Отправка сообщений с задержкой 0.1 секунды между ними
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (user && user.tg_id) {
        try {
          await new Promise((resolve) => {
            setTimeout(async () => {
              try {
                await bot.telegram.sendMessage(
                  user.tg_id,
                  "Вам доступен ежедневный бросок и сбор доп.бросков! :)",
                  { disable_notification: true }
                );
                resolve();
              } catch (error) {
                console.error("Ошибка при отправке сообщения:", error); // Логирование ошибки
                resolve();
              }
            }, Math.floor(i / MAX_MESSAGES_PER_SECOND) * DELAY_BETWEEN_MESSAGES);
          });
        } catch (error) {
          console.log("Ошибка при отправке сообщения:", error);
          continue
        }
      }
    }

    console.log("Ежедневное обновление бросков выполнено успешно.");
  } catch (error) {
    console.error("Произошла ошибка при ежедневном обновлении бросков:", error);
  }
}

function updateResetRolls() {
  return new Promise((resolve, reject) => {
    connection.query(
      `
    UPDATE users
    SET vip_status = CASE
        WHEN vip_status > 0 THEN vip_status - 1
        ELSE 0
    END,
    rolls = CASE
        WHEN vip_status > 0 THEN ${parseInt(process.env.ROLLS_ON_SUB)}
        WHEN vip_status = 0 THEN 1

    END,
    subscribe_at = '[]';`,
      (err, results) => {
        if (err) {
          console.error("Ошибка при выполнении запроса: " + err.stack);
          reject(err);
        } else {
          resolve(true);
        }
      }
    );
  });
}

async function sendStatisticToAdmin() {
  try {
    const count = await getCountNewUsersByDate();

    const admins = [715074066, 1788067264, 1233779243, 1280865837];

    for (const admin of admins) {
      try {
        await bot.telegram.sendMessage(
          admin,
          "Новых пользователей за сутки: " + count
        );
      } catch (err) {
        continue;
      }
    }

    console.log("Статистика админам успешно отправленна");
  } catch (error) {
    console.error("Произошла ошибка при отправке статистики админкам: ", error);
  }
}

const reminder = new CronJob("0,0 9,15 * * *", async () => {
  try {
    const requiredChannels = process.env.ADD_ROLLS_CH.split(',');
    const users = await getAllUsersFromDatabase();
    let forAlltxt =
      "Уважаемые пользователи, не забудьте сделать бросок и собрать доп.броски в боте, пока их не сбросили!\n";
    let forRollstxt =
      "Уважаемые пользователи, не забудьте сделать бросоки, пока их не сбросили!\n";
    let forSubtxt =
      "Уважаемые пользователи, не забудьте собрать все доп.броски в боте, пока их не сбросили!\n";
    let txt = "Нажмите /start, чтобы воспользоваться ботом!";

    for (let i = 0; i < users.length; i++) {
      const user = await utils.getUserData(users[i].tg_id);

      if (user && user.tg_id) {
        try {
          await new Promise((resolve) => {
            setTimeout(async () => {
              try {
                let sendTxt = null;
                if (
                  user.rolls > 0 &&
                  user.subscribe_at < requiredChannels.length
                )
                  sendTxt = forAlltxt + txt;
                else if (user.rolls > 0) sendTxt = forRollstxt + txt;
                else if (user.subscribe_at < requiredChannels.length)
                  sendTxt = forSubtxt + txt;
                if (sendTxt)
                  await bot.telegram.sendMessage(user.tg_id, sendTxt);
                resolve();
              } catch (error) {
                console.error("Ошибка при отправке сообщения:", error); // Логирование ошибки
                resolve(); // Продолжаем выполнение цикла даже при ошибке
              }
            }, i * 100); // Задержка: 0.1 секунды между сообщениями
          });
        } catch (error) {
          console.log("reminder", error);
          continue;
        }
      }
    }

    if (users.length === 0) {
      console.log("Рассылка завершена. Нет пользователей для отправки.");
    } else {
      console.log("Рассылка напоминаний выполнена успешно.");
    }
  } catch (error) {
    console.error("Произошла ошибка при рассылке напоминаний:", error);
  }
});

const dailyJob = new CronJob("0 21 * * *", async () => {
  await resetRolls();
  await sendStatisticToAdmin();
});

module.exports = { dailyJob, reminder };
