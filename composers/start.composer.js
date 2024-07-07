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

const getMenu = async (ctx, arg = null, edit = false) => {
  let user = await utils.getUserData(ctx.from.id);
  let stat = await utils.getUserStats(ctx.from.id);

  if (!user) {
    let username = ctx.from.first_name;
    await utils.createUser(ctx.from.id, username);
    user = await utils.getUserData(ctx.from.id);
  }

  if (!stat) {
    await utils.createUserStats(ctx.from.id);
    stat = await utils.getUserStats(ctx.from.id);
  }

  if(arg) {
    let action = arg.split('_')[0];
    if(action == 'promo') {
      let code = arg.slice(arg.indexOf('_') + 1);
      const promo = await utils.getPromocode(code);

      if (!promo || promo.activations <= 0) {
        const txt = promo
          ? "К сожалению, этот промокод закончился :(\nСоветуем включить уведомления на канале @genshinnothing, чтобы не пропустить новые промокоды!"
          : "К сожалению, этого промокода не существует...\nСоветуем включить уведомления на канале @genshinnothing, чтобы не пропустить новые промокоды!";

        await ctx.reply(txt, kb.promocodes_start);
      }

      else if (await utils.findPromocodeUses(ctx.from.id, code)) {
        const txt =
          "Ты уже вводил этот промокод!\nСоветуем включить уведомления на канале @genshinnothing, чтобы не пропустить новые промокоды!";
        await ctx.reply(txt, kb.promocodes_start);
      }
      else {
        await utils.decreasePromoActivations(code);
        await utils.updateUserData(ctx.from.id,promo.type,user[promo.type] + promo.count);
        await utils.addUserPromoUse(ctx.from.id, code);
  
        if (promo.type === "vip_status") {
          const rollsToAdd =
            promo.count >= 7 ? parseInt(process.env.ROLLS_ON_SUB) - 1 : 0;
          const coinsToAdd =
            promo.count >= 7
              ? parseInt(process.env.COINS_ON_7)
              : promo.count >= 30
              ? parseInt(process.env.COINS_ON_30)
              : promo.count >= 183
              ? parseInt(process.env.COINS_ON_183)
              : promo.count >= 365
              ? parseInt(process.env.COINS_ON_365)
              : 0;
  
          await utils.updateUserData(ctx.from.id,"rolls",user.rolls + rollsToAdd);
          await utils.updateUserData(ctx.from.id,"coins",user.coins + coinsToAdd);
        }
  
        let txt = "Успех!\n";
        let txtType = "";
        switch (promo.type) {
          case "coins":
            txtType = await utils.getDeclension(
              promo.count,
              "монетку",
              "монетки",
              "монеток"
            );
            break;
          case "gems":
            txtType = await utils.getDeclension(
              promo.count,
              "пакет по 60 гемов",
              "пакета по 60 гемов",
              "пакетов по 60 гемов"
            );
            break;
          case "rolls":
            txtType = await utils.getDeclension(
              promo.count,
              "бросок",
              "броска",
              "бросков"
            );
            break;
          case "items":
            txtType = await utils.getDeclension(
              promo.count,
              "благословение полной луны",
              "благословения полной луны",
              "благословений полной луны"
            );
            break;
          case "vip_status":
            txtType = await utils.getDeclension(
              promo.count,
              "день подписки",
              "дня подписки",
              "дней подписки"
            );
            break;
          case "friend_coin":
            txtType = await utils.getDeclension(
              promo.count,
              "монетку друга",
              "монетки друга",
              "монеток друга"
            );
              break;
          default:
            txtType = await getDeclension(
              promo.count,
              "монетку",
              "монетки",
              "монеток"
            );
            break;
        }
        txt += `За активацию промокода мы начислили тебе: ${promo.count} ${txtType}`;
        await ctx.reply(txt, kb.promocodes_start);
      }
    }
    else if(action == 'ref') {
      let referal = arg.slice(arg.indexOf('_') + 1);
      const userId = ctx.from.id; 
      let userDB = await utils.getUserData(userId);
      const createDate = new Date(userDB.created_at);
      if(((new Date().getTime() - createDate.getTime())/(1000*60) < 30) && !userDB.referal_id) {
        if(referal.startsWith('ad')) {
          referal = referal.slice(2)
          const adId = parseInt(referal);
          utils.addAdViews(adId);
          utils.linkReferal(userId, -1);
          ctx.sendMessage("За приглашение вы получили 100 монеток!");
          userDB.coins = userDB.coins + 100;
        }
        else {
          const referalId = parseInt(referal);
          const userReferal = await utils.getReferals(referalId);
          if(userReferal) {
            utils.addReferal(userId, referalId);
            utils.linkReferal(userId, referalId);
            ctx.sendMessage("За приглашение вы получили 100 монеток!");
            userDB.coins = userDB.coins + 100;
            const refInventory = await utils.getUserData(referalId);
            refInventory.rolls = refInventory.rolls + 1;
            refInventory.friend_coin = refInventory.friend_coin + 1;
            await utils.updateUserData(referalId, 'rolls', refInventory.rolls);
            await utils.updateUserData(referalId, 'friend_coin', refInventory.friend_coin);
            ctx.telegram.sendMessage(referalId, `У вас новый реферал! Поприветсвуйте ${ctx.from?.username || ctx.from.first_name}`)
          }
        }
        await utils.updateUserData(userId, 'coins', userDB.coins)
      }
    }
  }

  let txt = `🫡Привет, ${ctx.from.username}!\n\n`;
  txt +=
    `Привет, ${ctx.chat.username}! Здесь тебя ждут бесплатные гемы 💎 или луны 🌙 для игры Genshin Impact! Так же можешь обменять награду на гемы 💠 или пропуск  🎫 в Honkai: Star Rail!\n\n`;
  txt +=
    `<b>Как получить свою награду?</b>\n\n`;
  txt += `▫️ Кидай кубик 🎲\n`;
  txt += `▫️ Собирай доп. Броски 🎯\n`;
  txt += `▫️ Забирай монетки каждый день с бросков 💰\n`;
  txt += `▫️ Играй в мини игры 🎰\n\n`;
  txt += `Если есть вопросы - загляни в ❓ FAQ. Если обнаружил проблему - обратная связь.\n\n`;
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
    let userDB = await utils.getUserData(ctx.from.id);
    if(ctx.chat.type == 'private') {
      if(!userDB) {
        await utils.createUser(ctx.from.id, ctx.from.first_name);
        userDB = await utils.getUserData(ctx.from.id);
      }
      await ctx.replyWithHTML("Установка меню", kb.menu_kb);
    }
    else {
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
      return await utils.sendSubscribeKeyboard(ctx, ctx.args[0]);
    }
    await getMenu(ctx, ctx.args[0]);
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
      return await ctx.reply(txt, kb.to_bot);
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


composer.action(/back_to_menu(?:-([\w\d]+))?\b/, async (ctx) => {
  try {
    const matchedText = ctx.match[1] || null;
    const chatMember = await bot.telegram.getChatMember(
      `@${process.env.MAIN_CHANEL}`,
      ctx.from.id
    );
    if (chatMember.status !== "member" && chatMember.status !== "administrator" &&chatMember.status !== "creator") {
      return await ctx.answerCbQuery("Вы не подписались на канал!", {show_alert: true});
    } else {
      await ctx.answerCbQuery();
      if (ctx.callbackQuery.message.photo) {
        try {
          await ctx.deleteMessage();
        } catch (e) {}
        await getMenu(ctx, matchedText);
      } else {
        await getMenu(ctx, matchedText, true);
      }
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = composer;
