import { Context } from "telegraf";
import { BotEvent } from "../events/botEvent";
import { NotNull } from "../utils/decorators";

export class AddRollsMenuEvent extends BotEvent {
    static execute(
        @NotNull context: Context, 
        argument: any,
    ): void {
        if(context == null) {
            return;
        }
        super.execute(context, argument);
    }
}

export class CheckChannelSubsEvent extends BotEvent {
    static execute(
        @NotNull context: Context, 
        argument: any,
    ): void {
        if(context == null) {
            return;
        }
        super.execute(context, argument);
    }
}

export class CollcetRollsEvent extends BotEvent {
    static execute(
        @NotNull context: Context, 
        argument: any,
    ): void {
        if(context == null) {
            return;
        }
        super.execute(context, argument);
    }
}