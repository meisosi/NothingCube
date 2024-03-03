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
  "friend_case",
  async (ctx) => {
    try {
      const user = await utils.getUserData(ctx.chat.id)

      let txt = 'Здесь ты можешь забрать монетки за друзей!\n'
      txt += `Приводи 10 друзей и открывай кейс!\n\n`
      txt += `Кидай кубик, этот кейс для тебя⚡️`
      const mes = await ctx.reply(txt, kb.friend_case_start)

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
      const cost = user.vip_status > 0 ? 5 : 10;

      if (cb_data && cb_data === 'drop_friend') {
        if (user.coins < cost) {
          let txt = `К сожалению, у тебя не хватает монеток для открытия. Тебе нужно ${cost} монеток.\n\n`;
          txt += 'Ты можешь продолжить копить, либо попробовать другие мини-игры.\n\n';
          txt += 'P.S. Если же не хочешь ждать - можешь заглянуть в "❤️ Поддержать"';
          await ctx.editMessageText(txt, kb.back_cases_menu);
          return ctx.wizard.next()
        }

        if (user.friend_coin < cost) {
          let txt = 'У тебя недостаточно рефералов\n'
          await ctx.editMessageText(txt, kb.back_cases_menu);
          return ctx.wizard.next()
        }
        user.coins = user.coins - cost;
        user.friend_coin = user.friend_coin - cost;

        await utils.updateUserData(ctx.chat.id, 'coins', user.coins);
        await utils.updateUserData(ctx.chat.id, 'friend_coin', user.friend_coin);
    
        const diceResult = await ctx.replyWithDice();
        const selectedResult = diceResult.dice.value;
        
        const rewards = {
          1: { name: "10 монет 💰", type: "coins", amount: 10 },
          2: { name: "30 монет 💰", type: "coins", amount: 30 },
          3: { name: "100 монет 💰", type: "coins", amount: 100 },
          4: { name: "200 монет 💰", type: "coins", amount: 200 },
          5: { name: "500 монет 💰", type: "coins", amount: 500 },
          6: { name: "1000 монет 💰", type: "coins", amount: 1000 },
        };

        await new Promise(resolve => setTimeout(resolve, 5000)); // Задержка в 5 секунд

        await ctx.deleteMessage(ctx.wizard.state.mid)
        await utils.increaseUserCaseOpened(ctx.chat.id);

        const rewardInfo = rewards[selectedResult];

        if (rewardInfo.type === "coins") {
          await utils.updateUserData(ctx.chat.id, 'coins', user.coins + rewardInfo.amount);
        }

        let txt = `Поздравляем! Тебе выпало: ${rewardInfo.name}\n`
        txt += `Твой баланс: ${user.coins + rewardInfo.amount} 💰`

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
