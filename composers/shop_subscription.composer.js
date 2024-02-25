const { Composer, Telegraf } = require('telegraf')
const composer = new Composer()
const kb = require('../keyboars.json')
const utils = require('../utils')
const token = process.env.TOKEN_BOT
const bot = new Telegraf(token)

composer.action("shop_subscription", async (ctx) => {
  try {
    let txt = "Здесь Вы можете оформить подписку, чтобы поддержать наш проект.\n\n"
    txt += "Каждый день подписки будет давать Вам 3 доп.броска ежедневно\n\n"
    txt += "Стоимость подписки и срок действия:\n"
    txt += "30 дней - 199 рублей\n"
    txt += "60 дней - 349 рублей\n"
    txt += "120 дней - 599 рублей\n"
    txt += "180 дней - 799 рублей\n\n"
    txt += "Спасибо, что помогаете развитию проекта❤️"

    await ctx.editMessageText(txt, kb.subscription_menu)
  } catch (e) {
    console.log(e)
  }
})

// Добавляем обработчик для подписок
composer.action("subscription_7d", async (ctx) => {
  try {
    await subscriptionConfirmation(ctx, 30, 199);
  } catch (e) {
    console.log(e);
  }
});

composer.action("subscription_30d", async (ctx) => {
  try {
    await subscriptionConfirmation(ctx, 60, 349);
  } catch (e) {
    console.log(e);
  }
});

composer.action("subscription_180d", async (ctx) => {
  try {
    await subscriptionConfirmation(ctx, 120, 599);
  } catch (e) {
    console.log(e);
  }
});

composer.action("subscription_365d", async (ctx) => {
  try {
    await subscriptionConfirmation(ctx, 180, 799);
  } catch (e) {
    console.log(e);
  }
});

// Функция для подтверждения подписки
const subscriptionConfirmation = async (ctx, days, price) => {
  try {
    let txt = `Вы выбрали подписку на ${days} дней за ${price} рублей.\n\n`;
    txt += "Подтвердите свой выбор:";
    ctx.scene.state.days = days;
    ctx.scene.state.price = price;
    await ctx.editMessageText(txt, kb.subscription_confirm);
  } catch (e) {
    console.log(e);
  }
};

// Обработчик подтверждения подписки
composer.action("subscription_confirm", async (ctx) => {
  try {
    const days = ctx.scene.state.days;
    const price = ctx.scene.state.price;
    await subscriptionSuccess(ctx, days, price);
  } catch (e) {
    console.log(e);
  }
});

// Функция для успешного завершения подписки
const subscriptionSuccess = async (ctx, days, price) => {
  try {
    const user = await utils.getUserData(ctx.from.id)

    let txt = `Благодарим Вас за поддержку проекта ❤️\n\n`;
    txt += `Вы выбрали подписку на ${days} дней за ${price} рублей\n\n`;
    txt += 'Для оплаты - напишите @nothingtg для получения реквизитов'

    const withdrawalRequest = `Пользователь @${user.nickname} хочет оформить подписку на ${days} дней за ${price} руб.`;
        
    await bot.telegram.sendMessage(process.env.SUPPORT_ACCOUNT, withdrawalRequest)
    await ctx.editMessageText(txt, kb.subscription_success)
  } catch (e) {
    console.log(e);
  }
};

module.exports = composer;
