import { Telegraf } from "telegraf";
import { Bot } from "../../../bot";
import { Module } from "root/../module";
import { NotNull } from "../../utils/decorators";
import { EventHandler } from "../../events/eventHandler";
import { TextEventExample, TextListenerExample } from "./textEvents";
import { message } from "telegraf/filters";

export class TextModuleExample implements Module{
    init(@NotNull bot: Bot, @NotNull telegraf: Telegraf) {
        if(bot == null || telegraf == null) {
            return;
        }
        EventHandler.Handler.addListener(new TextListenerExample(bot));
        telegraf.on(message('text'), context => TextEventExample.execute(context, context.message.text));
    }
}