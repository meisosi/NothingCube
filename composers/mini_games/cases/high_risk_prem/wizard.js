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
    "high_risk_prem",
    async (ctx) => {
        try {
            let txt = 'Кто не рискует, тот не пьёт шампанское🍾\n'
            txt += 'Или не получает 1090 гемов\n\n'
            txt += 'Аналог всеми любимого кейса "Всё или Ничего"\n'
            txt += 'Испытаешь удачу?😉'
            
            const mes = await ctx.reply(txt, kb.high_risk_prem_start)
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
            const cb_data = ctx.callbackQuery?.data;
            const cost = user.vip_status > 0 ? 500 : 1000;
    
            if (cb_data === 'start_case') {
                if (user.coins >= cost) {
                    const updatedCoins = user.coins - cost;
                    await utils.updateUserData(ctx.chat.id, 'coins', updatedCoins);
    
                    const possRes = [
                        { result: '1090 💎', chance: 0.1 },
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
                            // Обработка возможной ошибки
                        }
                        return ctx.wizard.next()
                    } else {
                        await utils.updateUserData(ctx.chat.id, 'big_gems', user.big_gems + 1); // Обновляем количество больших гемов
    
                        let txt = 'Вы только посмотрите на этого счастливчика!\n'
                        txt += 'Невероятно, 1090 гемов твои! 🍾'
                        try {
                            await ctx.editMessageText(txt, kb.back_try_again_cases_menu);
                        } catch (e) {
                            // Обработка возможной ошибки
                        }
                        return ctx.wizard.next()
                    }
    
                } else {
                    let txt = `К сожалению, у тебя не хватает монеток для открытия. Тебе нужно ${cost} монеток.\n\n`;
                    txt += 'Ты можешь продолжить копить, либо попробовать другие мини-игры.\n\n';
                    txt += 'P.S. Если же не хочешь ждать - можешь заглянуть в "❤️ Поддержать"';
                    try {
                        await ctx.editMessageText(txt, kb.back_cases_menu);
                    } catch (e) {
                        // Обработка возможной ошибки
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