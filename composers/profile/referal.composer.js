const { Composer } = require('telegraf')
const composer = new Composer()
const kb = require('../../keyboars.json')
const utils = require('../../utils')

composer.action("referal", async (ctx) => {
    try {
        const userId = ctx.from.id;
        const ref = await utils.getReferals(userId)
        let txt = "";
        if(!ref) {
            txt = "У вас ещё нет реферальной ссылки\n\n";
            txt += "Нажмите на кнопку чтобы создать её!";
            await ctx.editMessageText(txt, kb.create_ref_link);
        }
        else {
            txt = "Ваша реферальная ссылка\n";
            txt += "https://t.me/nothing_cube_game_bot?start=ref_" + userId + '\n';
            txt += "Отправьте эту ссылку друзьям! За каждого вы получить бросок и монету дружбы!\n\n";
            txt += `По вашей ссылке присоеденилось уже ${ref.referals? ref.referals.length : 0} человек!`;
            await ctx.editMessageText(txt, kb.ref);
        }

    } catch (e) {
        console.log(e)
    }
})

composer.action("create_ref_link", async (ctx) => {
    try {
        const userId = ctx.from.id;
        const ref = await utils.getReferals(userId)
        if(!ref) {
            await utils.createReferalLink(userId);
            let txt = "Ваша реферальная ссылка создана!\n"
            txt += "https://t.me/nothing_cube_game_bot?start=ref" + userId + '\n';
            txt += "Отправьте эту ссылку друзьям! За каждого вы получить бросок и монету дружбы!"
            await ctx.editMessageText(txt, kb.ref);
        }
        else {
            txt = "Ваша реферальная ссылка\n";
            txt += "https://t.me/nothing_cube_game_bot?start=ref" + userId + '\n';
            txt += "Отправьте эту ссылку друзьям! За каждого вы получить бросок и монету дружбы!\n\n";
            txt += `По вашей ссылке присоеденилось уже ${ref.referals? ref.referals.length : 0} человек!`;
            await ctx.editMessageText(txt, kb.ref);
        }

    } catch (e) {
        console.log(e)
    }
})

module.exports = composer