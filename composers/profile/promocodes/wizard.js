const { Scenes } = require("telegraf");
const kb = require("../../../keyboars.json");
const utils = require("../../../utils");

const back = async (ctx, edit = false) => {
  try {
    await ctx.scene.leave();
    const user = await utils.getUserData(ctx.from.id);
    let stat = await utils.getUserStats(ctx.from.id);
    if (!stat) {
        await utils.createUserStats(ctx.from.id)
        stat = await utils.getUserStats(ctx.from.id)
    }
    const today = new Date()
    const delta_days = parseInt(Math.floor((today - user.created_at)) / (1000 * 60 * 60 * 24))
    let txt = `${ctx.from.first_name}, мы с тобой кидаем кубик уже ${delta_days} дней.\n\n`
    txt += `Бросков кубика: ${stat.rolls} раз\n`
    txt += `Кейсов открыто: ${stat.cases_opened} раз\n`
    txt += `Выпало: ${stat.earned} 💰.\n\n`
    txt += `Вот, что у тебя есть:\n\n`;
    txt += `Твой баланс: ${user.coins} 💰\n`;
    txt += `Твои броски: ${user.rolls} 🎲\n\n`;
    txt += 'Спасибо за пользование кубиком❤️!'
    try {
      if(edit) {
        await ctx.editMessageText(txt, kb.profile_menu)
      }
      else {
        await ctx.reply(txt, kb.profile_menu);
      }
    } catch (e) {
      console.log(e);
      await ctx.reply(
        "Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot"
      );
    }
  } catch (e) {
    console.log(e);
  }
};

const wizard_scenes = new Scenes.WizardScene(
  "promocodes",
  async (ctx) => {
    try {
      let txt = "У тебя есть 🌟 Промокод ?\n";
      txt += "Отлично, напиши его сюда, а мы начислим награду!";

      const mes = await ctx.sendMessage(txt, kb.promocodes_start);
      ctx.wizard.state.mid = mes.message_id;
      return ctx.wizard.next();
    } catch (e) {
      console.log(e);
      await ctx.reply(
        "Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot"
      );
      await back(ctx);
    }
  },

  async (ctx) => {
    try {
      const user = await utils.getUserData(ctx.from.id);

      if (ctx.message) {
        await ctx.deleteMessage(ctx.wizard.state.mid);
        const promo_name = ctx.message.text.toLowerCase();
        const promo = await utils.getPromocode(promo_name);

        if (!promo || promo.activations <= 0) {
          const txt = promo
            ? "К сожалению, этот промокод закончился :(\nСоветуем включить уведомления на канале @genshinnothing, чтобы не пропустить новые промокоды!"
            : "К сожалению, этого промокода не существует...\nСоветуем включить уведомления на канале @genshinnothing, чтобы не пропустить новые промокоды!";

          await ctx.reply(txt, kb.promocodes_start);
          return ctx.wizard.next();
        }

        if (await utils.findPromocodeUses(ctx.from.id, promo_name)) {
          const txt =
            "Ты уже вводил этот промокод!\nСоветуем включить уведомления на канале @genshinnothing, чтобы не пропустить новые промокоды!";
          await ctx.reply(txt, kb.promocodes_start);
          return ctx.wizard.next();
        }

        await utils.decreasePromoActivations(promo_name);
        await utils.updateUserData(ctx.from.id,promo.type,user[promo.type] + promo.count);
        await utils.addUserPromoUse(ctx.from.id, promo_name);

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
        return await back(ctx);
      } else if(ctx?.callbackQuery){
        ctx.answerCbQuery();
        return await back(ctx, true);
      }
      else {
        return await back(ctx);
      }
    } catch (e) {
      console.log(e);
      await ctx.reply(
        "Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot"
      );
      await back(ctx);
    }
  }
);

module.exports = wizard_scenes;
