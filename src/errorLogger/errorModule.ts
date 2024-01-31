import { ErrorListener, EventError } from "./errorEvent";
import { NotNull } from "../utils/decorators";
import { Telegraf } from "telegraf";
import { Bot } from "../../bot";
import { Module } from "../../module";
import { EventHandler } from "../events/eventHandler";

export class ErrorModule implements Module {
    init(@NotNull bot: Bot, @NotNull telegraf: Telegraf) {
        if(telegraf == (undefined || null)) {
            return;
        }
        EventHandler.Handler.addListener(new ErrorListener());
        process.on('uncaughtException', err => EventError.execute(err));
    }
}