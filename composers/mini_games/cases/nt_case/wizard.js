const { Scenes } = require('telegraf')
const kb = require('../../../../keyboars.json')
const utils = require('../../../../utils')

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

const wizard_scenes = new Scenes.WizardScene(
  "nt_case",
  async (ctx) => {
    try {
      const user = await utils.getUserData(ctx.chat.id);

      let txt = 'Это кейс от нашей команды Nothing Team!\n'
      txt += 'Здесь ты можешь получить 1000 💰 !\n\n'
      txt += `Но есть одно но.. Шанс выпадения всего 1%\n`
      txt += 'Удачи 🍀\n\n'
      txt += `Твой баланс: ${user.coins} 💰`
      


      const mes = await ctx.reply(txt, kb.nt_case_start)
      ctx.wizard.state.mid = mes.message_id
      return ctx.wizard.next()
    } catch (e) {
      console.log(e)
      await ctx.reply('Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot')
      await back(ctx, false)
    }
  },

  async (ctx) => {
    try {
      const user = await utils.getUserData(ctx.chat.id)
      const cb_data = ctx.callbackQuery?.data;

      if (cb_data === 'start_case') {

        if (user.coins >= 10) {
          const updatedCoins = user.coins - 10;
          await utils.updateUserData(ctx.chat.id, 'coins', updatedCoins);

          const possRes = [
            { result: '1000 монет', chance: 0.1 },
            { result: 'lose', chance: 99.9 },
          ]
          await utils.increaseUserCaseOpened(ctx.chat.id)
          const result = await utils.getRandomResult(possRes);
          
          if (result.result == 'lose') {
            let txt = 'Увы, тебе досталось Nothing..\n'
            txt += 'Попробуем ещё раз?😉'
            try {
              await ctx.editMessageText(txt, kb.back_try_again_cases_menu)
            } catch (e) {

            }
            return ctx.wizard.next()
          } else {
            await utils.updateUserData(ctx.chat.id, 'coins', user.coins + 1000); // Обновляем предметы в базе данных

            let txt = 'Сегодня вам выпало благославение Игоря и вы выиграли 1000 💰'

            try {
              await ctx.editMessageText(txt, kb.back_try_again_cases_menu);
            } catch (e) {

            }
            return ctx.wizard.next()
          }

        } else {
          let txt = 'К сожалению, у тебя не хватает монеток или гемов для открытия..\n\n'
          txt += 'Ты можешь продолжить копить, либо попробовать другие мини-игры.\n\n'
          txt += 'P.S. Если же не хочешь ждать - можешь заглянуть в "❤️ Поддержать"'
          try {
            await ctx.editMessageText(txt, kb.back_cases_menu);
          } catch (e) {

          }
          return ctx.wizard.next()
        }
      } else {
        await back(ctx)
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

)

module.exports = wizard_scenes