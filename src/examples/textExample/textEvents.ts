import { Context } from "telegraf";
import { BotEvent } from "../../events/botEvent";
import { Listener } from "../../events/listener";
import { EventHandler } from "../../events/eventHandler";
import { Update } from "telegraf/types";
import { Bot } from "../../../bot";

export class TextEventExample extends BotEvent {
    public static execute(context: Context<Update>, messageText: string): void {
        super.execute(context, messageText);
    }
}

export class TextListenerExample extends Listener {
    constructor(private readonly bot: Bot) {
        super();
    }

    @EventHandler.Handler.handle(
        TextEventExample
    )
    private onHello(context: Context<Update>, messageText: string) {
        switch (messageText) {
            case 'hello':
                context.sendMessage(this.bot.getConfig('messages.yaml').getObject('messages.hello') as string);
                break;
            default:
                break;
        }
    }

    @EventHandler.Handler.handle(
        TextEventExample
    )
    private onAbbreviation(context: Context<Update>, messageText: string) {
        if(this.bot.getConfig('abbreviations.yaml').has(messageText)) {
            context.sendMessage(this.bot.getConfig('abbreviations.yaml').getObject(messageText) as string);
        }
    }
}