import { Context, Markup } from 'telegraf';
import { botUtils } from './utils';

abstract class Case {
  abstract execute(ctx: Context): void;
}

class HighRiskCase extends Case {
  private readonly cost: number = 100;
  private readonly winChance: number = 1;

  async execute(ctx: Context): Promise<void> {
    const userId = ctx.from.id;
    const userCoins = await botUtils.getUserCoins(userId);

    if (userCoins < this.cost) {
      ctx.reply('ТЫ БОМЖ ИДИ НАХУЙ');
      return;
    }

    await botUtils.updateUserCoins(userId, userCoins - this.cost);

    const randomNumber = Math.floor(Math.random() * 100) + 1;

    if (randomNumber === this.winChance) {
      botUtils.updateUserInventory(userId, "moons", 1)
      ctx.reply('ЧЕЛ ХАРОШ');
    } else {
      ctx.reply('ТЫ ЛОХ ХАХАХАХ');
    }
  }
}

class HighRiskPremCase extends Case {
  private readonly cost: number = 1000;
  private readonly winChance: number = 1;

  async execute(ctx: Context): Promise<void> {
    const userId = ctx.from.id;
    const userCoins = await botUtils.getUserCoins(userId);

    if (userCoins < this.cost) {
      ctx.reply('ТЫ БОМЖ ИДИ НАХУЙ');
      return;
    }

    await botUtils.updateUserCoins(userId, userCoins - this.cost);

    const randomNumber = Math.floor(Math.random() * 100) + 1;

    if (randomNumber === this.winChance) {
      botUtils.updateUserInventory(userId, "big_gems", 1)
      ctx.reply('ЧЕЛ ХАРОШ');
    } else {
      ctx.reply('ТЫ ЛОХ ХАХАХАХ');
    }
  }
}

class NTCase extends Case {
  private readonly cost: number = 10;
  private readonly prize: number = 1000;
  private readonly winChance: number = 1;

  async execute(ctx: Context): Promise<void> {
    const userId = ctx.from.id;
    const userCoins = await botUtils.getUserCoins(userId);

    if (userCoins < this.cost) {
      ctx.reply('ТЫ БОМЖ ИДИ НАХУЙ');
      return;
    }

    await botUtils.updateUserCoins(userId, userCoins - this.cost);

    const randomNumber = Math.floor(Math.random() * 100) + 1;
    if (randomNumber === this.winChance) {
      await botUtils.updateUserCoins(userId, userCoins + this.prize);
      ctx.reply(`ЧЕЛ ХАРОШ +${this.prize} КОИНОВ ТЕБЕ`);
    } else {
      ctx.reply('ТЫ ЛОХ ХАХАХАХ');
    }
  }
}

class LuckyDropCase extends Case {
  private readonly cost: number = 6000;

  async execute(ctx: Context): Promise<void> {
    const userId = ctx.from.id;
    const userCoins = await botUtils.getUserCoins(userId);

    if (userCoins < this.cost) {
      ctx.reply('Недостаточно монет для открытия кейса.');
      return;
    }

    await botUtils.updateUserCoins(userId, userCoins - this.cost);

    const dice = await ctx.replyWithDice();
    const diceValue = dice.dice.value;

    setTimeout(() => {
      ctx.deleteMessage(dice.message_id)
        .then(() => this.assignReward(ctx, diceValue, userId))
        .catch(error => console.error('Ошибка при удалении сообщения:', error));
    }, 5000);
  }

  private async assignReward(ctx: Context, diceValue: number, userId: number): Promise<void> {

    switch (diceValue) {
      case 1:
        await botUtils.updateUserInventory(userId, "gems", 1);
        break;
      case 2:
        await botUtils.updateUserInventory(userId, "gems", 2);
        break;
      case 3:
        await botUtils.updateUserInventory(userId, "gems", 3);
        break;
      case 4:
        await botUtils.updateUserInventory(userId, "gems", 4);
        break;
      case 5:
        await botUtils.updateUserInventory(userId, "moon", 1);
        return;
      case 6:
        await botUtils.updateUserInventory(userId, "moon", 1);
        await botUtils.updateUserInventory(userId, "gems", 1);
        break;
      default:
        ctx.reply('Произошла ошибка при определении награды.');
    }
  }
}

class PremiumLuckyDropCase extends Case {
  private readonly cost: number = 20000;

  async execute(ctx: Context): Promise<void> {
    const userId = ctx.from.id;
    const userCoins = await botUtils.getUserCoins(userId);

    if (userCoins < this.cost) {
      ctx.reply('Недостаточно монет для открытия кейса.');
      return;
    }

    await botUtils.updateUserCoins(userId, userCoins - this.cost);

    const dice = await ctx.replyWithDice();
    const diceValue = dice.dice.value;

    setTimeout(async () => {
      try {
        await ctx.deleteMessage(dice.message_id);
      } catch (error) {
        console.error('Ошибка при удалении сообщения:', error);
      }
      this.assignReward(ctx, diceValue, userId);
    }, 5000);
  }

