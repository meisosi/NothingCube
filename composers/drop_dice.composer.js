const { Composer } = require('telegraf');
const composer = new Composer();
const kb = require('../keyboars.json');
const utils = require('../utils');

const rewards = {
    1: 1,
    2: 5,
    3: 10,
    4: 15,
    5: 20,
    6: 25
};

composer.hears("🎲 Кидай кубик", async (ctx) => {
    dropDice(ctx);
})

composer.action("drop_dice", async (ctx) => {
    await ctx.answerCbQuery();
    dropDice(ctx);
});

async function dropDice(ctx) {
    try {
        const user = await utils.getUserData(ctx.from.id);
        const stat = await utils.getUserStats(ctx.from.id);

        if (!stat) {
            await utils.createUserStats(ctx.from.id);
        }

        if (user['rolls'] <= 0) {
            ctx.reply('У вас недостаточно бросков', kb.drop_dice_menu);
            return;
        }

        const diceResult = await ctx.replyWithDice();

        const selectedResult = diceResult.dice.value;
        const reward = rewards[selectedResult];

        if (reward === undefined) {
            // Если награда не определена, обработайте ошибку
            ctx.reply('Произошла ошибка при определении награды');
            return;
        }

        await utils.updateUserData(ctx.from.id, 'coins', user['coins'] + reward);
        await utils.updateUserData(ctx.from.id, 'rolls', user['rolls'] - 1);

        await utils.increaseUserRolls(ctx.from.id);
        await utils.increaseUserEarned(ctx.from.id, reward);

        // Устанавливаем таймер для отправки сообщения с поздравлением через 5 секунд
        setTimeout(async () => {
            let resultMessage = `Ты бросил кубик и тебе выпало: ${selectedResult} 🎲\n\n`;
            resultMessage += `Твоя награда составила: ${reward} 💰\n\n`
            resultMessage += `Твой баланс: ${user.coins + reward} 💰\n`
            resultMessage += `Осталось бросков: ${user.rolls - 1} 🎲`
            ctx.reply(resultMessage, kb.drop_dice_menu);
        }, 5000);
    } catch (e) {
        console.log(e);
    }
}

module.exports = composer;
