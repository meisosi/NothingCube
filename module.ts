import { Bot } from "./bot";

export interface Module {
    init(bot: Bot, ...params: any[]) : any;
}