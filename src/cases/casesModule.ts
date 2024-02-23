import { Bot } from "../../bot";
import { Module } from "../../module";
import { EventHandler } from "../events/eventHandler";
import { CaseListener } from "./casesListener";
import { StringBuilder } from "../utils/stringBuilder";
import { User } from "../interface/user";
import { Inventory } from "../interface/inventory";
import { NotNull } from "src/utils/decorators";
import { 
  HRCaseEvent, 
} from "./casesEvent";
import { AccessLevel } from "../interface/security";

import { Random } from "../../src/utils/random";

export class CaseModule implements Module {
  constructor(private readonly bot: Bot) {}

  init(): void {

    EventHandler.Handler.addListener(new CaseListener(this));
    this.bot.Telegraf.command("caseHR", async (context) => {
      await this.bot.Utils.initUser(context.from.id, context.from.first_name);
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id),AccessLevel.user))
      HRCaseEvent.execute(context, context.args);
    });
  }

  async getPrize(userId: number, amount: number): Promise<void> {
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

  getResult(min: number, max:number): number {
    return Random.getRandom(min, max);
  }
}
