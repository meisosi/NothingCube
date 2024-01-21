import { Module } from "../../modules/module";
import { Telegraf } from "telegraf";
import { KeyboardEvent } from "../events/keyboardExampleEvents";
import { NotNull } from "../../utils/decorators";

export class KeyboardExampleModule implements Module {
    init(@NotNull telegraf: Telegraf) {
        if(telegraf == (undefined || null)) {
            return;
        }
        telegraf.action('_hello', c => { KeyboardEvent.send(c, '_hello') })
    }
}