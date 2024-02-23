import { Context } from "telegraf";
import { BotEvent } from "../events/botEvent";
import { NotNull } from "../utils/decorators";

export class QueueCommandEvent extends BotEvent {
    static execute(
        @NotNull context: Context, 
        parameters: string[]
    ): void {
        if(context == null) {
            return;
        }
        super.execute(context, ...parameters);
    }
}

export class QueueGivePromocodeEvent extends BotEvent {
    static execute(
        @NotNull context: Context, 
        code: string,
        userId: number
    ): void {
        if(context == null) {
            return;
        }
        super.execute(context);
    }
}