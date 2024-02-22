import { Context } from "telegraf";
import { EventHandler } from "../events/eventHandler";
import { Listener } from "../events/listener";
import { PromocodeModule } from "./promocodeModule";
import { PromocodeUse } from "./promocodeEvent";
import { NotNull } from "../utils/decorators";
import { Promocode, PromocodeType } from "../interface/promocode";
import { expressPromocode } from "src/interface/expressPromo";

export class PromocodeListener extends Listener {
  constructor(private readonly module: PromocodeModule) {
    super();
  }

  @EventHandler.Handler.handle(PromocodeUse)
  private async onPromocode(@NotNull context: Context, argument: any) {
    const inputPromo: string = argument.join(" ");
    const userId: number = context.from.id;

    const promocode: Promocode = await this.module.checkPromocode(inputPromo);
    if (await this.module.getPromocodeUsage(userId, inputPromo)) {
      return context.sendMessage(this.module.getMessage("used"));
    }
    if (promocode) {
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
      return context.sendMessage(
        this.module.getMessage("sucsess", count, type, inventory[type] + count)
      );
    }
  }
}
