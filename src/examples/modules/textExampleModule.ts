
import { Telegraf } from "telegraf";
import { TextEvent } from "../events/textExampleEvents";
import { NotNull } from "../../utils/decorators";
import { Module } from "modules/module";

export class TextExampleModule implements Module {
    init(@NotNull telegraf: Telegraf) {
        if(telegraf == (undefined || null)) {
            return;
        }
        telegraf.on('text', c => { TextEvent.send(c, c.message!.text!.toUpperCase())});
    }
}