const { Composer } = require('telegraf')
const composer = new Composer()
const kb = require('../../../keyboars.json')

const duelQueue = [];

bot.command('duel', async (ctx) => {
    try {
        // Проверка, есть ли уже кто-то в очереди
        if (duelQueue.length > 0) {
            const opponent = duelQueue.shift(); // Получаем первого человека из очереди
            // Здесь можно инициализировать дуэль между ctx.from и opponent
            // ...

            // Отправляем сообщение о начале дуэли
            ctx.reply('Дуэль началась! Спустите курок и покажите, кто лучший стрелок!');
        } else {
            // Если в очереди никого нет, добавляем текущего пользователя в очередь
            duelQueue.push(ctx.from);
            ctx.reply('Вы встали в очередь на дуэль. Ждем соперника...');
        }
    } catch (e) {
        console.log(e);
        await ctx.reply('Произошла ошибка, пожалуйста, сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot');
    }
});