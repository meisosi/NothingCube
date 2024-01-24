import { EventError } from "../events/errorEvent";
import { NotNull } from "../../utils/decorators";
import { Module } from "../../modules/module";
import { Telegraf } from "telegraf";

export class ErrorModule implements Module {
    init(@NotNull telegraf: Telegraf) {
        if(telegraf == (undefined || null)) {
            return;
        }
        process.on('uncaughtException', err => EventError.send(err));
    }
}