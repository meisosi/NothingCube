const { Scenes, Markup } = require('telegraf');
const kb = require('../../../../keyboars.json')
const utils = require('../../../../utils');

const back = async (ctx, edit = true) => {
  try {
    await ctx.scene.leave()
    const user = await utils.getUserData(ctx.chat.id);
    const stat = await utils.getUserStats(ctx.chat.id)

    let txt = '🤫Перед использованием - внимательно прочтите F.A.Q.\n\n'
        txt += 'Здесь кейсы на любой вкус и выбор\n\n'
        txt += 'Стоимость кейсов 💰:\n'
        txt += '▫️ NT (Nothing Team) Кейс: 10 💰\n'
        txt += '▫️ Кейс за друзей: 10 💰\n'
        txt += '▫️ Рулетка: 100 💰\n'
        txt += '▫️ Кейс Пепсы: 300 💰\n'
        txt += '▫️ HIGH RISK: 100 💰\n'
        txt += '▫️ HIGH RISK Premium: 1000 💰\n'
        txt += '▫️ СД (счастливый дроп): 6000 💰\n'
        txt += '▫️ СД премиум: 20000 💰\n'
        txt += '▫️ Возвышение: 0 💰\n\n'
        txt += `Всего кейсов открыто: ${stat?.cases_opened ? stat.cases_opened : 0}🧨\n`
        txt += `Твой баланс: ${user.coins} 💰\n`

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
    try {
      let startTxt = 'Вы выбрали игру "Русская рулетка".\n\n';
        startTxt += 'У вас будет три попытки, чтобы выжить и забрать 200 монеток 💰. После трех попыток - вы можете использовать последнюю попытку и сорвать куш в 400 монеток 💰\n\n!';
        startTxt += 'Но, если проиграешь - твои монетки сгорят, а дни будут сочтены..☠️\n\n'
        startTxt += 'Начинаем или вернуться назад? 🔫.'
      const mes = await ctx.reply(startTxt, Markup.inlineKeyboard([
        Markup.button.callback('Начать игру', 'start_game'),
        Markup.button.callback('Вернуться назад', 'cases_menu')
      ]));

      ctx.wizard.state.mid = mes.message_id;
      return ctx.wizard.next()
    } catch (e) {
        console.log(e)
        await ctx.reply('Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot')
        await back(ctx, false)
    }
  },

  async (ctx) => {
    try {
      const user = await utils.getUserData(ctx.from.id);
      const cb_data = ctx.callbackQuery?.data;
      if(cb_data == 'start_game') {
        if (user.coins < 100) {
          await ctx.reply('К сожалению, у Вас недостаточно монет для игры.');
          return await back(ctx);
        }
        ctx.wizard.state.attempts = 0;
        
        await ctx.reply('Игра началась! Делаем первый выстрел...', Markup.inlineKeyboard([
          Markup.button.callback('Выстрелить', 'shoot')
        ]));
        await utils.updateUserData(ctx.from.id, 'coins', user.coins - 100);
        await utils.increaseUserCaseOpened(ctx.from.id);
      }
      else if (cb_data == 'shoot') {
        const lossChances = [1, 1, 99, 99];
        const attempt = ctx.wizard.state.attempts;
        const isLost = Math.random() * 100 < lossChances[attempt];
  
        if (isLost) {
          await ctx.replyWithSticker('CAACAgIAAxkBAAED3SRl5FGz7lDC8jy6M3TJ8ya0xJmvsQACjlAAAoY1EEtnS4RS9ahPMzQE'); // ID стикера
          await ctx.deleteMessage();
          await ctx.reply('К сожалению, вы проиграли. Попробуйте еще раз!');
          return await back(ctx, false);
        }
  
        ctx.wizard.state.attempts += 1;
  
        if (ctx.wizard.state.attempts < 3) {
          await ctx.reply(`Вы выжили, но патрон всё ещё в барабане.. Стреляй, у тебя ещё ${3 - ctx.wizard.state.attempts} выстрела!`, Markup.inlineKeyboard([
            Markup.button.callback('Выстрелить', 'shoot')
          ]));
          return;
        } else if (ctx.wizard.state.attempts === 3) {
          let winTxt = 'Дрожащими руками ты нажал на курок и снова удача оказалась на твоей стороне! Ты выжил..\n\n'
          winTxt += 'У тебя есть возможность забрать 200 монеток 💰 или сделать последний выстрел и забрать 400 монеток 💰'
          winTxt += 'Идём до конца?☠️';

          await ctx.reply(winTxt, Markup.inlineKeyboard([
            Markup.button.callback('Забрать 200 монеток', 'take_200'),
            Markup.button.callback('Рискнуть', 'shoot')
          ]));
          return;
        } else if (ctx.wizard.state.attempts === 4){
          // Пользователь выиграл 400 монеток
          const user = await utils.getUserData(ctx.chat.id);
          await utils.updateUserData(ctx.chat.id, 'coins', user.coins + 400);
          await ctx.reply('Поздравляем, вы выиграли 400 монеток!');
          return ctx.scene.leave();
        }
      } 
      else if(cb_data == 'cases_menu'){
        return await back(ctx)
      }
    } catch (e) {
        console.log(e)
        await ctx.reply('Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot')
        await back(ctx, false)
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
  await back(ctx, false)
});

module.exports = russianRouletteScene;