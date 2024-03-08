const { Scenes } = require("telegraf");
const kb = require("../../../../keyboars.json");
const utils = require("../../../../utils");

const back = async (ctx, edit = true) => {
  try {
    const userStartCoins = ctx.wizard.state.start_coins;
    ctx.wizard.state.start_coins = null;

    await ctx.scene.leave();

    let user = await utils.getUserData(ctx.chat.id);
    if(!user) {
        await utils.createUser(ctx.from.id, ctx.from.first_name);
        user = await utils.getUserData(ctx.from.id);
    }
    let stat = await utils.getUserStats(ctx.chat.id);
    if(!stat) {
        await utils.createUserStats(ctx.from.id);
        stat = await utils.getUserStats(ctx.chat.id);
    }
    let txt = "🤫Перед использованием - внимательно прочтите F.A.Q.\n\n";
    txt += "Здесь кейсы на любой вкус и выбор\n\n";
    txt += "Стоимость кейсов 💰:\n";
    txt += "▫️ NT (Nothing Team) Кейс: 10 💰\n";
    txt += "▫️ Кейс за друзей: 10 💰\n";
    txt += "▫️ Рулетка: 100 💰\n";
    txt += "▫️ Кейс Пепсы: 300 💰\n";
    txt += "▫️ HIGH RISK: 100 💰\n";
    txt += "▫️ HIGH RISK Premium: 1000 💰\n";
    txt += "▫️ СД (счастливый дроп): 6000 💰\n";
    txt += "▫️ СД премиум: 20000 💰\n";
    txt += "▫️ Возвышение: 0 💰\n\n";
    txt += `Всего кейсов открыто: ${
      stat?.cases_opened ? stat.cases_opened : 0
    }🧨\n`;
    txt += `Твой баланс: ${user.coins} 💰(${
      userStartCoins > user.coins ? "-" : "+"
    }${
      userStartCoins > user.coins
        ? userStartCoins - user.coins
        : user.coins - userStartCoins
    })\n`;

    if (edit) {
      try {
        await ctx.editMessageText(txt, kb.cases_menu);
      } catch (e) {}
    } else {
      await ctx.reply(txt, kb.cases_menu);
    }
  } catch (e) {
    console.log(e);
    await ctx.reply(
      "Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot"
    );
  }
};

const wizard_scenes = new Scenes.WizardScene(
  "elevation",
  async (ctx) => {
    try {
      const user = await utils.getUserData(ctx.from.id);
      let txt = "60 гемов - тоже гемы...\n";
      txt += "Но видимо ты другого мнения";
      txt += "Испытаешь удачу?😉";

      await ctx.reply(txt, kb.elevation_start);
      await ctx.answerCbQuery();

      ctx.wizard.state.start_coins = user.coins;

      return ctx.wizard.next();
    } catch (e) {
      console.log(e);
      await ctx.reply(
        "Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot"
      );
      await back(ctx, false);
    }
  },

  async (ctx) => {
    try {
      const cb_data = ctx.callbackQuery?.data;

      if (cb_data === "start_case") {
        const dropping = await dropCase(ctx);
        if (dropping) return ctx.wizard.next();
      } else {
        await back(ctx);
      }
    } catch (e) {
      console.log(e);
      await ctx.reply(
        "Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot"
      );
      await back(ctx, false);
    }
  },

  async (ctx) => {
    try {
      cb_data = ctx.callbackQuery?.data;

      if (cb_data === "try_again") {
         await dropCase(ctx);
      } else {
        await back(ctx);
      }
    } catch (e) {
      console.log(e);
      await ctx.reply(
        "Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot"
      );
      await back(ctx, false);
    }
  }
);

async function dropCase(ctx) {
  const user = await utils.getUserData(ctx.from.id);
  if (user.gems >= 1) {
    const updatedGems = user.gems - 1;
    await utils.updateUserData(ctx.from.id, "gems", updatedGems);

    const possRes = [
      { result: "Благословение полой луны 🌙", chance: 10 },
      { result: "lose", chance: 90 },
    ];
    utils.increaseUserCaseOpened(ctx.from.id);
    const result = await utils.getRandomResult(possRes);
    if (result.result == "lose") {
      let txt = "Увы, эти гемы Nothing съел на обед..\n";
      txt += "Попробуем ещё раз?😉";
      try {
        await ctx.reply(txt, kb.back_try_again_cases_menu);
      } catch (e) {}
      await ctx.answerCbQuery();
      return true;
    } else {
      await utils.updateUserData(ctx.chat.id, "items", user.items + 1); // Обновляем предметы в базе данных

      let txt = "Вы только посмотрите на этого счастливчика!\n";
      txt += "Невероятно, 🌙 твоя! 🍾";
      try {
        await ctx.reply(txt, kb.back_try_again_cases_menu);
      } catch (e) {}
      await ctx.answerCbQuery();
      return true;
    }
  } else {
    await ctx.answerCbQuery("Недостаточно гемов");
    await back(ctx, true);
    return false;
  }
}

module.exports = wizard_scenes;
