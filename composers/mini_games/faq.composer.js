const { Composer} = require('telegraf')
const composer = new Composer()
const kb = require('../../keyboars.json')

composer.action("mini_games_faq", async (ctx) => {
    try {
        let txt = '<b>Общие правила и условия:</b>\n'
        txt += 'Все ставки делаются в бесплатной валюте - монетки. 💰\n\n'
        txt += 'Из игр - 🧨 Кейсы\n'
        await ctx.editMessageText(txt, kb.mini_games_faq_menu);
    } catch (e) {
        console.log(e)
    }
})

composer.action("cases_faq", async (ctx) => {
    try {
        let txt = '1. 🎲 Кейс NT\nКейс от команды Nothing Team!\nТут есть 1000 монет, но шанс 1%\nСтоимость: 10 💰\n\n'
        txt += '2. 🙋‍♂️ Кейс за друзей\nНаш первый кейс связанный с друзьями. Можно получить 10/30/100/200/500/1000 монет. Что выпадет - решит кубик\nСтоимость: 10 💰 и 10 друзей 🙋‍♂️\n\n'
        txt += '3. 🥤 Кейс Пепсы\nКейс владельца канала @KopluNaKeysModela\nВходит в него: 5 монет, 25 монет, 50 монет, 75 и 100! А так же 60 гемов\nСтоимость: 300 💰\n\n'
        txt += '4. 🔫 Рулетка\nУ Вас в руках револьвер и будет три попытки из шести, чтобы выжить и забрать 200 монеток 💰. После трех попыток - вы можете использовать дополнительную попытку и сорвать куш в 400 монеток 💰. Но помни, что с каждым выстрелом шансы словить пулю растут..\nСтоимость: 100 💰\n\n'
        txt += '5. 💥 High Risk\nЛюбишь рисковать? Тогда это твой кейс. Здесь лежит луна, но шанс выпадения - 1%.\nСтоимость: 100 💰\n\n'
        txt += '6. 💥 High Risk Premium\nТот же High Risk, но 1% шанс на 1090 гемов\nСтоимость: 1000 💰\n\n'
        txt += '7. 🍀 Счастливый дроп\nКлассический ивент нашего канала по воскресеньям. Внутри лежит: 1 - 60 гемов, 2 - 120 гемов, 3 - 180 гемов, 4 - 240 гемов, 5 - луна, 6 - луна и 60 гемов. Все просто - кидай кубик и смотри, что тебе выпало. 😉\nСтоимость: 6000 💰\n\n'
        txt += '8. 🍀 Счастливый дроп Премиум\nСамый дорогой наш кейс как по наградам, так и по цене. Внутри тебя ждет: 60 гемов / 180 гемов / луна / луна и 60 гемов / 2 луны / 1090 гемов. Накопил? Кидай кубик!\nСтоимость: 20000 💰\n\n'
        txt += '9. 🔝 Возвышение.\nУ тебя в инвентаре появились 60 💎? Отлично, можно попробовать их возвысить до луны. Шансы на возвышение - 20%\nСтоимость: 60 💎\n\n'
        await ctx.editMessageText(txt, kb.mini_games_faq_back);
    } catch (e) {
        console.log(e)
    }
})

module.exports = composer