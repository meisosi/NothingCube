const { Scenes } = require('telegraf')
const kb = require('../../../../keyboars.json')
const utils = require('../../../../utils')
const setTimeoutP = require('timers/promises').setTimeout


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
    "lucky_drop_prem",
    async (ctx) => {
        try {
            const user = await utils.getUserData(ctx.chat.id)

            let txt = 'Всегда хотел увидеть эту фразу?😉\n\n'
            txt += `${ctx.chat.username}, кидай кубик - этот раздел для тебя! ⚡️\n\n`
            txt += `Твой баланс: ${user.coins} 💰`
            const mes = await ctx.editMessageText(txt, kb.lucky_drop_prem_start)

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
            cb_data = ctx.callbackQuery?.data

            if (user.coins < 20000) {
                let txt = 'К сожалению, у тебя не хватает монеток или гемов для открытия..\n\n'
                txt += 'Ты можешь продолжить копить, либо попробовать другие мини-игры.\n\n'
                txt += 'P.S. Если же не хочешь ждать - можешь заглянуть в "❤️ Поддержать"'
                await ctx.editMessageText(txt, kb.back_cases_menu);
                return ctx.wizard.next()
            }

            if (cb_data && cb_data === 'drop_lucky_prem') {
                const diceResult = await ctx.replyWithDice();
                const selectedResult = diceResult.dice.value;
                const rewards = {
                    1: { name: "60 гемов 💎", type: "gems", amount: 1 },
                    2: { name: "60 гемов 💎 3 раза", type: "gems", amount: 3 },
                    3: { name: "Благословение полой луны 🌙", type: "items", amount: 1 },
                    4: { name: "Благословение полой луны 🌙 и 60 гемов 💎", type: "combined", items: ["Благословение полой луны 🌙", "60 гемов"], amount:1 },
                    5: { name: "2 Благословения полой луны 🌙🌙", type: "items", amount: 2 },
                    6: { name: "1090 гемов 💎", type: "big_gems", amount: 1 },
                };

                await new Promise(resolve => setTimeout(resolve, 5000)); // Задержка в 5 секунд

                await ctx.deleteMessage(ctx.wizard.state.mid)
                await utils.increaseUserCaseOpened(ctx.chat.id);

                const rewardInfo = rewards[selectedResult];

                if (rewardInfo.type === "gems") {
                    await utils.updateUserData(ctx.chat.id, 'gems', user['gems'] ? user['gems'] + rewardInfo.amount : rewardInfo.amount);
                } else if (rewardInfo.type === "items") {
                    await utils.updateUserData(ctx.chat.id, 'items',  user['items'] ? user['items'] + rewardInfo.amount : rewardInfo.amount);
                } else if (rewardInfo.type === "big_gems") {
                    await utils.updateUserData(ctx.chat.id, 'big_gems',  user['big_gems'] ? user['big_gems'] + rewardInfo.amount : rewardInfo.amount);
                } else if (rewardInfo.type === "combined") {
                    for (const item of rewardInfo.items) {
                        if (item.includes("Благословение полой луны 🌙")) {
                            await utils.updateUserData(ctx.chat.id, 'items', user['items'] ? user['items'] + rewardInfo.amount : rewardInfo.amount);
                        } else if (item.includes("60 гемов")) {
                            await utils.updateUserData(ctx.chat.id, 'gems', user['gems'] ? user['gems'] + rewardInfo.amount : rewardInfo.amount);
                        }
                    }
                }

                await utils.updateUserData(ctx.chat.id, 'coins', user['coins'] - 20000);

                let txt = `Поздравляем! Тебе выпало: ${rewardInfo.name}\n`
                txt += 'Предмет находится у тебя в инвентаре.\n\n'
                txt += 'Если у тебя есть 60 гемов - можешь попробовать возвышение до луны!\n\n'
                txt += `Твой баланс: ${user.coins - 6000} 💰`

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
