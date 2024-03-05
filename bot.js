const { Telegraf } = require('telegraf')
require('dotenv').config()
const { dailyJob, reminder } = require('./cron');
const http = require('http')

const token = process.env.TOKEN_BOT
const bot = new Telegraf(token)
const Queue = require("./queue/queue");
new Queue('* * * * *', 'UTC+3', bot);


bot.use(require('./composers/start.composer')) //start
bot.use(require('./composers/drop_dice.composer')) //drop dice
bot.use(require('./composers/drop_all_dice.composer'))
bot.use(require('./composers/add_drops.composer')) //add drops
bot.use(require('./composers/mini_games/mini_games.composer')) //mini games
bot.use(require('./composers/faq.composer')) //FAQ
bot.use(require('./composers/gems_shop.composer')) //gems shop
bot.use(require('./composers/shop_subscription.composer')) //shop_subscription
bot.use(require('./composers/profile/profile.composer')) //profile
bot.use(require('./composers/support.composer'))

if (process.env.STATUS === "DEBUG") {
    bot.launch()
    bot.telegram.setWebhook("", { drop_pending_updates: "True" })
} else if (process.env.STATUS === "PRODUCTION") {

    let interval = setInterval(() => {
        let date = new Date("2023-11-11 21:00");
        let currentDate = new Date();
        if (date.getTime() < currentDate.getTime()) {
            console.log("Бот да")
            const server = http.createServer(bot.webhookCallback('/webhook'))

            server.listen(8443, () => {
                console.log('Webhook server started at port 8443')
            })

            bot.telegram.setWebhook('https://nothingcube.ru/webhook', { drop_pending_updates: "True" })

            clearInterval(interval);
        }
    }, 5000);
}

dailyJob.start()
reminder.start()