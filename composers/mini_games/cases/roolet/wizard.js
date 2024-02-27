const { Scenes, Markup } = require('telegraf');
const kb = require('../../../../keyboars.json')
const utils = require('../../../../utils');

const back = async (ctx, edit = true) => {
  try {
    await ctx.scene.leave()
    const stat = await utils.getUserStats(ctx.chat.id)

    let txt = '🤫Перед использованием - внимательно прочтите F.A.Q.\n\n'
    txt += 'Здесь кейсы на любой вкус и выбор\n'
    txt += 'В скобках указана цена за кейс в 💰\n\n'
    txt += `Всего кейсов открыто: ${stat.cases_opened}`

    if (edit) {
      try {
        await ctx.editMessageText(txt, kb.cases_menu);
      } catch (e) {

      }
    } else {
      await ctx.reply(txt, kb.cases_menu);
    }
  } catch (e) {
    console.log(e)
    await ctx.reply('Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot')

  }
}

const russianRouletteScene = new Scenes.WizardScene(
  "russian_roulette",
  async (ctx) => {
    await ctx.reply('Вы хотите начать игру "Русская рулетка" или вернуться назад?', Markup.inlineKeyboard([
      Markup.button.callback('Начать игру', 'start_game'),
      Markup.button.callback('Вернуться назад', 'cases_menu')
    ]));
    return ctx.wizard.next();
  },

  async (ctx) => {
    const user = await utils.getUserData(ctx.chat.id);
    if (user.coins < 100) {
      await ctx.reply('К сожалению, у Вас недостаточно монет для игры.');
      return ctx.scene.leave();
    }
    await utils.updateUserData(ctx.chat.id, 'coins', user.coins - 100);

    ctx.wizard.state.attempts = 0;
    await ctx.reply('Игра "Русская рулетка" началась. Нажмите "Выстрелить" для начала.', Markup.inlineKeyboard([
      Markup.button.callback('Выстрелить', 'shoot')
    ]));
    return ctx.wizard.next();
  },

  async (ctx) => {
    const lossChances = [16, 32, 48, 64];
    const attempt = ctx.wizard.state.attempts;
    const isLost = Math.random() * 100 < lossChances[attempt];

    if (isLost) {
      await ctx.replyWithSticker('CAACAgIAAxkBAAELkQtl3g8BQCI1NB1Y4O7QrcwyI30nLAACGi0AAiEL6ElPYSE3ilVrDTQE'); // ID стикера
      setTimeout(async () => {
        await ctx.deleteMessage();
        await ctx.reply('К сожалению, вы проиграли. Попробуйте еще раз!');
      }, 4000);
      return ctx.scene.leave();
    }

    ctx.wizard.state.attempts += 1;

    if (ctx.wizard.state.attempts < 3) {
      await ctx.reply(`Вы выжили! Попытка ${ctx.wizard.state.attempts + 1}. Нажмите "Выстрелить" для продолжения.`, Markup.inlineKeyboard([
        Markup.button.callback('Выстрелить', 'shoot')
      ]));
      return;
    } else if (ctx.wizard.state.attempts === 3) {
      await ctx.reply('Поздравляем, вы выжили! Вы можете забрать 200 монеток или рискнуть с четвертым выстрелом за 400 монеток.', Markup.inlineKeyboard([
        Markup.button.callback('Забрать 200 монеток', 'take_200'),
        Markup.button.callback('Рискнуть', 'shoot')
      ]));
      return;
    } else {
      // Пользователь выиграл 400 монеток
      const user = await utils.getUserData(ctx.chat.id);
      await utils.updateUserData(ctx.chat.id, 'coins', user.coins + 400);
      await ctx.reply('Поздравляем, вы выиграли 400 монеток!');
      return ctx.scene.leave();
    }
  },

  async (ctx) => {
    try {
      cb_data = ctx.callbackQuery?.data
  
      if ((cb_data === 'try_again')) {
        ctx.scene.reenter()
      } else {
        await back(ctx)
      }
    } catch (e) {
      console.log(e)
      await ctx.reply('Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot')
      await back(ctx, false)
    }
  }
);

russianRouletteScene.action('shoot', (ctx) => ctx.wizard.steps[1](ctx));
russianRouletteScene.action('take_200', async (ctx) => {
  const user = await utils.getUserData(ctx.chat.id);
  await utils.updateUserData(ctx.chat.id, 'coins', user.coins + 200);
  await ctx.reply('Вы забрали 200 монеток!');
  ctx.scene.leave();
});

module.exports = russianRouletteScene;