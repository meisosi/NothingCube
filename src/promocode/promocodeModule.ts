import { Bot } from "../../bot";
import { Module } from "../../module";
import { EventHandler } from "../events/eventHandler";
import { PromocodeListener } from "./promocodeListener";
import { PromocodeUse } from "./promocodeEvent";
import { AccessLevel } from "../interface/security";
import { Promocode } from "../interface/promocode";
import { StringBuilder } from "../../src/utils/stringBuilder";
import { YAML_PATH_SEPARATOR } from "../../src/utils/yaml";
import { expressPromocode } from "../../src/interface/expressPromo";
import { NotNull } from "../../src/utils/decorators";
import { Inventory } from "../../src/interface/inventory";

type PromocodeMessages = 'sucsess' | 'notFound' | 'express' | 'noActivations' | 'used';

export class PromocodeModule implements Module {
  constructor(private readonly bot: Bot) {}

  init(): void {

    EventHandler.Handler.addListener(new PromocodeListener(this));
    this.bot.Telegraf.command("promocode", async (context) => {
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id),AccessLevel.support))
        PromocodeUse.execute(context, context.args);
    });
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

  async checkPromocode(code: string): Promise<Promocode | null> {
    let promocode: Promocode = await this.bot.Utils.getPromocode(code);
    return promocode ? promocode : null;
  }
  async foundInactivePromo(code: string): Promise<expressPromocode | null> {
    let promocode: expressPromocode | null = await this.bot.Utils.foundInactivePromo(code);
    return promocode ? promocode : null;
  }
  async getPromocodeUsage(userId: number, code: string) {
    return await this.bot.Utils.getPromocodeUsage(userId, code);
  }
  async deductPromocode(promocode: Promocode) {
    return await this.bot.Utils.deductPromocode(promocode)
  }
  async usagePromocode(userId: number, code: string) {
    return await this.bot.Utils.usagePromocode(userId, code)
  }
  async setPromocodeInacive(promocode: Promocode) {
    return await this.bot.Utils.setInactivePromo(promocode)
  }

  getMessage(message: PromocodeMessages, ...params: any) : string {
    return StringBuilder.format(
        this.bot.getConfig('messages.yaml').
        get(`promocode${YAML_PATH_SEPARATOR}${message}`) as string, ...params
    );
}
}