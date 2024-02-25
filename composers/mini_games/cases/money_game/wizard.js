const { Scenes } = require('telegraf')
const kb = require('../../../../keyboars.json')
const utils = require('../../../../utils')

const back = async (ctx, edit = true) => {
    try {
        await ctx.scene.leave()
        const stat = await utils.getUserStats(ctx.chat.id)

        let txt = '🤫Перед использованием - внимательно прочтите F.A.Q.\n\n'
        txt += 'Здесь кейсы на любой вкус и выбор\n'
        txt += 'В скобках указана цена за кейс в 💰\n\n'
        txt += `Всего кейсов открыто: ${stat.cases_opened}`
        
        if (edit) {
            await ctx.editMessageText(txt, kb.cases_menu);
        } else {
            await ctx.reply(txt, kb.cases_menu);
        }
    } catch (e) {
        console.log(e)
        await ctx.reply('Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot')
    }
}

const wizard_scenes = new Scenes.WizardScene(
    "money_game",
    async (ctx) => {
        try {
            const user = await utils.getUserData(ctx.chat.id)

            let txt = 'Самый бюджетный наш кейс, но достаточно щедрый\n\n'
            txt += `Твой баланс: ${user.coins} 💰`

            const mes = await ctx.editMessageText(txt, kb.money_game_start)
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
            const user = await utils.getUserData(ctx.chat.id)
            cb_data = ctx.callbackQuery.data
            const possibleResults = [
                { number: 1, reward: 5, chance: 35 },
                { number: 2, reward: 10, chance: 35 },
                { number: 3, reward: 15, chance: 15 },
                { number: 4, reward: 30, chance: 12 },
                { number: 5, reward: 50, chance: 2 },
                { number: 6, reward: 100, chance: 1 },
            ];

            if (cb_data === 'start_case') {
                if (user.coins >= 19) {
                    user['coins'] -= 19
                    await utils.updateUserData(ctx.chat.id, 'coins', user['coins'] );
                    const selectedResult = await utils.getRandomResult(possibleResults);
                    await utils.increaseUserCaseOpened(ctx.chat.id)
                    user['coins'] += selectedResult.reward
                    await utils.updateUserData(ctx.chat.id, 'coins', user['coins']);
                    let txt = `Ты открыл кейс и тебе выпало: ${selectedResult.reward}\n\n`
                    txt += `Твой баланс: ${user['coins']} 💰\n`
                    txt += 'Откроем ещё?'
                    await ctx.editMessageText(txt, kb.back_try_again_cases_menu)
                    return ctx.wizard.next()
                }else {
                    let txt = 'К сожалению, у тебя не хватает монеток или гемов для открытия..\n\n'
                    txt += 'Ты можешь продолжить копить, либо попробовать другие мини-игры.\n\n'
                    txt += 'P.S. Если же не хочешь ждать - можешь заглянуть в "❤️ Поддержать"'
                    await ctx.editMessageText(txt, kb.back_cases_menu);
                    return ctx.wizard.next()
                }
                
            } else {
                await back(ctx)
            }
        }catch (e) {
            console.log(e)
            await ctx.reply('Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot')
            await back(ctx, false)
        }
    },

    async (ctx) => {
        try {
            const user = await utils.getUserData(ctx.chat.id)
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