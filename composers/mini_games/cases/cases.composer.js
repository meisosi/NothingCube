const { Composer, session } = require('telegraf')
const composer = new Composer()
const kb = require('../../../keyboars.json')
const utils = require('../../../utils')

composer.use(session())
composer.use(require('./cases.stage'))

composer.action("cases_menu", async (ctx) => {
    try {
        let user = await utils.getUserData(ctx.chat.id)
        let stat = await utils.getUserStats(ctx.chat.id)

        if (!user) {
            await utils.createUser(ctx.chat.id, ctx.chat.username)
            user = await utils.getUserData(ctx.chat.id)
        }

        if (!stat) {
            await utils.createUserStats(ctx.chat.id)
            stat = await utils.getUserStats(ctx.chat.id)
        }


        let txt = '🤫Перед использованием - внимательно прочтите F.A.Q.\n\n'
        txt += 'Здесь кейсы на любой вкус и выбор\n\n'
        txt += 'Стоимость кейсов 💰:\n'
        txt += '▫️ NT (Nothing Team) Кейс: 10 💰\n'
        txt += '▫️ Кейс за друзей: 10 💰\n'
        txt += '▫️ Кейс Пепсы: 300 💰\n'
        txt += '▫️ HIGH RISK: 100 💰\n'
        txt += '▫️ HIGH RISK Premium: 1000 💰\n'
        txt += '▫️ СД (счастливый дроп): 6000💰\n'
        txt += '▫️ СД премиум: 20000💰\n\n'
        txt += `Всего кейсов открыто: ${stat.cases_opened}`
        await ctx.editMessageText(txt, kb.cases_menu);
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

composer.action("friend_case", async (ctx) => {
    try {
        await ctx.scene.enter('friend_case')
    } catch (e) {
        console.log(e)
    }
})

composer.action("high_risk_prem", async (ctx) => {
    try {
        await ctx.scene.enter('high_risk_prem')
    } catch (e) {
        console.log(e)
    }
})

composer.action("lucky_drop_prem", async (ctx) => {
    try {
        await ctx.scene.enter('lucky_drop_prem')
    } catch (e) {
        console.log(e)
    }
})

composer.action("nt_case", async (ctx) => {
    try {
        await ctx.scene.enter('nt_case')
    } catch (e) {
        console.log(e)
    }
})

composer.action("pepsa_case", async (ctx) => {
    try {
        await ctx.scene.enter('pepsa_case')
    } catch (e) {
        console.log(e)
    }
})

composer.action("russian_roulette", async (ctx) => {
    try {
        await ctx.scene.enter('russian_roulette')
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


module.exports = composer