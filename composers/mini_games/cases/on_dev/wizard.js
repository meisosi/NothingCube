const { Scenes } = require('telegraf')
const kb = require('../../../../keyboars.json')
const utils = require('../../../../utils')

const back = async (ctx, edit = true) => {
    try {
        await ctx.scene.leave()
        const stat = await utils.getUserStats(ctx.from.id)

        let txt = '🤫Перед использованием - внимательно прочтите F.A.Q.\n\n'
        txt += 'Здесь кейсы на любой вкус и выбор\n'
        txt += 'В скобках указана цена за кейс в 💰\n\n'
        txt += `Всего кейсов открыто: ${stat.cases_opened}`
        
        if (edit) {
            try {
                await ctx.editMessageText(txt, kb.cases_menu);
            }catch (e) {

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
    "on_dev",
    async (ctx) => {
        try {
            const user = await utils.getUserData(ctx.from.id)
            let txt = 'На разаработке\n\n'
            txt += `Твой баланс: ${user.coins} 💰`
            const mes = await ctx.editMessageText(txt, kb.back_cases_menu)
            ctx.wizard.state.mid = mes.message_id
            return ctx.wizard.next()
        }catch (e) {
            console.log(e)
            await ctx.reply('Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot')
            await back(ctx, false)
        }
    },

    async (ctx) => {
        try {
            const user = await utils.getUserData(ctx.from.id)
            cb_data = ctx.callbackQuery.data

            if ( (cb_data === 'try_again')) {
                ctx.scene.reenter()
            } else {
                await back(ctx)
            }
        }catch (e) {
            console.log(e)
            await ctx.reply('Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot')
            await back(ctx, false)
        }
    }

)

module.exports = wizard_scenes