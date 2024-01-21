import { NotNull } from "../../utils/decorators";
import { BotEvent, EventHandler, Listener } from "../../events/event";
import { Context } from "telegraf";

export class KeyboardEvent extends BotEvent {
    static send(@NotNull context: Context, callback: string | null) {
        if(context == (undefined || null)) {
            return;
        }
        EventHandler.invoke(this, context, callback);
    }
}

class KeyboardLstener extends Listener {
    @EventHandler.Handler(
        KeyboardEvent
    )
    onClick(context: Context, callback: string) {
        switch (callback) {
            case '_hello':
                context.editMessageText('Ну здравствуй, чёрт...');
                break;
        
            default:
                break;
        }
    }
}