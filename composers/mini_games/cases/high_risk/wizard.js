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
    "high_risk",
    async (ctx) => {
        try {
            const user = await utils.getUserData(ctx.chat.id)

            let txt = 'Кто не рискует, тот не пьёт шампанское🍾\n'
            txt += 'Или не получает луну 🌙\n\n'
            txt += 'Аналог всеми любимого кейса "Всё или Ничего"\n'
            txt += 'Испытаешь удачу?😉'
            
            const mes = await ctx.editMessageText(txt, kb.high_risk_start)
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
            const cb_data = ctx.callbackQuery?.data

            if (cb_data === 'start_case') {

                if (user.coins >= 100) {
                    const updatedCoins = user.coins - 100;
                    await utils.updateUserData(ctx.chat.id, 'coins', updatedCoins);

                    const possRes = [
                        { result: 'Благословение полой луны 🌙', chance: 0.1 },
                        { result: 'lose', chance: 99.9 },
                    ]
                    await utils.increaseUserCaseOpened(ctx.chat.id)
                    const result = await utils.getRandomResult(possRes);
                    if (result.result == 'lose') {
                        let txt = 'Увы, тебе досталось Nothing..\n'
                        txt += 'Попробуем ещё раз?😉'
                        try {
                            await ctx.editMessageText(txt, kb.back_try_again_cases_menu)
                        }catch (e) {

                        }
                        return ctx.wizard.next()
                    } else {
                        await utils.updateUserData(ctx.chat.id, 'items', user.items + 1); // Обновляем предметы в базе данных

                        let txt = 'Вы только посмотрите на этого счастливчика!\n'
                        txt += 'Невероятно, 🌙 твоя! 🍾'
                        try {
                            await ctx.editMessageText(txt, kb.back_try_again_cases_menu);
                        }catch (e) {

                        }
                        return ctx.wizard.next()
                    }

                } else {
                    let txt = 'К сожалению, у тебя не хватает монеток или гемов для открытия..\n\n'
                    txt += 'Ты можешь продолжить копить, либо попробовать другие мини-игры.\n\n'
                    txt += 'P.S. Если же не хочешь ждать - можешь заглянуть в "❤️ Поддержать"'
                    try {
                        await ctx.editMessageText(txt, kb.back_cases_menu);
                    }catch (e) {

                    }
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
            cb_data = ctx.callbackQuery?.data

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