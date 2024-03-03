const { Composer } = require('telegraf')
const composer = new Composer()
const kb = require('../../keyboars.json')
const utils = require('../../utils')

composer.action("withdraw", async (ctx) => {
    try {
        const userId = ctx.from.id;
        const userDB = await utils.getUserData(userId);
        let txt = `У вас ${userDB.items? userDB.items : 0} лун\n\n`;
        txt += `Вывод происходит моментально, при наличии кода, в противном случае вас ставит в очередь\n`;
        if(userDB.vip_status < 0) {
            txt += `Цена вывода - 2000 монеток\nВы можете вывести только 1 луну за раз\n\n`
        }
        else {
            txt += `За вашу поддержку вам не придётся платить за вывод! Спасибо!\n`
        }
        ctx.reply(txt, kb.confirm_withdraw);

    } catch (e) {
        console.log(e)
    }
})

module.exports = composer