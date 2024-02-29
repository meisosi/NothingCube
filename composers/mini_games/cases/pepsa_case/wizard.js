const { Scenes } = require('telegraf')
const kb = require('../../../../keyboars.json')
const utils = require('../../../../utils')
const setTimeoutP = require('timers/promises').setTimeout


const back = async (ctx, edit = true) => {
    try {
        await ctx.scene.leave()
        const stat = await utils.getUserStats(ctx.chat.id)

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
    "pepsa_case",
    async (ctx) => {
        try {
            const user = await utils.getUserData(ctx.chat.id)

            let txt = 'Всегда хотел увидеть эту фразу?😉\n\n'
            txt += `${ctx.chat.username}, кидай кубик - этот раздел для тебя! ⚡️\n\n`
            txt += `Твой баланс: ${user.coins} 💰`
            const mes = await ctx.reply(txt, kb.pepsa_case_start)

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

            if (user.coins < 300) {
                let txt = 'К сожалению, у тебя не хватает монеток для открытия..\n\n'
                txt += 'Ты можешь продолжить копить, либо попробовать другие мини-игры.\n\n'
                txt += 'P.S. Если же не хочешь ждать - можешь заглянуть в "❤️ Поддержать"'
                await ctx.editMessageText(txt, kb.back_cases_menu);
                return ctx.wizard.next()
            }
            await utils.updateUserData(ctx.chat.id, 'coins', user['coins'] - 300);

            if (cb_data && cb_data === 'drop_pepsa') {
                const diceResult = await ctx.replyWithDice();
                const selectedResult = diceResult.dice.value;
                const rewards = {
                    1: { name: "5 монет 💰", type: "coins", amount: 5 },
                    2: { name: "25 монет 💰", type: "coins", amount: 25 },
                    3: { name: "50 монет 💰", type: "coins", amount: 50 },
                    4: { name: "75 монет 💰", type: "coins", amount: 75 },
                    5: { name: "100 монет 💰", type: "coins", amount: 100 },
                    6: { name: "60 гемов 💎", type: "gems", amount: 1 },
                };

                await new Promise(resolve => setTimeout(resolve, 5000)); // Задержка в 5 секунд

                await ctx.deleteMessage(ctx.wizard.state.mid);
                await utils.increaseUserCaseOpened(ctx.chat.id);

                const rewardInfo = rewards[selectedResult];

                if (rewardInfo.type === "gems") {
                    user.gems += rewardInfo.amount;
                    await utils.updateUserData(ctx.chat.id, 'gems', user.gems + rewardInfo.amount);
                } else if (rewardInfo.type === "coins") {
                    user.coins += rewardInfo.amount;
                    await utils.updateUserData(ctx.chat.id, 'coins',  user.coins + rewardInfo.amount);
                }

                await utils.updateUserData(ctx.chat.id, rewardInfo.type, user[rewardInfo.type]);

                let txt = `Поздравляем! Тебе выпало: ${rewardInfo.name}\n`
                txt += 'Предмет находится у тебя в инвентаре.\n\n'
                txt += 'Если у тебя есть 60 гемов - можешь попробовать возвышение до луны!\n\n'
                txt += `Твой баланс: ${user.coins - 300} 💰`

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
