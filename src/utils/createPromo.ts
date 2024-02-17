import { Context, Markup } from 'telegraf';
import { botUtils } from './utils'; // Предполагается, что экземпляр BotUtils уже импортирован

class PromoCodeCreator {
  static async createPromo(ctx: Context): Promise<void> {
    const userId = ctx.from.id;
    const user = await botUtils.getUser(userId);

    if (!user.premium) {
      return ctx.reply('Эта функция доступна только для пользователей с премиум аккаунтом.');
    }

    const userCoins = await botUtils.getUserCoins(userId);
    if (userCoins < 1000) {
      return ctx.reply('Недостаточно монет для создания промокода. Необходимо минимум 1000 монет.');
    }

    await botUtils.updateUserCoins(userId, userCoins - 1000);
    ctx.reply('Выберите количество активаций для промокода:', Markup.keyboard([
      ['100 активаций - 10 монет', '50 активаций - 20 монет'],
      ['25 активаций - 40 монет', '10 активаций - 100 монет']
    ]).oneTime().resize());
  }

  static async onActivationsSelected(ctx: Context, match: RegExpMatchArray): Promise<void> {
    const activations = parseInt(match[1], 10);
    const coinsPerActivation = parseInt(match[2], 10);

    const userId = ctx.from.id;
    await botUtils.setUserState(userId, { activations, coinsPerActivation });

    ctx.reply('Введите название промокода:');
  }

  static async onPromoNameEntered(ctx: Context): Promise<void> {
    const userId = ctx.from.id;
    const userState = await botUtils.getUserState(userId);

    if (!userState || !userState.activations) {
      return;
    }

    const promoCodeName = ctx.message.text;
    await botUtils.createPromocode(promoCodeName, userState.activations, userState.coinsPerActivation);
    await botUtils.clearUserState(userId);

    ctx.reply(`Промокод "${promoCodeName}" успешно создан.`);
  }
}