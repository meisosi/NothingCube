const { Composer, session } = require('telegraf')
const composer = new Composer()
const kb = require('../../../keyboars.json')
const utils = require('../../../utils')

composer.use(session())
composer.use(require('./cases.stage'))
composer.use(require('./craft.composer'))

composer.action("cases_menu", async (ctx) => {
    try {
        let user = await utils.getUserData(ctx.from.id)
        let stat = await utils.getUserStats(ctx.from.id)

        if (!user) {
            await utils.createUser(ctx.from.id, ctx.from.username)
            user = await utils.getUserData(ctx.from.id)
        }

        if (!stat) {
            await utils.createUserStats(ctx.from.id)
            stat = await utils.getUserStats(ctx.from.id)
        }


        let txt = '🤫Перед использованием - внимательно прочтите F.A.Q.\n\n'
        txt += 'Здесь кейсы на любой вкус и выбор\n'
        txt += 'В скобках указана цена за кейс в 💰\n\n'
        txt += `Всего кейсов открыто: ${stat.cases_opened}`
        await ctx.editMessageText(txt, kb.cases_menu);
    } catch (e) {
        console.log(e)
    }
})

composer.action("on_dev", async (ctx) => {
    try {
        await ctx.scene.enter('on_dev')
    } catch (e) {
        console.log(e)
    }
})

composer.action("lucky_drop", async (ctx) => {
    try {
        await ctx.scene.enter('lucky_drop')
    } catch (e) {
        console.log(e)
    }
})

composer.action("high_risk", async (ctx) => {
    try {
        await ctx.scene.enter('high_risk')
    } catch (e) {
        console.log(e)
    }
})

composer.action("elevation", async (ctx) => {
    try {
        await ctx.scene.enter('elevation')
    } catch (e) {
        console.log(e)
    }
})

composer.action("money_game", async (ctx) => {
    try {
        await ctx.scene.enter('money_game')
    } catch (e) {
        console.log(e)
    }
})

module.exports = composer