import { Bot } from "../../bot";
import { EventHandler } from "../events/eventHandler";
import { Inventory } from "../interface/inventory";
import { Module } from "../../module";
import { NotNull } from "../utils/decorators";
import { StringBuilder } from "../utils/stringBuilder";
import { YAML_PATH_SEPARATOR } from "../utils/yaml";
import { PrizesConfigCreator, PrizesConfiguration } from "./prizesConfig";
import { SendRollTryEvent } from "./rollEvent";
import { RollListener } from "./rollListener";
import { Prize } from "./rollTypes";

type RollMessages = 'notEnough' | 'win';

export class RollModule implements Module {
    private prizesConfig: PrizesConfiguration;
    constructor(
        private readonly bot: Bot
    ) { }

    init(@NotNull path: string) : void {
        if(!path || path === StringBuilder.empty) {
            return;
        }
        let configCreator = new PrizesConfigCreator();
        this.prizesConfig = configCreator.create(path, 'utf-8', false);

        EventHandler.Handler.addListener(new RollListener(this));
        this.bot.Telegraf.command('roll', context => SendRollTryEvent.execute(context, context.args[0]));
    }

    async getInventory(@NotNull userId: number) : Promise<Inventory> {
        if(!userId || isNaN(userId)) {
            throw new Error(`Not found Inventory: (id: ${userId})`);
        }
        return await this.bot.Utils.getUserInventory(userId);
    }

    async updateUserInventory(
        userId: number,
        type: keyof Omit<Inventory, 'user_id'>,
        value: number
    ) {
        if(!userId || isNaN(userId)) {
            throw new Error(`Not found Inventory: (id: ${userId})`);
        }
        return await this.bot.Utils.updateUserInventory(userId, type, value);
    }

    getPrize(@NotNull value: number | string) : Prize {
        if(!value) {
            return {
                type: undefined,
                value: undefined
            }
        }
        if(typeof value === 'string') {
            return this.prizesConfig.getPrize(parseInt(value));
        } else {
            return this.prizesConfig.getPrize(value);
        }
    }
 
    getMessage(message: RollMessages, ...params: any) : string {
        return StringBuilder.format(
            this.bot.getConfig('messages.yaml').
            get(`roll${YAML_PATH_SEPARATOR}${message}`) as string, ...params
        );
    }
}