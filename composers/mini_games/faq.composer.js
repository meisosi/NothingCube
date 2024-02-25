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
        let txt = '1. 🪙 Орел и Решка.\nПравила очень просты, вводишь ставку от 10 до 50 💰, выбираешь часть монеты - орел или решка. Подбрасываешь монету и ждешь. При победе забираешь х2 ставки, при проигрыше - ничего \n\n'
        txt += '2. 🍀 Счастливый дроп.\nКлассический ивент нашего канала по воскресеньям. Внутри лежит: 1 - 60 гемов, 2 - 120 гемов, 3 - 180 гемов, 4 - 240 гемов, 5 - луна, 6 - луна и 60 гемов. Все просто - кидай кубик и смотри, что тебе выпало. 😉\nСтоимость: 1999 💰.\n\n'
        txt += '3. 💥 High Risk.\nЛюбишь рисковать? Тогда это твой кейс. Здесь лежит луна, но шанс выпадения - 1%.\nСтоимость: 99 💰. \n\n'
        txt += '4. 🔝 Возвышение.\nУ тебя в инвентаре появились 60 💎? Отлично, можно попробовать их возвысить до луны. Шансы на возвышение - 20%\nСтоимость: 49 💰. \n\n'
        txt += '5. 💰 Монеточный\nВнутри лежит от 5 до 100 💰 .\nСтоимость: 19 💰\n\n'
        await ctx.editMessageText(txt, kb.mini_games_faq_back);
    } catch (e) {
        console.log(e)
    }
})

composer.action("fights_faq", async (ctx) => {
    try {
        let txt = 'Сражения - это онлайн игры между участниками.\n\n'
        txt += 'Участники выбирают режим и идет поиск соперника. Один победитель, один проигравший. Победитель забирает себе 80% от общей ставки, проигравший - ничего. Внимание, предупреждаем сразу - ваша ставка сгорит, если вы не ответите в течении 30 минут.\n\n'

        txt += '1. ✂️ Камень-ножницы-бумага (ка-но-бу).\n'
        txt += 'Всё очень просто. Бумага бьёт камень, камень бьёт ножницы, а ножницы - бумагу.\n'
        txt += 'Стоимость участия: 50 💰\n\n'

        txt += '2. 🔫 Дуэль.\n'
        txt += 'Вы встаете напротив соперника, нажимаете курок и.. либо вы Пушкин, либо Дантес\n'
        txt += 'Стоимость участия: 100 💰\n\n'

        txt += '3. 🤞 Русская рулетка.\n'
        txt += 'Перед Вами лежит револьвер, в нём барабан на 6 патронов, но патрон лишь 1.\n'
        txt += 'Кто счастливчик, а кто жмурик - зависит только от Вашей удачи\n'
        txt += 'Стоимость участия: 50 💰\n\n'

        await ctx.editMessageText(txt, kb.mini_games_faq_back);
    } catch (e) {
        console.log(e)
    }
})

module.exports = composer