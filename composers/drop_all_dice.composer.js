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

composer.action("drop_all_dice", async (ctx) => {
    try {
        const user = await utils.getUserData(ctx.from.id);
        const stat = await utils.getUserStats(ctx.from.id);

        if (!stat) {
            await utils.createUserStats(ctx.from.id);
        }

        if (user.rolls <= 0) {
            ctx.reply('У вас недостаточно бросков', kb.drop_dice_menu);
            return;
        }

        let userRolls = user.rolls;
        let userCoins = user.coins;
        let allResult = 0;
        let rollCount = 0

        while (userRolls > 0 && rollCount < 5) {
            const diceResult = await ctx.replyWithDice();
            userRolls -= 1;
            const selectedResult = diceResult.dice.value;
            const reward = rewards[selectedResult];
        
            if (reward === undefined) {
                ctx.reply('Произошла ошибка при определении награды');
                return;
            }
        
            allResult += reward;
            userCoins += reward;
            rollCount += 1;

            await utils.increaseUserRolls(ctx.from.id);
        }
        await utils.increaseUserEarned(ctx.from.id, allResult);
        await utils.updateUserData(ctx.from.id, 'coins', userCoins);
        await utils.updateUserData(ctx.from.id, 'rolls', userRolls);

        setTimeout(async () => {
            let resultMessage = `Ты бросил ${rollCount} кубиков 🎲\n\n`;
            resultMessage += `Твоя награда составила: ${allResult} 💰\n`
            resultMessage += `Твой баланс: ${userCoins} 💰\n`
            ctx.reply(resultMessage, kb.drop_dice_menu);
        }, 5000);
    } catch (e) {
        console.log(e);
    }
});

module.exports = composer;
