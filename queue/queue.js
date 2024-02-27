const { Markup } = require( 'telegraf');
const Database = require('./mysql');
const { CronJob } = require ('cron');
const { createPromocode } = require ('./withdraw/queueMethods');
const utils = require('../utils');
const QUEUE_REGEX = /__queue_(.+)_(\d+)/;
module.exports = class Queue {
    telegraf;
    mysql = new Database();
    cronJob;
    constructor(cronTime, timeZone, telegraf) {
        this.telegraf = telegraf;
        telegraf.hears('🚀 Вывод предметов', ctx => {
            //if (ctx.args.length &&
            //    ['gems', 'items', 'big_gems'].includes(ctx.args[0])) {
            //    this.onCommand(ctx, ctx.args[0]);
            //}
            this.onCommand(ctx, 'items');
        });
        telegraf.action(QUEUE_REGEX, async ctx => {
            const userDB = await utils.getUserData(ctx.from.id);
            if (ctx.callbackQuery['data']) {
                const parsedData = QUEUE_REGEX.exec(ctx.callbackQuery['data']).slice(1, 3);
                if (parseInt(parsedData[1]) == ctx.callbackQuery.from.id) {
                    this.givePromocode(parsedData[0], userDB.vip_status > 0 ? 'premium' : "default");
                }
            }
        });
        this.cronJob = CronJob.from({
            cronTime: cronTime,
            timeZone: timeZone,
            onTick: _ => {
                this.linkPromocodes('premium');
                this.linkPromocodes('default');
            }
        });
        this.cronJob.start();
    }
    async onCommand(context, type) {
        const user_id = context.from.id;
        const userDB = await utils.getUserData(user_id);
        if(userDB[type] < 1) {
            return context.sendMessage("У вас недостаточно предметов для вывода...");
        }
        const userPrem = userDB.vip_status > 0;
        if(!userPrem) {
            if(userDB.coins < 2000) {
                return context.sendMessage(`Стоимость вывода предметов: 2000 монеток 💰\n\nУ вас сейчас: ${userDB.coins} 💰\n\nВы можете накопить баланс или приобрести подписку, для быстрого вывода.`);
            }
            else {
                await utils.updateUserData(user_id, 'coins', userDB.coins - 2000);
            }
        }
        userDB[type] = userDB[type] - 1;
        await utils.updateUserData(user_id, type, userDB[type]);
        const promocode = await this.mysql.tryPutQueue({
            id: context.from.id, 
            waitingType: type
        }, userDB.vip_status > 0 ? 'premium' : "default");

        if (promocode) {
            this.givePromocode(promocode.code, userPrem > 0 ? 'premium' : "default");
        }
        else {
            context.sendMessage("Вы были поставлены в очередь, пожалуйста ожидайте. Бот отправит вам сообщение", { parse_mode: 'Markdown' });
        }
    }
    async givePromocode(code, status) {
        const promo = await this.mysql.deleteWithdrawPromocode(code, status);
        if (promo) {
            let txt = `Вот ваш промокод (нажмите на него, чтобы скопировать):\`${promo.code}\`\n\n`;
            txt += "Активировать на сайте [Genshindrop](https://genshindrop.io/NOTHING), в разделе профиль - активировать бонус код\n\n";
            txt += "Отзыв можете оставить [тут](https://t.me/cube_updates/124), нам будет очень приятно❤️"
            this.telegraf.telegram.sendMessage(promo.user_id, txt, {parse_mode: 'Markdown'});
        }
    }
    async linkPromocodes(status) {
        const withdrawPromocodes = await this.mysql.hasWithdrawPromocodes(status);
        const withdrawUsers = await this.mysql.hasWithdrawUsers(status);
        if (Object.values(withdrawPromocodes)[0] && Object.values(withdrawUsers)[0]) {
            const wUsers = await this.mysql.getWithdrawUsers(status);
            wUsers.forEach(async user => {
                const promo = await this.mysql.linkWithdrawPromocode(user, status);
                if (promo) {
                    this.telegraf.telegram.sendMessage(user.id, "Поздравляем! Вот ваш код.\nНажмите на кнокпу в течении недели чтобы забрать его, иначе он пропадёт!", this.generateKeyboard(promo, user));
                }
            });
        }
    }
    generateKeyboard(promocode, user) {
        return Markup.inlineKeyboard([
            Markup.button.callback("Забрать код", `__queue_${promocode.code}_${user.id}`)
        ]);
    }
}
