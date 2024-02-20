import { Bot } from "../../bot";
import { Module } from "../../module";
import { EventHandler } from "../events/eventHandler";
import { AdminListener } from "./adminListener";
import { StringBuilder } from "../utils/stringBuilder";
import { User } from "../interface/user";
import { Inventory } from "../interface/inventory";
import { NotNull } from "src/utils/decorators";
import {
  UserCoinsChangeEvent,
  UserRollsChangeEvent,
  UserGemsChangeEvent,
  UserMoonsChangeEvent,
  UserBigGemsChangeEvent,
  PromocodeCreateEvent,
} from "./adminEvent";
import { AccessLevel } from "../../src/interface/security";
import { Promocode, PromocodeType } from "../../src/interface/promocode";

export class AdminModule implements Module {
  constructor(private readonly bot: Bot) {}

  init(): void {

    EventHandler.Handler.addListener(new AdminListener(this));
    this.bot.Telegraf.command("changecoins", async (context) => {
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id),AccessLevel.support))
        UserCoinsChangeEvent.execute(context, context.args);
    });
    this.bot.Telegraf.command("changerolls", async (context) => {
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id),AccessLevel.support))
        UserRollsChangeEvent.execute(context, context.args);
    });
    this.bot.Telegraf.command("changegems", async (context) => {
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id),AccessLevel.support))
        UserGemsChangeEvent.execute(context, context.args);
    });
    this.bot.Telegraf.command("changemoons", async (context) => {
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id),AccessLevel.support))
        UserMoonsChangeEvent.execute(context, context.args);
    });
    this.bot.Telegraf.command("changebiggems", async (context) => {
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id),AccessLevel.support))
        UserBigGemsChangeEvent.execute(context, context.args);
    });
    this.bot.Telegraf.command("createpromocode", async (context) => {
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id),AccessLevel.streamer))
        PromocodeCreateEvent.execute(context, context.args);
      });
  }

  async changeCoins(userId: number, amount: number): Promise<void> {
    const userInventory: Inventory = await this.bot.Utils.getUserInventory(
      userId
    );
    if (userInventory) {
      const updatedCoins: number = userInventory.coins + amount;
      await this.bot.Utils.updateUserCoins(userId, updatedCoins);
    } else {
      throw new Error(`User with ID ${userId} not found.`);
    }
  }

  async changeRolls(userId: number, amount: number): Promise<void> {
    const userInventory: Inventory = await this.bot.Utils.getUserInventory(
      userId
    );
    if (userInventory) {
      const updatedRolls: number = userInventory.rolls + amount;
      await this.bot.Utils.updateUserRolls(userId, updatedRolls);
    } else {
      throw new Error(`User with ID ${userId} not found.`);
    }
  }

  async changeGems(userId: number, amount: number): Promise<void> {
    const userInventory: Inventory = await this.bot.Utils.getUserInventory(
      userId
    );
    if (userInventory) {
      const updatedGems: number = userInventory.gems + amount;
      await this.bot.Utils.updateUserInventory(userId, "gems", updatedGems);
    } else {
      throw new Error(`User with ID ${userId} not found.`);
    }
  }

  async changeMoons(userId: number, amount: number): Promise<void> {
    const userInventory: Inventory = await this.bot.Utils.getUserInventory(
      userId
    );
    if (userInventory) {
      const updatedMoons: number = userInventory.moons + amount;
      await this.bot.Utils.updateUserInventory(userId, "moons", updatedMoons);
    } else {
      throw new Error(`User with ID ${userId} not found.`);
    }
  }

  async changeBigGems(userId: number, amount: number): Promise<void> {
    const userInventory: Inventory = await this.bot.Utils.getUserInventory(
      userId
    );
    if (userInventory) {
      const updatedGems: number = userInventory.big_gems + amount;
      await this.bot.Utils.updateUserInventory(userId, "big_gems", updatedGems);
    } else {
      throw new Error(`User with ID ${userId} not found.`);
    }
  }

  async createPromocode(code: string, type: PromocodeType, count: number, activations: number, expires_at: Date | null): Promise<Promocode> {
    const allowedCharacters = /[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]/g;
    code = code.replace(new RegExp(`[^${allowedCharacters.source}]`, 'g'), '');
    return await this.bot.Utils.createPromocode(code, type, activations, count, expires_at)
  }
}
