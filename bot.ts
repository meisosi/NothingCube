import { Telegraf } from "telegraf";
import { ErrorModule } from "./src/errorLogger/errorModule";
import { Configuration, DefaultConfigCreator, FILE_REGEX } from "./src/utils/yaml";
import { BotUtils } from './src/utils/utils'
import { RollModule } from "./src/roll/rollModule";
import { AdminModule } from "./src/admin/adminModule";
import { PromocodeModule } from "./src/promocode/promocodeModule";
import { StartModule } from "./src/start/startModule";
import { ReferalModule } from "./src/referal/referalModule";
import { QueueModule } from "./src/queue/queueModule";
import { FAQModule } from "./src/faq/faqModule";
import { ProfileModule } from "./src/profile/profileModule";
import { AddRollsModule } from "./src/addrolls/addrollsModule";

export class Bot {
    protected utils : BotUtils = new BotUtils();
    protected configurations: Map<string, Configuration> = new Map();
    private defaultConfigCreator: DefaultConfigCreator = new DefaultConfigCreator();
    
    get Telegraf() : Telegraf {
        return this.telegraf;
    }

    get Utils() : BotUtils {
        return this.utils;
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
        new RollModule(this).init("configs/prizes.yaml");
        new AdminModule(this).init();
        new PromocodeModule(this).init();
        new StartModule(this).init();
        new ReferalModule(this).init();
        new QueueModule(this).init("0 0 * * *");
        new FAQModule(this).init();
        new ProfileModule(this).init();
        new AddRollsModule(this).init();

        this.telegraf.launch();
    }
}