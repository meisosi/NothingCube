import { Telegraf } from "telegraf";
import { TextExampleModule } from "./src/examples/modules/textExampleModule";
import { KeyboardExampleModule } from "./src/examples/modules/keyboardExampleModule";
import { ErrorModule } from "./src/errors/modules/errorModule";

export class Bot {
    constructor(private readonly telegraf: Telegraf) {
        this.launch();
    }

    private launch() {
        new TextExampleModule().init(this.telegraf);
        new KeyboardExampleModule().init(this.telegraf);
        new ErrorModule().init(this.telegraf);

        this.telegraf.launch();
    }
}