  private async assignReward(ctx: Context, diceValue: number, userId: number): Promise<void> {
    switch (diceValue) {
      case 1:
        await botUtils.updateUserInventory(userId, "gems", 1);
        break;
      case 2:
        await botUtils.updateUserInventory(userId, "gems", 3);
        break;
      case 3:
        await botUtils.updateUserInventory(userId, "moons", 1);
        break;
      case 4:
        await botUtils.updateUserInventory(userId, "moons", 1);
        await botUtils.updateUserInventory(userId, "gems", 2);
        break;
      case 5:
        await botUtils.updateUserInventory(userId, "moons", 2);
        break;
      case 6:
        await botUtils.updateUserInventory(userId, "big_gems", 1)
        break;
      default:
        ctx.reply('Произошла ошибка при определении награды.');
    }
  }
}

class PepsiCase extends Case {
  private readonly cost: number = 300;

  async execute(ctx: Context): Promise<void> {
    const userId = ctx.from.id;
    const userCoins = await botUtils.getUserCoins(userId);

    if (userCoins < this.cost) {
      ctx.reply('Недостаточно монет для открытия кейса.');
      return;
    }

    await botUtils.updateUserCoins(userId, userCoins - this.cost);

    const dice = await ctx.replyWithDice();
    const diceValue = dice.dice.value;

    setTimeout(async () => {
      try {
        await ctx.deleteMessage(dice.message_id);
      } catch (error) {
        console.error('Ошибка при удалении сообщения:', error);
      }
      this.assignReward(ctx, diceValue, userId);
    }, 5000);
  }

  private async assignReward(ctx: Context, diceValue: number, userId: number): Promise<void> {
    switch (diceValue) {
      case 1:
        await botUtils.updateUserCoins(userId, 5);
        break;
      case 2:
        await botUtils.updateUserCoins(userId, 25);
        break;
      case 3:
        await botUtils.updateUserCoins(userId, 50);
        break;
      case 4:
        await botUtils.updateUserCoins(userId, 75);
        break;
      case 5:
        await botUtils.updateUserCoins(userId, 100);
        break;
      case 6:
        await botUtils.updateUserInventory(userId, "gems", 1);
        break;
      default:
        ctx.reply('Произошла ошибка при определении награды.');
    }
  }
}


class RussianRouletteCase {
  private readonly entryCost: number = 100;
  private readonly initialPrize: number = 200;
  private readonly bonusPrize: number = 400;
  private readonly shotsChances: number[] = [16, 32, 48]; // Шансы проиграть на каждом выстреле
  private readonly finalShotChance: number = 64; // Шанс проиграть на последнем, 4-ом выстреле

  async execute(ctx: Context): Promise<void> {
    const userId = ctx.from.id;
    const userCoins = await botUtils.getUserCoins(userId);

    if (userCoins < this.entryCost) {
      ctx.reply('Недостаточно монет для участия.');
      return;
    }

    await botUtils.updateUserCoins(userId, -this.entryCost);
    ctx.reply('Игра началась. У вас есть 3 выстрела.', Markup.replyKeyboard([
      Markup.button.text('Сделать выстрел'),
    ]).oneTime().resize());

    let currentShot = 0;

    ctx.on('text', async (ctx) => {
      if (ctx.message.text === 'Сделать выстрел') {
        const lost = Math.random() * 100 < this.shotsChances[currentShot];
        if (lost) {
          ctx.reply('Вы проиграли.');
          ctx.replyWithSticker("CAACAgIAAxkBAAEDsx5l2My5eogfxjEt0T6_uiX6uqQNBQACGi0AAiEL6ElPYSE3ilVrDTQE");
          return;
        }

        currentShot++;

        if (currentShot === 3) {
          ctx.reply('Вы выиграли 200 монет. Хотите рискнуть и сыграть на 400?', Markup.replyKeyboard([
            Markup.button.text('Сделать 4-ый выстрел'),
            Markup.button.text('Забрать приз')
          ]).oneTime().resize());
        } else {
          ctx.reply(`Выстрел ${currentShot} успешно сделан. Готовы к следующему?`);
        }
      } else if (ctx.message.text === 'Забрать приз') {
        await botUtils.updateUserCoins(userId, this.initialPrize);
        ctx.reply(`Поздравляем! Вы выиграли ${this.initialPrize} монет.`);
      } else if (ctx.message.text === 'Сделать 4-ый выстрел') {
        const lost = Math.random() * 100 < this.finalShotChance;

        if (lost) {
          ctx.reply('Вы проиграли на последнем выстреле.');
          ctx.replyWithSticker("CAACAgIAAxkBAAEDsx5l2My5eogfxjEt0T6_uiX6uqQNBQACGi0AAiEL6ElPYSE3ilVrDTQE");
        } else {
          await botUtils.updateUserCoins(userId, this.bonusPrize);
          ctx.reply(`Поздравляем! Вы выиграли ${this.bonusPrize} монет.`);
        }
      }
    });
  }
}