import { Context } from "telegraf";
import { EventHandler } from "../events/eventHandler";
import { Listener } from "../events/listener";
import { PromocodeModule } from "./promocodeModule";
import { PromocodeUse } from "./promocodeEvent";
import { NotNull } from "../utils/decorators";
import { Promocode } from "../interface/promocode";

export class PromocodeListener extends Listener {
  constructor(private readonly module: PromocodeModule) {
    super();
  }

  @EventHandler.Handler.handle(PromocodeUse)
  private async onPromocode(@NotNull context: Context, argument: any) {
    const inputPromo: string = argument;
    const userId: number = context.from.id;
    const promocode: Promocode = await this.module.checkPromocode(inputPromo);
    if (await this.module.getPromocodeUsage(userId, inputPromo)) {
      return context.sendMessage(this.module.getMessage("used"));
    }
    else if (promocode) {
      if (promocode.activations === 0 || new Date(promocode.expires_at) < new Date()) {
        this.module.setPromocodeInacive(promocode);
        if (promocode.activations == 0) {
          return context.sendMessage(this.module.getMessage("noActivations"));
        } else {
          return context.sendMessage(this.module.getMessage("express"));
        }
      }
      const count = promocode.count;
      const type = promocode.type;
      let inventory = await this.module.getInventory(context.from.id);
      inventory[type] += count;
      this.module.usagePromocode(userId, promocode.code);
      this.module.deductPromocode(promocode);
      this.module.updateUserInventory(inventory.user_id, type, inventory[type]);
      let ruType: string;
      switch (type) {
        case "coins": 
          ruType = "монеток"
          break;
        case "gems": 
          ruType = "паков по 60 гемов"
          break;
        case "rolls": 
          ruType = "бросков"
          break;
        case "moons": 
          ruType = "лун"
          break;
        case "big_gems":
          ruType = "паков по 1090 гемов"
          break;
        case "friend_coins":
          ruType = "монеток дружбы"
          break;
        default:
          ruType = "воздуха"
          break;
      }
      return context.sendMessage(
        this.module.getMessage("sucsess", count, ruType, inventory[type])
      );
    }
    else {
      return context.sendMessage(this.module.getMessage("notFound"));
    }
  }
}
