const { Composer } = require('telegraf')
const composer = new Composer()

composer.hears("✏️ Тех. поддержка", async (ctx) => {
    try {
        ctx.reply("Нашли ошибку?\nНапишите нам и мы решим её!\n\n@GameNothingsupport_bot")
    } catch (e) {
        console.log(e)
    }
})

module.exports = composer