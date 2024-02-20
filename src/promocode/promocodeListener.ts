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
    console.log(inputPromo);
    const userId: number = context.from.id;

    const promocode: Promocode = await this.module.checkPromocode(inputPromo);
    if (promocode) {
      if (this.module.getPromocodeUsage(userId, inputPromo)) {
        return context.sendMessage(this.module.getMessage("used"));
      } else {
        const count = promocode.count;
        const type = promocode.type;
        let inventory = await this.module.getInventory(context.from.id);
        inventory[type] += count;
        //Вычитать использование промокода
        this.module.updateUserInventory(inventory.user_id, type, inventory[type]);
        return context.sendMessage(this.module.getMessage("sucsess", count, type, inventory[type] + count)
        );
      }
    } else {
      const expressPromo: expressPromocode =
        await this.module.foundUnactivePromo(inputPromo);
      if (expressPromo) {
        if (expressPromo.activations == 0) {
          return context.sendMessage(this.module.getMessage("noActivations"));
        } else {
          return context.sendMessage(this.module.getMessage("express"));
        }
      } else {
        return context.sendMessage(this.module.getMessage("notFound"));
      }
    }
  }
}
