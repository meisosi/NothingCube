import { Markup } from "telegraf";
import { Bot } from "bot";
import { EventHandler } from "../events/eventHandler";
import { Module } from "../../module";
import { StringBuilder } from "../utils/stringBuilder";
import { YAML_PATH_SEPARATOR } from "../utils/yaml";
import { QueueCommandEvent, QueueGivePromocodeEvent } from "./queueEvents";
import { QueueListener } from "./queueListener";
import { CronJob } from 'cron';
import { WithdrawPromocode, WithdrawUser } from "../interface/withdraw";

export class QueueModule implements Module {
    static readonly QUEUE_REGEX = /__queue_(.+)_(\d+)/;
    constructor(
        private readonly bot: Bot
    ) { }

    init(cronTime: string, timeZone: string = 'UTC+3') {
        EventHandler.Handler.addListener(new QueueListener(this));
        this.bot.Telegraf.command('withdraw', ctx => {
            QueueCommandEvent.execute(ctx, ctx.args);
        });
        this.bot.Telegraf.action(QueueModule.QUEUE_REGEX, context => {
            if(
                Object.keys(context.callbackQuery).includes('data') &&
                QueueModule.QUEUE_REGEX.test(context.callbackQuery['data'])
            ) {
                const parsedData = QueueModule.QUEUE_REGEX.exec(context.callbackQuery['data']).slice(1, 3);
                QueueGivePromocodeEvent.execute(
                    context,
                    parsedData[0],
                    parseInt(parsedData[1])
                );
            }
        });

        CronJob.from({
            cronTime: cronTime,
            timeZone: timeZone,
            onTick: async () => this.linkPromocodes()
        });
    }

    async putQueue(user: WithdrawUser) {
        return this.bot.Utils.tryPutQueue(user);
    }

    async linkPromocodes() {
        if(
            this.bot.Utils.hasWithdrawPromocodes() &&
            this.bot.Utils.hasWithdrawUsers()
        ) {
            (await this.bot.Utils.getWithdrawUsers()).forEach(async user => {
                const promocode = await this.bot.Utils.linkWithdrawPromocode(user);
                this.sendGiveMessage(user.userId, promocode);
            })
        }
    }

    async givePromocode(code: string) {
        return this.bot.Utils.deleteWithdrawPromocode(code);
    }

    async sendGiveMessage(id: number, promocode: WithdrawPromocode) {
        this.bot.Telegraf.telegram.sendMessage(
            id,
            this.getMessage('giveCodeMessage'),
            {
                reply_markup: Markup.inlineKeyboard([
                    Markup.button.callback(this.getMessage('giveCodeButton'), `__queue_${promocode.code}_${promocode.userId}`)
                ]).reply_markup,
                parse_mode: 'MarkdownV2'
            }
        )
    }

    getMessage(message: string, ...params: any) : string {
        return StringBuilder.format(
            this.bot.getConfig('messages.yaml').
            get(`queue${YAML_PATH_SEPARATOR}${message}`) as string, ...params
        );
    }
}