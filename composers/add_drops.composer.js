const { Composer } = require("telegraf");
const kb = require("../keyboars.json");
const utils = require("../utils");

async function createAddDropsKeyboard(requiredChannels) {
  const buttonsPerRow = 3;
  const inlineKeyboard = [];

  for (let i = 0; i < requiredChannels.length; i += buttonsPerRow) {
    const row = requiredChannels.slice(i, i + buttonsPerRow).map((channel) => ({
      text: channel.name,
      url: channel.url,
    }));
    inlineKeyboard.push(row);
  }

  inlineKeyboard.push([
    { text: "➕ Собрать броски", callback_data: "check_check_subscription" },
    { text: "🏠 Домой", callback_data: "back_to_menu" },
  ]);

  return {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  };
}

const composer = new Composer();

composer.action("add_drops", async (ctx) => {
  try {
    const requiredChannels = await utils.getNewRollsChannels();
    const keyboard = await createAddDropsKeyboard(requiredChannels);
    const text =
      "Здесь список наших спонсоров. ✍️\nПодписка на каждый канал, даёт один 🎯 Доп. Бросок";
    await ctx.editMessageText(text, keyboard);
  } catch (error) {
    console.error("Ошибка при обработке запроса:", error);
  }
});

composer.action("check_check_subscription", async (ctx) => {
  try {
    const requiredChannels = await utils.getNewRollsChannels();

    const userId = ctx.chat.id;
    const user = await utils.getUserData(userId);
    const currentSubscriptions = user.subscribe_at; //Текущие подписки пользователя
    const currentSubscriptionsCount = currentSubscriptions.filter(value => value === true).length;
    const alreadySubs = currentSubscriptions.slice();
    const userSubscribed = await utils.checkUserSubscriptions(userId, requiredChannels, alreadySubs); //Обновленные подписки
    const userSubscribedCount = userSubscribed.filter(value => value === true).length;

    const keyboard = await createAddDropsKeyboard(requiredChannels);


    if (userSubscribedCount) {
      //Подписан ли хоть на кого то
      if (requiredChannels.length > currentSubscriptionsCount) {
        //Подписан ли на всех
        const addRolls = userSubscribedCount - currentSubscriptionsCount; //Сколько новых подписок
        if (addRolls === 0) {
          //Если новых подписок нет
          return await ctx.editMessageText(
            `Подпишитесь на все каналы, чтобы получить максимум бросков!\nСейчас вы подписаны на ${currentSubscriptionsCount} каналов`,
            keyboard
          );
        }

        const newRolls = user.rolls + addRolls;
        await utils.updateUserData(userId, "rolls", newRolls); //Обновляем броски пользователя
        await utils.updateUserData(userId, "subscribe_at", JSON.stringify(userSubscribed)); //Обновляем подписки пользователя

        const text = `Успешно! Мы начислили тебе ${addRolls} бросков!\n\nСкорее кидай кубик 🎲, потому что броски нельзя накопить!`;
        await ctx.editMessageText(text, kb.add_tryes_success);
      } else {
        //Если уже подписался на всех
        return await ctx.editMessageText(
          "Вы уже собрали все броски на сегодня!\nСпасибо за поддержку бота❤️",
          kb.back_add_tryes
        );
      }
    } else {
      //Если не подписан ни на кого
      const text =
        "Ты не подписался ни на одного из спонсоров :(\nПопробуй ещё раз!";
      return await ctx.editMessageText(text, kb.back_add_tryes);
    }
  } catch (error) {
    console.error("Ошибка при обработке запроса:", error);
  }
});

module.exports = composer;
