const { Composer } = require("telegraf");
const composer = new Composer();
const kb = require("../keyboars.json");
const utils = require("../utils");
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.TOKEN_BOT);

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
    await ctx.reply(`Ваш id ${ctx.from.id}`, kb.back_call_menu);
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
