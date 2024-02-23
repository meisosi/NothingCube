import { Context } from "telegraf";
import { EventHandler } from "../events/eventHandler";
import { Listener } from "../events/listener";
import { StartModule } from "./startModule";
import { StartEvent } from "./startEvent";
import { NotNull } from "../utils/decorators";
import { PromocodeUse } from "../../src/promocode/promocodeEvent";

export class StartListener extends Listener {
  constructor(private readonly module: StartModule) {
    super();
  }

  @EventHandler.Handler.handle(StartEvent)
  private async onStart(@NotNull context: Context, argument: any) {
    if(argument) {
      const action = argument.split('_')[0];
      if(action == 'promo') {
        const code: string = argument.slice(argument.indexOf('_') + 1);
        PromocodeUse.execute(context, code);
      }
    }
  }
}
