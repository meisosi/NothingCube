import { Context } from "telegraf";
import { BotEvent } from "../events/botEvent";
import { NotNull } from "../utils/decorators";

export class PromocodeUse extends BotEvent {
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