import { Context } from "telegraf";
import { EventHandler } from "../events/eventHandler";
import { Listener } from "../events/listener";
import { AdminModule } from "./adminModule";
import { 
    UserCoinsChangeEvent, 
    UserRollsChangeEvent, 
    UserGemsChangeEvent,
    UserMoonsChangeEvent,
    UserBigGemsChangeEvent,
    MailingEvent,
    PromocodeCreateEvent
} from "./adminEvent";
import { NotNull } from "../../src/utils/decorators";
import { PromocodeType } from "../../src/interface/promocode";

export class AdminListener extends Listener {
  constructor(private readonly module: AdminModule) {
    super();
  }

  @EventHandler.Handler.handle(UserCoinsChangeEvent)
  private async onChangeCoins(@NotNull context: Context, argument: any) {
    const userId: number = parseInt(argument[0]);
    const amount: number = parseInt(argument[1]);
    await this.module.changeCoins(userId, amount);
    await context.reply(
      `Successfully added ${amount} coins to user ${userId}.`
    );
  }

  @EventHandler.Handler.handle(UserRollsChangeEvent)
  private async onChangeRolls(@NotNull context: Context, argument: any) {
    const userId: number = parseInt(argument[0]);
    const amount: number = parseInt(argument[1]);
    await this.module.changeRolls(userId, amount);
    await context.reply(
      `Successfully added ${amount} rolls to user ${userId}.`
    );
  }

  @EventHandler.Handler.handle(UserGemsChangeEvent)
  private async onChangeGems(@NotNull context: Context, argument: any) {
    const userId: number = parseInt(argument[0]);
    const amount: number = parseInt(argument[1]);
    await this.module.changeGems(userId, amount);
    await context.reply(
      `Successfully added ${amount*60} gems to user ${userId}.`
    );
  }

  @EventHandler.Handler.handle(UserMoonsChangeEvent)
  private async onChangeMoons(@NotNull context: Context, argument: any) {
    const userId: number = parseInt(argument[0]);
    const amount: number = parseInt(argument[1]);
    await this.module.changeMoons(userId, amount);
    await context.reply(
      `Successfully added ${amount*60} moons to user ${userId}.`
    );
  }

  @EventHandler.Handler.handle(UserBigGemsChangeEvent)
  private async onChangeBigGems(@NotNull context: Context, argument: any) {
    const userId: number = parseInt(argument[0]);
    const amount: number = parseInt(argument[1]);
    await this.module.changeBigGems(userId, amount);
    await context.reply(
      `Successfully added ${amount*1090} gems to user ${userId}.`
    );
  }

  @EventHandler.Handler.handle(MailingEvent)

  @EventHandler.Handler.handle(PromocodeCreateEvent)
  private async onCreatePromocode(@NotNull context: Context, argument: any) {
    const code: string = argument[0];
    const type: PromocodeType = argument[1] ?? PromocodeType.coins;
    const count: number = parseInt(argument[2]);
    const activations: number = parseInt(argument[3]);
    const expires_at: Date|null = new Date(argument[4]) ?? null;
    const promocode = await this.module.createPromocode(code, type, count, activations, expires_at);
    if(promocode)
      await context.reply(`Successfully create promocode ${promocode}.`);
    else 
      await context.reply(`Failed to create a promo code ${promocode}.`);
  }

}
