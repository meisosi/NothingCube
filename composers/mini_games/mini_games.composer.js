const { Composer } = require('telegraf')
const composer = new Composer()
const kb = require('../../keyboars.json')

composer.action("mini_games", async (ctx) => {
    try {
        let txt = "Добро пожаловать в 🎰 Мини-игры!\n\n"
        txt += "Здесь ты можешь попытать удачу и получить ещё больше монеток, доп. броски и даже гемы!\n\n"
        txt += "Можешь играть в одиночные игры, а можешь играть в сражения!\n\n"
        txt += "⚠️ <b>Перед использованием -  обязательно ознакомься с FAQ мини-игр!</b>\n\n"
        await ctx.editMessageText(txt, kb.mini_games_menu);
    } catch (e) {
        console.log(e)
    }
})

composer.use(require('./faq.composer'))
composer.use(require('./cases/cases.composer'))
composer.use(require('./fights/fights.composer'))
composer.use(require('./marks.composer'))

module.exports = composer