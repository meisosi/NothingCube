const { Markup } = require( 'telegraf');
const Database = require('./mysql');
const { CronJob } = require ('cron');
const { hasWithdrawUser } = require ('./withdraw/queueMethods');
const utils = require('../utils');
const QUEUE_REGEX = /__queue_(.+)_(\d+)/;
var Commands = {};
function setCallDown(command, userId, timeout) {
    if (timeout === void 0) { timeout = 10000; }
    if (!Object.keys(Commands).includes(command)) {
        Commands[command] = [];
    }
    if (Commands[command].includes(userId)) {
        return false;
    }
    else {
        Commands[command].push(userId);
        setTimeout(function (_) {
            removeCallDown(command, userId);
        }, timeout);
        return true;
    }
}
function removeCallDown(command, userId) {
    var index = Commands[command].findIndex(function (value) { return value === userId; });
    Commands[command].splice(index, 1);
}

module.exports = class Queue {
    telegraf;
    mysql = new Database();
    cronJob;
    constructor(cronTime, timeZone, telegraf) {
        this.telegraf = telegraf;
        telegraf.action('confirm_withdrawal', ctx => {
            //if (ctx.args.length &&
            //    ['gems', 'items', 'big_gems'].includes(ctx.args[0])) {
            //    this.onCommand(ctx, ctx.args[0]);
            //}
            const calldownState = setCallDown('withdraw', ctx.from.id, 5000);
            if(calldownState) {
                this.onCommand(ctx, 'items');
            } else {
                ctx.reply('Слишком быстро!');
            }
        });
        telegraf.action(QUEUE_REGEX, async ctx => {
            const userDB = await utils.getUserData(ctx.from.id);
            if (ctx.callbackQuery['data']) {
                const parsedData = QUEUE_REGEX.exec(ctx.callbackQuery['data']).slice(1, 3);
                if (parseInt(parsedData[1]) == ctx.callbackQuery.from.id) {
                    this.givePromocode(parsedData[0], userDB.vip_status > 4 ? 'premium' : "default");
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
        let userDB = await utils.getUserData(user_id);
        if(!userDB) {
            await utils.createUser(user_id, context.from.first_name);
            userDB = await utils.getUserData(user_id);
        }
        const userPrem = userDB?.vip_status > 4;
        if(!userDB) {
            await utils.createUser(user_id, context.from.first_name)
        }
        const withdrawUser = {
            id: context.from.id, 
            waitingType: type
        }
        const hasWithdraw = await this.mysql.hasWithdrawUser(withdrawUser)
        const hasWithdrawPrem = await this.mysql.hasWithdrawUser(withdrawUser, 'premium')

        if(Object.values(hasWithdraw)[0] || Object.values(hasWithdrawPrem)[0] ) {
            return context.sendMessage("У вас уже стоит предмет на выводе...\nДождитесь вашего прошлого вывода!");
        }
        if(userDB[type] < 1) {
            return context.sendMessage("У вас недостаточно предметов для вывода...");
        }
        if(!userPrem) {
            if(userDB.coins < 2000) {
                return context.sendMessage(`Стоимость вывода луны: 2000 монеток 💰\n\nУ вас сейчас:\n${userDB.coins} 💰\n${userDB.items} 🌙\n\nВы можете накопить баланс или приобрести 👑 Подписку.\nВывод с подпиской - 0 💰`);
            }
            userDB.coins = userDB.coins - 2000;
            await utils.updateUserData(user_id, 'coins', userDB.coins);
        }
        userDB[type] = userDB[type] - 1;
        await utils.updateUserData(user_id, type, userDB[type]);
        await this.mysql.tryPutQueue({
            id: context.from.id, 
            waitingType: type
        }, userDB.vip_status > 4 ? 'premium' : "default");

        context.sendMessage("Вы были поставлены в очередь, пожалуйста ожидайте. Бот отправит вам сообщение", { parse_mode: 'Markdown' });
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
            for(let i = 0; i < wUsers.length; ++i) {
                const user = wUsers[i];
                const promo = await this.mysql.linkWithdrawPromocode(user, status);
                if (promo) {
                    await this.telegraf.telegram.sendMessage(user.id, "Поздравляем! Вот ваш код.\nНажмите на кнокпу в течении недели чтобы забрать его, иначе он пропадёт!", this.generateKeyboard(promo, user));
                }
                else {
                    break;
                }
                await new Promise((resolve) => setTimeout(resolve, 5000)); 
            }
        }
    }
    generateKeyboard(promocode, user) {
        return Markup.inlineKeyboard([
            Markup.button.callback("Забрать код", `__queue_${promocode.code}_${user.id}`)
        ]);
    }
}