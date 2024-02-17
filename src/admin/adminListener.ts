import { Context } from "telegraf";
import { EventHandler } from "../events/eventHandler";
import { Listener } from "../events/listener";
import { AdminModule } from "./adminModule";
import { UserCoinsChangeEvent } from "./adminEvent";
import { NotNull } from "src/utils/decorators";

export class AdminListener extends Listener {
  constructor(private readonly module: AdminModule) {
    super();
  }

  @EventHandler.Handler.handle(UserCoinsChangeEvent)

  private async onChangeCoinsCommand(@NotNull context: Context, argument: any) {
    const userId: number = parseInt(argument[0]);
    const amount: number = parseInt(argument[1]);
    await this.module.changeCoins(userId, amount);
    await context.reply(
      `Successfully added ${amount} coins to user ${userId}.`
    );
  }

}
