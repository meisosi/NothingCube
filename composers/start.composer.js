const { Composer } = require("telegraf");
const composer = new Composer();
const kb = require("../keyboars.json");
const utils = require("../utils");
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.TOKEN_BOT);

const rewards = {
  1: 1,
  2: 5,
  3: 10,
  4: 15,
  5: 20,
  6: 25
};

const getMenu = async (ctx, edit = false) => {
  let user = await utils.getUserData(ctx.from.id);
  let stat = await utils.getUserStats(ctx.from.id);

  if (!user) {
    let username = ctx.from.username || ctx.from.first_name;
    await utils.createUser(ctx.from.id, username);
    user = await utils.getUserData(ctx.from.id);
  }

  if (!stat) {
    await utils.createUserStats(ctx.from.id);
    stat = await utils.getUserStats(ctx.from.id);
  }

  let txt = `🫡Привет, ${ctx.from.username}!\n\n`;
  txt +=
    "Крути кубик 🎲 , собирай доп. Броски 🎯 или попробуй наши-мини игры 🎰 !\n\n";
  txt +=
    "Если есть вопросы - загляни в ❓ FAQ. Если обнаружил проблему - обратная связь.\n\n";
  txt += `Твой баланс: ${user.coins} 💰\n`;
  txt += `Твои броски: ${user.rolls} 🎲\n\n`;
  const subscriptionStatus = user.vip_status
    ? `Осталось дней подписки: ${user.vip_status}`
    : "❌";
  txt += `👑 Подписка: ${subscriptionStatus}\n`;

  if (edit) {
    try {
      if (user.vip_status > 0) ctx.editMessageText(txt, kb.vip_menu);
      else ctx.editMessageText(txt, kb.menu);
    } catch (e) {}
  } else {
    if (user.vip_status > 0) await ctx.replyWithHTML(txt, kb.vip_menu);
    else await ctx.replyWithHTML(txt, kb.menu);
  }
};

composer.command("start", async (ctx) => {
  try {
    const userDB = await utils.getUserData(ctx.from.id)
    if(ctx.chat.id != ctx.from.id) {
      if(!userDB) {
        let txt = ctx.from.first_name + ", что бы броскать кубик надо зарегестрироваться!\n"
        txt += "Нажми на кнопку ниже и присоединяйся!"
        return await ctx.reply(txt, kb.to_bot);
      }
      let txt = "Играть в кубик можно только в личных сообщениях!\n"
      txt += "Нажми на кнопку ниже и присоединяйся!"
      return await ctx.reply(txt, kb.to_bot);
    }
    const chatMember = await bot.telegram.getChatMember(
      `@${process.env.MAIN_CHANEL}`,
      ctx.from.id
    );

    if (
      chatMember.status !== "member" &&
      chatMember.status !== "administrator" &&
      chatMember.status !== "creator"
    ) {
      await utils.sendSubscribeKeyboard(ctx);
      return;
    }
    await getMenu(ctx);
  } catch (e) {
    console.log(e);
  }
});

composer.command("id", async (ctx) => {
  try {
    await ctx.reply(`Ваш id ${ctx.from.id}`);
  } catch (e) {
    console.log(e);
  }
});

composer.command("roll", async (ctx) => {
  try {
    const userDB = await utils.getUserData(ctx.from.id);
    if(!userDB) {
      let txt = ctx.from.first_name + ", что бы броскать кубик надо зарегестрироваться!\n"
      txt += "Нажми на кнопку ниже и присоединяйся!"
      await ctx.reply(txt, kb.to_bot);
    }
    let count = parseInt(ctx.args[0]);
    if(isNaN(count) || !userDB.vip_status) {
      count = 1;
    }
    if(count > 5) {
      count = 5;
    }
    if (userDB.rolls < count) {
      return ctx.reply(`${ctx.from.first_name}, у вас недостаточно бросков`);
    }
    let userRolls = userDB.rolls;
    let userCoins = userDB.coins;
    let allResult = 0;
    let resultMessage = `${ctx.from.first_name}, ты бросил ${count} кубиков 🎲\n\n`;
    while (count > 0) {
      const diceResult = await ctx.replyWithDice();
      count -= 1;
      const selectedResult = diceResult.dice.value;
      const reward = rewards[selectedResult];
  
      if (reward === undefined) {
          ctx.reply('Произошла ошибка при определении награды');
          return;
      }
  
      allResult += reward;
      userCoins += reward;
      userRolls -= 1;

      await utils.increaseUserRolls(ctx.from.id);
    }
    await utils.increaseUserEarned(ctx.from.id, allResult);
    await utils.updateUserData(ctx.from.id, 'coins', userCoins);
    await utils.updateUserData(ctx.from.id, 'rolls', userRolls);

    setTimeout(async () => {
      resultMessage += `Твоя награда составила: ${allResult} 💰\n\n`
      resultMessage += `Твой баланс: ${userCoins} 💰\n`
      resultMessage += `Осталось бросков: ${userRolls} 🎲`
      ctx.reply(resultMessage);
    }, 5000);
  } catch (e) {
    console.log(e);
  }
});


composer.action("back_to_menu", async (ctx) => {
  try {
    const chatMember = await bot.telegram.getChatMember(
      `@${process.env.MAIN_CHANEL}`,
      ctx.from.id
    );
    if (
      chatMember.status !== "member" &&
      chatMember.status !== "administrator" &&
      chatMember.status !== "creator"
    ) {
      return;
    } else {
      if (ctx.callbackQuery.message.photo) {
        try {
          await ctx.deleteMessage();
        } catch (e) {}
        await getMenu(ctx);
      } else {
        await getMenu(ctx, true);
      }
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = composer;
