"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
const telegraf_1 = require("telegraf");
const mysql_1 = require("./mysql");
const yaml_1 = require("./yaml");
const stringBuilder_1 = require("./stringBuilder");
const cron_1 = require("cron");
class Queue {
    constructor(cronTime, timeZone, telegraf) {
        this.cronTime = cronTime;
        this.timeZone = timeZone;
        this.telegraf = telegraf;
        this.mysql = new mysql_1.Database();
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
        cron_1.CronJob.from({
            cronTime: this.cronTime,
            timeZone: this.timeZone,
            onTick: () => __awaiter(this, void 0, void 0, function* () { return this.linkPromocodes(); })
        });
    }
    onCommand(context, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            if (parameters.length &&
                ['gems', 'moons', 'big_gems'].includes(parameters[0])) {
                const promocode = yield this.mysql.tryPutQueue({
                    userId: context.from.id,
                    waitingType: parameters[0],
                }, 'default');
                if (promocode &&
                    context.from.id === promocode.userId) {
                    sendGiveMessage(context.from.id, promocode);
                }
                else {
                    context.sendMessage(getMessage('putQueue'), { parse_mode: 'MarkdownV2' });
                }
            }
        });
    }
    onGive(context, lobbyId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userId === context.from.id) {
                const promocode = yield this.givePromocode(lobbyId);
                if (promocode) {
                    sendGiveMessage(context.from.id, promocode);
                }
            }
        });
    }
    linkPromocodes() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mysql.hasWithdrawPromocodes() &&
                this.mysql.hasWithdrawUsers()) {
                (yield this.mysql.getWithdrawUsers()).forEach((user) => __awaiter(this, void 0, void 0, function* () {
                    const promocode = yield this.mysql.linkWithdrawPromocode(user);
                    sendGiveMessage(user.userId, promocode);
                }));
            }
        });
    }
    givePromocode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mysql.deleteWithdrawPromocode(code);
        });
    }
}
exports.Queue = Queue;
Queue.QUEUE_REGEX = /__queue_(.+)_(\d+)/;
const MESSAGE_CONFIG = new yaml_1.DefaultConfigCreator().create('./messages.yaml');
function sendGiveMessage(id, promocode) {
    return __awaiter(this, void 0, void 0, function* () {
        this.bot.Telegraf.telegram.sendMessage(id, this.getMessage('giveCodeMessage'), {
            reply_markup: telegraf_1.Markup.inlineKeyboard([
                telegraf_1.Markup.button.callback(this.getMessage('giveCodeButton'), `__queue_${promocode.code}_${promocode.userId}`)
            ]).reply_markup,
            parse_mode: 'MarkdownV2'
        });
    });
}
function getMessage(message, ...params) {
    return stringBuilder_1.StringBuilder.format(MESSAGE_CONFIG.get(`queue${yaml_1.YAML_PATH_SEPARATOR}${message}`), ...params);
}
