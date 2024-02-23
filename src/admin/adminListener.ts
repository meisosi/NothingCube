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
import { Promocode, PromocodeType } from "../../src/interface/promocode";

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

  @EventHandler.Handler.handle(PromocodeCreateEvent)
  private async onCreatePromocode(@NotNull context: Context, argument: any) {
    const code: string = argument[0];
    const type: PromocodeType = argument[1] ?? PromocodeType.coins;
    const activations: number = parseInt(argument[2]);
    const count: number = parseInt(argument[3]);
    const expires_at: string|null = argument[4] ?? null;
    if(this.module.checkPromocode(code) || this.module.foundInactivePromo(code)) {
      await context.reply(`Невозможно созздать \`${code}\`. Такой промокод уже существовал`, {parse_mode: "MarkdownV2"});
    }
    else {
      const promocode: Promocode|null = await this.module.createPromocode(code, type, activations, count, expires_at);
      if(promocode)
        await context.reply(`Создан \`${promocode.code}\``, {parse_mode:"MarkdownV2"});
      else 
        await context.reply(`Ошибка при создании \`${code}\``, {parse_mode: "MarkdownV2"});
    }
  }
  
  @EventHandler.Handler.handle(MailingEvent)
  private async onMailing(@NotNull context: Context, argument: any) {
    const code: string = argument[0];
    const type: PromocodeType = argument[1] ?? PromocodeType.coins;
    const count: number = parseInt(argument[2]);
    const activations: number = parseInt(argument[3]);
    const expires_at: Date|null = new Date(argument[4]) ?? null;
  }

}
