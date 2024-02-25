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
    "elevation",
    async (ctx) => {
        try {
            const user = await utils.getUserData(ctx.from.id)
            
            if (user.gems > 0 && user.coins >= 49) {
                let txt = 'Чтож, 60 гемов - тоже гемы, но ты с этим не согласен?\n\n'
                txt += 'Тогда настало время магии..'
                try {
                    await ctx.editMessageText(txt, kb.high_risk_start)
                } catch (e) {
                    
                }
                return ctx.wizard.next()
            } else {
                let txt = `У тебя недостаточно монет или в инвентаре нет 60 гемов`
                try {
                    await ctx.editMessageText(txt, kb.back_cases_menu)
                } catch (e) {
                    
                }
                return ctx.wizard.next()
            }
        }catch (e) {
            console.log(e)
            await ctx.reply('Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot')
            await back(ctx, false)
        }
    },

    async (ctx) => {
        try {
            const user = await utils.getUserData(ctx.from.id)
            const cb_data = ctx.callbackQuery.data
            

            if (cb_data === 'start_case') {
                
                await utils.updateUserData(ctx.from.id, 'gems', user.gems - 1);
                await utils.updateUserData(ctx.from.id, 'coins', user.coins - 49);

                const possRes = [
                        { result: 'Благословение полой луны 🌙', chance: 20 }, 
                        { result: 'lose', chance: 80 }, 
                ]

                await utils.increaseUserCaseOpened(ctx.from.id)

                const result = await utils.getRandomResult(possRes);
                if (result.result == 'lose') {
                        let txt = 'К сожалению, твои 💎 сгорели.\n\n'
                        txt += 'Попробуем ещё раз?'
                        try {
                            await ctx.editMessageText(txt, kb.back_try_again_cases_menu)
                        } catch (e) {
                    
                        }
                        return ctx.wizard.next()
                } else {
                        await utils.updateUserData(ctx.from.id, 'items', user.items + 1); // Обновляем предметы в базе данных

                        let txt = 'Успех! Мисс удача сегодня явно любит тебя!\n\n'
                        txt += "Поместили 🌙  тебе в инвентарь"
                        try {
                            await ctx.editMessageText(txt, kb.back_try_again_cases_menu);
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