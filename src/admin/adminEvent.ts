import { Context } from "telegraf";
import { BotEvent } from "../events/botEvent";
import { NotNull } from "../utils/decorators";

export class UserCoinsChangeEvent extends BotEvent {
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

export class UserRollsChangeEvent extends BotEvent {
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

export class UserGemsChangeEvent extends BotEvent {
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

export class UserMoonsChangeEvent extends BotEvent {
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

export class UserBigGemsChangeEvent extends BotEvent {
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

export class MailingEvent extends BotEvent {
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