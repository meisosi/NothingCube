const { Markup } = require('telegraf');
const { Database } = require('./mysql');
const { DefaultConfigCreator, YAML_PATH_SEPARATOR } = require('./yaml');
const { StringBuilder } = require ('./stringBuilder');
const { CronJob } = require('cron');
const utils = require('../utils');
module.exports = class Queue {
    cronTime;
    timeZone;
    telegraf;
    mysql = new Database();
    static QUEUE_REGEX = /__queue_(.+)_(\d+)/;
    static MESSAGE_CONFIG = new DefaultConfigCreator().create('./messages.yaml');
    constructor(cronTime, timeZone, telegraf) {
        this.cronTime = cronTime;
        this.timeZone = timeZone;
        this.telegraf = telegraf;
        telegraf.command('withdraw', ctx => {
            this.onCommand(ctx, ctx.args);
        });
        telegraf.action(Queue.QUEUE_REGEX, context => {
            if (Object.keys(context.callbackQuery).includes('data') &&
                Queue.QUEUE_REGEX.test(context.callbackQuery['data'])) {
                const parsedData = Queue.QUEUE_REGEX.exec(context.callbackQuery['data']).slice(1, 3);
                this.onGive(context, parsedData[0], parseInt(parsedData[1]));
            }
        });
        CronJob.from({
            cronTime: this.cronTime,
            timeZone: this.timeZone,
            onTick: async () => this.linkPromocodes('default'),
            onTick: async () => this.linkPromocodes('premium')
        });
    }
    async onCommand(context, parameters) {
        if (parameters.length &&
            ['gems', 'moons', 'big_gems'].includes(parameters[0])) {
            const userDB = await utils.getUserData(context.from.id)
            const promocode = await this.mysql.tryPutQueue({
                userId: context.from.id,
                waitingType: parameters[0],
            }, userDB.vip_status > 0? 'premium' : 'default');
            if (promocode &&
                context.from.id === promocode.userId) {
                this.sendGiveMessage(context.from.id, promocode);
            }
            else {
                context.sendMessage(this.getMessage('putQueue'));
            }
        }
    }
    async onGive(context, lobbyId, userId) {
        if (userId === context.from.id) {
            const promocode = await this.mysql.deleteWithdrawPromocode(lobbyId);
            if (promocode) {
                this.sendGiveMessage(context.from.id, promocode);
            }
        }
    }
    async linkPromocodes(status) {
        if (this.mysql.hasWithdrawPromocodes(status) &&
            this.mysql.hasWithdrawUsers(status)) {
            (await this.mysql.getWithdrawUsers(status)).forEach(async (user) => {
                const promocode = await this.mysql.linkWithdrawPromocode(user, status);
                this.sendGiveMessage(user.userId, promocode);
            });
        }
    }
    async sendGiveMessage(id, promocode) {
        this.telegraf.telegram.sendMessage(id, this.getMessage('giveCodeMessage'), {
            reply_markup: Markup.inlineKeyboard([
                Markup.button.callback(this.getMessage('giveCodeButton'), `__queue_${promocode.code}_${promocode.userId}`)
            ]).reply_markup
        });
    }
    getMessage(message, ...params) {
        return StringBuilder.format(Queue.MESSAGE_CONFIG.get(`queue${YAML_PATH_SEPARATOR}${message}`), ...params);
    }
}
