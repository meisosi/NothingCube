import { Context } from "telegraf";
import { EventHandler } from "../events/eventHandler";
import { Listener } from "../events/listener";
import { NotNull } from "../utils/decorators";
import { SendRollTryEvent } from "./rollEvent";
import { RollModule } from "./rollModule";
import { Inventory } from "../interface/inventory";
import { Random } from "../utils/random";
import { CUBE, Prize } from "./rollTypes";

export class RollListener extends Listener {
    private readonly DICE_EMOJI = CUBE;

    constructor(
        private readonly module: RollModule
    ) {
        super();
    }

    @EventHandler.Handler.handle(
        SendRollTryEvent
    )
    private async onRoll(
        @NotNull context: Context, 
        argument: any
    ) {
        let inventory = await this.module.getInventory(context.from.id);
        if(argument) {
            let countRolls = parseInt(argument);
            if(!isNaN(countRolls)) {
                return this.sendCube(context, countRolls, inventory);
            }
        }
        this.sendCube(context, 1, inventory);
    }

    private async sendCube(
        context: Context,
        countRolls: number,
        inventory: Inventory
    ) {
        if(countRolls <= 0) {
            return;
        }
        if(countRolls > inventory.rolls) {
            return context.sendMessage(this.module.getMessage('notEnough'));;
        }
        let result : number = 0;
        let prize : Prize;
        if(countRolls === 1) {
            result = (await context.sendDice({emoji: this.DICE_EMOJI.emoji})).dice.value;
            prize = this.module.getPrize(result);
            inventory[prize.type] += prize.value;
        } else {
            Random.getRandomArray(countRolls, 1, this.DICE_EMOJI.maxValue).forEach(value => {
                prize = this.module.getPrize(value);

                inventory[prize.type] += prize.value;
                result += value;
            });
        }
        inventory.rolls -= countRolls;

        this.module.updateUserInventory(inventory.user_id, 'coins', inventory.coins);
        this.module.updateUserInventory(inventory.user_id, 'rolls', inventory.rolls);

        return context.sendMessage(this.module.getMessage('win',
            result,
            inventory.coins,
            inventory.rolls));
    }
}