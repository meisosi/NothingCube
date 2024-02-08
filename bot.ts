import { Telegraf } from "telegraf";
import { ErrorModule } from "./src/errorLogger/errorModule";
import { Configuration, DefaultConfigCreator, FILE_REGEX } from "./src/utils/yaml";
import { TextModuleExample } from "./src/examples/textExample/textModule";
import { BotUtils } from './src/utils/utils'

export class Bot {
    protected utils : BotUtils = new BotUtils(this.telegraf);
    protected configurations: Map<string, Configuration> = new Map();
    private defaultConfigCreator: DefaultConfigCreator = new DefaultConfigCreator();
    
    get Utils() : BotUtils {
        return this.utils;
    }
    
    get Telegraf() : Telegraf {
        return this.telegraf;
    }

    constructor(
        private readonly telegraf: Telegraf
    ) { }

    private addConfig(path: string, encoding: BufferEncoding = 'utf-8') {
        let config = this.defaultConfigCreator.create(path, encoding);
        if(config) {
            this.configurations.set(FILE_REGEX.exec(path)[3], config);
        }
    }

    getConfig(name: string) {
        return this.configurations.get(name);
    }

    launch() {
        this.addConfig('configs/messages.yaml');
        this.addConfig('configs/abbreviations.yaml');

        new ErrorModule().init(this, this.telegraf);
        new TextModuleExample().init(this, this.telegraf);

        this.telegraf.launch();
    }
}