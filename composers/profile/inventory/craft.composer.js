const { Composer, Telegraf } = require('telegraf')
const composer = new Composer()
const kb = require('../../../keyboars.json')
const utils = require('../../../utils')
const token = process.env.TOKEN_BOT
const bot = new Telegraf(token)

composer.action("craft", async (ctx) => {
    try {
        const user = await utils.getUserData(ctx.chat.id)
        
        let col60gems = user.gems || 0;

        let txt = 'Бери скотч и свои 60 💎 и преврати их в 🌙\n\n'
        txt += `В инвентаре: 60 💎 - ${col60gems}\n\n`
        txt += 'Если у тебя недостаточно 💎 - можешь попытать удачу и возвысить 60 💎 до 🌙 через 🔝 Возвышение'
        ctx.answerCbQuery();
        await ctx.editMessageText(txt, kb.craft_menu)

    } catch (e) {
        console.log(e)
    }
})

composer.action("start_craft", async (ctx) => {
    try {
        const user = await utils.getUserData(ctx.chat.id)
        
        let col60gems = user.gems || 0;

        if (col60gems >= 5) { // Проверяем, есть ли у пользователя достаточное количество гемов
            await utils.updateUserData(ctx.chat.id, 'gems', col60gems - 5); // Уменьшаем количество гемов на 300
            await utils.updateUserData(ctx.chat.id, 'items', user.items + 1); // Добавляем луну в инвентарь
            let txt = 'Получилось! 🌙 уже ждет тебя в инвентаре!';
            ctx.answerCbQuery();
            await ctx.editMessageText(txt, kb.craft_menu_success);
        } else {
            let txt = 'Для крафта необходимо 5💎!\n';
            txt += 'Накопи и ждем тебя тебя снова!\n\n';
            txt += 'Либо попытай удачу через 🔝 Возвышение';
            ctx.answerCbQuery();
            await ctx.editMessageText(txt, kb.craft_menu_failure);
        }

    } catch (e) {
        console.log(e)
    }
})

module.exports = composer;
