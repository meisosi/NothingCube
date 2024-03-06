const { Composer, session } = require('telegraf')
const composer = new Composer()
const kb = require('../../keyboars.json')
const utils = require('../../utils')

composer.use(require('./profile.stages'))

const getProfile = async (ctx) => {
    try { 
        const user = await utils.getUserData(ctx.from.id);
        let stat = await utils.getUserStats(ctx.from.id);
        if (!stat) {
            await utils.createUserStats(ctx.from.id)
            stat = await utils.getUserStats(ctx.from.id)
        }
        const today = new Date()
        const delta_days = parseInt(Math.floor((today - user.created_at)) / (1000 * 60 * 60 * 24))
        let txt = `${ctx.from.first_name}, мы с тобой кидаем кубик уже ${delta_days} дней.\n\n`
        txt += `Бросков кубика: ${stat.rolls} раз\n`
        txt += `Кейсов открыто: ${stat.cases_opened} раз\n`
        txt += `Выпало: ${stat.earned} 💰.\n\n`
        txt += `Вот, что у тебя есть:\n\n`;
        txt += `Твой баланс: ${user.coins} 💰\n`;
        txt += `Твои броски: ${user.rolls} 🎲\n\n`;
        txt += 'Спасибо за пользование кубиком❤️!'
        // txt += `Твоя дата рождения: ${user.birthday_at} 🎂\n`;
        return await ctx.editMessageText(txt, kb.profile_menu);
    } catch (e) {
        console.log(e);
    }
}

composer.action("profile", async (ctx) => {
    try {
        ctx.answerCbQuery()
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

composer.hears("🌟 Промокод", async (ctx) => {
    try {
        await ctx.scene.enter('promocodes')
    } catch (e) {
        console.log(e)
    }
})

composer.use(require('./inventory/inventory.composer'))
composer.use(require('./referal.composer'))
composer.use(require("./withdrawals.composer"));


module.exports = composer