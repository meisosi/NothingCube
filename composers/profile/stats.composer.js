const { Composer, session } = require('telegraf')
const composer = new Composer()
const kb = require('../../keyboars.json')
const utils = require('../../utils')

composer.action("statistic", async (ctx) => {
    try {
        const user = await utils.getUserData(ctx.chat.id)
        const stat = await utils.getUserStats(ctx.chat.id)

        if (!stat) {
            await utils.createUserStats(ctx.chat.id)
        }
        const today = new Date()
        const delta_days = parseInt(Math.floor((today - user.created_at)) / (1000 * 60 * 60 * 24))

        let txt = `${ctx.chat.username}, мы с тобой кидаем кубик уже ${delta_days} дней.\n\n`
        txt += `Бросков кубика: ${stat.rolls} раз\n`
        txt += `Кейсов открыто: ${stat.cases_opened} раз\n`
        txt += `Выпало: ${stat.earned} 💰.\n\n`
        txt += 'Спасибо за пользование кубиком❤️!'
        await ctx.editMessageText(txt, kb.stats_menu)
    }catch (e) {
        console.log(e)
    }
})


module.exports = composer