import { Telegraf } from "telegraf";
import { ErrorModule } from "./src/errorLogger/errorModule";
import { Config } from "./src/utils/yaml";
import { TextModuleExample } from "./src/examples/textExample/textModule";
import { BotUtils } from './src/utils/utils'

export class Bot {
    private configs : Map<string, Config> = new Map();

    public getConfig(fileName: string) {
        return this.configs.get(fileName);
    };
    public utils : BotUtils = new BotUtils();

    constructor(
        private readonly telegraf: Telegraf,
        private readonly configDirectory: string
    ) { }

    public launch() {
        this.addConfig('messages.yaml');
        this.addConfig('abbreviations.yaml');

        new ErrorModule().init(this, this.telegraf);
        new TextModuleExample().init(this, this.telegraf);

        this.telegraf.launch();
    }

    private addConfig(fileName: string) {
        this.configs.set(fileName, new Config(this.configDirectory + fileName));
    }
}