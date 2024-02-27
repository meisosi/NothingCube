const { Composer } = require('telegraf')
const composer = new Composer()
const kb = require('../keyboars.json')

composer.action("check_subscription", async (ctx) => {
    try {
        const requiredChannels = ['@SladkiySliver', '@genshin_utechki'];
        const isSubscribedToAll = await checkUserSubscriptions(chatId, requiredChannels);
      
          if (isSubscribedToAll) {
            if (user.subscribe_at === 0) {
              const newRolls = user.rolls + requiredChannels.length;
              await updateUserData(chatId, 'rolls', newRolls);
              await updateUserData(chatId, 'subscribe_at', 1);
              await ctx.answerCbQuery(query.id, 'Успех! Вам начислены бонусные броски.');
            } else {
              await ctx.answerCbQuery(query.id, 'Сегодня вы уже собрали все броски.');
            }
          } else {
            await ctx.answerCbQuery(query.id, 'Для получения дополнительных бросков подпишитесь на все обязательные каналы.');
          }
    } catch (e) {
        console.log(e)
    }
})

module.exports = composer