import { Context } from "telegraf";
import { BotEvent } from "../events/botEvent";
import { NotNull } from "../utils/decorators";

export class FAQGlobalEvent extends BotEvent {
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

export class FAQMiniGamesEvent extends BotEvent {
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

export class FAQRefEvent extends BotEvent {
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

export class FAQOnlineEvent extends BotEvent {
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

export class FAQCasesEvent extends BotEvent {
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