import { Bot } from "../../bot";
import { Module } from "../../module";
import { EventHandler } from "../events/eventHandler";
import { AdminListener } from "./adminListener";
import { StringBuilder } from "../utils/stringBuilder";
import { User } from "../interface/user";
import { Inventory } from "../interface/inventory";
import { NotNull } from "src/utils/decorators";
import { UserCoinsChangeEvent } from "./adminEvent";
import { AccessLevel } from "src/interface/security";

export class AdminModule implements Module {
  constructor(private readonly bot: Bot) {}

  init(@NotNull path: string): void {
    if (!path || path === StringBuilder.empty) {
      return;
    }

    EventHandler.Handler.addListener(new AdminListener(this));
    this.bot.Telegraf.command("coinschange", async (context) => {
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id), AccessLevel.support))
        UserCoinsChangeEvent.execute(context, context.args[0]);
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
}
