const { Markup } = require( 'telegraf');
const Database = require('./mysql');
const { CronJob } = require ('cron');
const { createPromocode } = require ('./withdraw/queueMethods');
const utils = require('../utils');
module.exports = class Queue {
    telegraf;
    mysql = new Database();
    cronJob;
    static QUEUE_REGEX = /__queue_(.+)_(\d+)/;
    constructor(cronTime, timeZone, telegraf) {
        this.telegraf = telegraf;
        telegraf.command('withdraw', ctx => {
            if (ctx.args.length &&
                ['gems', 'moons', 'big_gems'].includes(ctx.args[0])) {
                this.onCommand(ctx, ctx.args[0]);
            }
        });
        telegraf.action(Queue.QUEUE_REGEX, async ctx => {
            const userId = await utils.getUserData(ctx.from.id);
            if (ctx.callbackQuery['data']) {
                const parsedData = Queue.QUEUE_REGEX.exec(ctx.callbackQuery['data']).slice(1, 3);
                if (parseInt(parsedData[1]) == ctx.callbackQuery.from.id) {
                    this.givePromocode(parsedData[0], userId.vip_status > 0 ? 'premium' : "default");
                }
            }
        });
        telegraf.command('create', ctx => {
            if (ctx.args.length === 2) {
                createPromocode(this.mysql, ctx.args[0], ctx.args[1]);
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
        const userId = context.from.id;
        const userDB = await utils.getUserData(userId);
        const promocode = await this.mysql.tryPutQueue({
            userId: context.from.id, 
            waitingType: type
        }, userDB.vip_status > 0 ? 'premium' : "default");

        if (promocode) {
            this.givePromocode(promocode.code, userDB.vip_status > 0 ? 'premium' : "default");
        }
        else {
            context.sendMessage("Вы были поставлены в очередь, пожалуйста ожидайте. Бот отправит вам сообщение", { parse_mode: 'Markdown' });
        }
    }
    async givePromocode(code, status) {
        const promo = await this.mysql.deleteWithdrawPromocode(code, status);
        if (promo) {
            this.telegraf.telegram.sendMessage(promo.userId, `Вот ваш промокод! Скоприуйте нажатием <code>${promo.code}</code>`, {parse_mode: 'HTML'});
        }
    }
    async linkPromocodes(status) {
        const withdrawPromocodes = await this.mysql.hasWithdrawPromocodes(status);
        const withdrawUsers = await this.mysql.hasWithdrawUsers(status);
        console.log(Object.values(withdrawPromocodes)[0], Object.values(withdrawUsers)[0])
        if (Object.values(withdrawPromocodes)[0] && Object.values(withdrawUsers)[0]) {
            const wUsers = await this.mysql.getWithdrawUsers(status);
            wUsers.forEach(async user => {
                const promo = await this.mysql.linkWithdrawPromocode(user, status);
                if (promo) {
                    this.telegraf.telegram.sendMessage(user.userId, "Поздравляем! Вот ваш код. Активируйте его на сайте [Genshin Drop](https://genshindrop.io/NOTHING)", this.generateKeyboard(promo, user));
                }
            });
        }
    }
    generateKeyboard(promocode, user) {
        return Markup.inlineKeyboard([
            Markup.button.callback("Забрать код", `__queue_${promocode.code}_${user.userId}`)
        ]);
    }
}
