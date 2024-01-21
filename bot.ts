import { Telegraf } from "telegraf";
import { TextExampleModule } from "./examples/modules/textExampleModule";
import { KeyboardExampleModule } from "./examples/modules/keyboardExampleModule";

export class Bot {
    constructor(private readonly telegraf: Telegraf) {
        this.launch();
    }

    private launch() {
        new TextExampleModule().init(this.telegraf);
        new KeyboardExampleModule().init(this.telegraf);
        this.telegraf.launch();
    }
}