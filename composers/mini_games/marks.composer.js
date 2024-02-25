const { Composer} = require('telegraf')
const composer = new Composer()
const kb = require('../../keyboars.json')

composer.action("marks_menu", async (ctx) => {
    try {
        let txt = 'Данный раздел находится в разработке'
        await ctx.editMessageText(txt, kb.back_to_mini_games);
    } catch (e) {
        console.log(e)
    }
})

module.exports = composer