import { NotNull } from "../../utils/decorators";
import { BotEvent, EventHandler, Listener } from "../../events/event";
import { Context, Markup, Telegraf } from "telegraf";

enum Abbreviations {
    AFK     = 'Away from keyboard',
    MQ      = 'Mother, q',
    TS      = "TypeScript"
}

export class TextEvent extends BotEvent {
    static send(@NotNull context: Context, text: string | null) {
        if(context == (undefined || null)) {
            return;
        }
        EventHandler.invoke(this, context, text);
    }
}

class TextListener extends Listener {
    @EventHandler.Handler(
        TextEvent
    )
    onAbbreviation(context: Context, abbreviation: string) {
        if(Object.keys(Abbreviations).includes(abbreviation)) {
            context.reply(Abbreviations[abbreviation]);
        }
    }

    @EventHandler.Handler(
        TextEvent
    )
    onHelloMessage(context: Context, message: string | null) {
        if(message.toLowerCase() == 'hello') {
            context.reply('И вам не хворать!', Markup.inlineKeyboard([
                Markup.button.callback('А может иначе?', '_hello'),
            ]));
        }
    }
}