const { Composer, session } = require('telegraf')
const composer = new Composer()
const kb = require('../../keyboars.json')
const utils = require('../../utils')

composer.use(require('./profile.stages'))

const getProfile = async (ctx) => {
    try { 
        const user = await utils.getUserData(ctx.chat.id);
        let txt = `${user.nickname}, вот, что у тебя есть:\n\n`;
        txt += `Твой баланс: ${user.coins} 💰\n`;
        txt += `Твои броски: ${user.rolls} 🎲\n\n`;
        // txt += `Твоя дата рождения: ${user.birthday_at} 🎂\n`;
        await ctx.editMessageText(txt, kb.profile_menu);
    } catch (e) {
        console.log(e);
    }
}

composer.action("profile", async (ctx) => {
    try {
        await getProfile(ctx);
    } catch (e) {
        console.log(e)
    }
})

composer.action("promocode", async (ctx) => {
    try {
        await ctx.scene.enter('promocodes')
    } catch (e) {
        console.log(e)
    }
})

composer.use(require('./inventory/inventory.composer'))
composer.use(require('./stats.composer'))
composer.use(require('./exchange.composer'))

module.exports = composer