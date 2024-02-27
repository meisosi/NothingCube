const { Scenes } = require('telegraf')
const kb = require('../../../../keyboars.json')
const utils = require('../../../../utils')
const setTimeoutP = require('timers/promises').setTimeout


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

const wizard_scenes = new Scenes.WizardScene(
  "friend_case",
  async (ctx) => {
    try {
      const user = await utils.getUserData(ctx.chat.id)

      let txt = 'Всегда хотел увидеть эту фразу?😉\n\n'
      txt += `${ctx.chat.username}, кидай кубик - этот раздел для тебя! ⚡️\n\n`
      txt += `Твой баланс: ${user.coins} 💰`
      const mes = await ctx.editMessageText(txt, kb.friend_case)

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
      cb_data = ctx.callbackQuery.data

      if (user.coins < 10) {
        let txt = 'К сожалению, у тебя не хватает монеток или гемов для открытия..\n\n'
        txt += 'Ты можешь продолжить копить, либо попробовать другие мини-игры.\n\n'
        txt += 'P.S. Если же не хочешь ждать - можешь заглянуть в "❤️ Поддержать"'
        await ctx.editMessageText(txt, kb.back_cases_menu);
        return ctx.wizard.next()
      }

      if (user.friend_coin < 10) {
        let txt = 'У тебя недостаточно рефералов\n'
        await ctx.editMessageText(txt, kb.back_cases_menu);
        return ctx.wizard.next()
      }

      if (cb_data && cb_data === 'friend_case') {
        const diceResult = await ctx.replyWithDice();
        const selectedResult = diceResult.dice.value;
        const rewards = {
          1: { name: "10 монет 💰", type: "coins", amount: 5 },
          2: { name: "30 монет 💰", type: "coins", amount: 25 },
          3: { name: "100 монет 💰", type: "coins", amount: 50 },
          4: { name: "200 монет 💰", type: "coins", amount: 75 },
          5: { name: "500 монет 💰", type: "coins", amount: 100 },
          6: { name: "1000 монет 💰", type: "coins", amount: 1000 },
        };


        await new Promise(resolve => setTimeout(resolve, 5000)); // Задержка в 5 секунд

        await ctx.deleteMessage(ctx.wizard.state.mid)
        await utils.increaseUserCaseOpened(ctx.chat.id);

        const rewardInfo = rewards[selectedResult];

        if (rewardInfo.type === "coins") {
          await utils.updateUserData(ctx.chat.id, 'coins', user.coins + rewardInfo.amount);
        }

        await utils.updateUserData(ctx.chat.id, 'coins', user['coins'] - 10);
        await utils.updateUserData(ctx.chat.id, 'friend_coin', user['friend_coin'] - 10);


        let txt = `Поздравляем! Тебе выпало: ${rewardInfo.name}\n`
        txt += `Твой баланс: ${user.coins - 10} 💰`

        await ctx.reply(txt, kb.back_try_again_cases_menu);
        return ctx.wizard.next()

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
      const user = await utils.getUserData(ctx.chat.id)
      const cb_data = ctx.callbackQuery?.data;

      if (cb_data === 'try_again') {
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
