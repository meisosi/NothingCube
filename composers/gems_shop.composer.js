const { Composer } = require('telegraf')
const composer = new Composer()
const fs = require('fs')
const kb = require('../keyboars.json')

composer.action("gems_shop", async (ctx) => {
    try {
        let txt = "Купить луну за монкетки можно в: профиль-обменник\n"
        txt += "Но можно купить сейчас у наших друзей с GENSHINDROP ❤️\n"
        extra = kb.gem_shop
        extra['caption'] = txt
        await ctx.replyWithPhoto({ source: fs.createReadStream('./img/shop_gems.jpg')}, extra)
        await ctx.deleteMessage()
    } catch (e) {
        console.log(e)
    }
})

module.exports = composer