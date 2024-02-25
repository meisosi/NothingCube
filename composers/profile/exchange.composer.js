const { Composer } = require('telegraf')
const composer = new Composer()
const kb = require('../../keyboars.json')
const utils = require('../../utils')

const prepareName = async (game, item_type) => {
    if (game === "genshin") {
        if (item_type === "pass") {
            return "Благословение полой луны 🌙"
        } 
    } else if (game === "honkai") {
        if (item_type === "pass") {
            return "Благословение полой луны 🌙"
        } 
    }
}

composer.action("exchanger", async (ctx) => {
    try {
        txt = "Здесь можно поменять Ваши 💰 на:\n\n"
        txt += "Благословение полой луны 🌙 - 3990 💰\n\n"
        txt += "⚠️Помните, что при получении бонус кода - отменить действие будет невозможно."

        await ctx.editMessageText(txt, kb.exchange_menu);

    } catch (e) {
        console.log(e)
    }
})

composer.on("callback_query", async (ctx) => {
    try {
        const params = ctx.callbackQuery.data.split("_")
        if ((params.length === 2) && ((params[0] === "genshin") || (params[0] === "honkai"))){
            const user = await utils.getUserData(ctx.from.id)
            const item = await prepareName(params[0], params[1]); // Получаем всю команду целиком
            const itemCost = await utils.getShopCosts(item); // Получаем стоимость товара из базы данных
        

            if (user.coins >= itemCost) {
                user.coins -= itemCost;
                await utils.updateUserData(ctx.from.id, 'coins', user.coins); // Обновляем баланс монет в базе данных
                await utils.updateUserData(ctx.from.id, 'items', user.items + 1); // Обновляем предметы в базе данных
                await ctx.editMessageText(`Успешно! В вашем 🎒 Инвентаре появилось ${item}!`, kb.back_to_inventory);
            } else {
                let keyboard = null
                if (params === "genshin") {
                    keyboard = kb.exchange_genshin_menu
                } else {
                    keyboard = kb.exchange_honkai_menu
                }

                await ctx.editMessageText(`У вас недостаточно монеток для этой покупки.`, keyboard);
            }
        }
    } catch (e) {
        console.log(e)
        await ctx.reply('Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @nothingtg')
    }
})

module.exports = composer