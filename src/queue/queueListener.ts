import { Context } from "telegraf";
import { EventHandler } from "../events/eventHandler";
import { Listener } from "../events/listener";
import { QueueCommandEvent, QueueGivePromocodeEvent } from "./queueEvents";
import { QueueModule } from "./queueModule";

export class QueueListener extends Listener {
    constructor(
        private readonly module: QueueModule
    ) {
        super();
    }
    @EventHandler.Handler.handle(QueueCommandEvent)
    private async onCommand(context: Context, parameters: string[]) {
        if(
            parameters.length &&
            ['gems', 'moons', 'big_gems'].includes(parameters[0])
        ) {
            const promocode = await this.module.putQueue({ 
                userId: context.from.id, 
                waitingType: parameters[0] as 'gems' | 'moons' | 'big_gems'
            });
            if(
                promocode &&
                context.from.id === promocode.userId
            ) {
                this.module.sendGiveMessage(context.from.id, promocode);
            } else {
                context.sendMessage(this.module.getMessage('putQueue'), { parse_mode: 'MarkdownV2' });
            }
        }
    }
    @EventHandler.Handler.handle(QueueGivePromocodeEvent)
    private async onGive(context: Context, lobbyId: string, userId: number) {
        if(userId === context.from.id) {
            const promocode = await this.module.givePromocode(lobbyId);
            if(promocode) {
                this.module.sendGiveMessage(context.from.id, promocode);
            }
        }
    }
}