import { Context, Markup } from "telegraf";
import { EventHandler } from "../events/eventHandler";
import { Listener } from "../events/listener";
import { AddRollsModule } from "./addrollsModule";
import { AddRollsMenuEvent, CheckChannelSubsEvent } from "./addrollsEvent";
import { NotNull } from "../utils/decorators";
import { Channel } from "../../src/interface/channel";

export class AddRollsListener extends Listener {
  constructor(private readonly module: AddRollsModule) {
    super();
  }

  @EventHandler.Handler.handle(AddRollsMenuEvent)
  private async onAddRollsMenu(@NotNull context: Context, argument: any) {
    const reqChannels: Array<Channel> = await this.module.getRequiredChannels()
    const channelKeyboard = this.module.createChannelsKeyboard(reqChannels)
    context.reply(this.module.getMessage("main"),
    {
      reply_markup: Markup.inlineKeyboard(channelKeyboard).reply_markup
  })
  }

  @EventHandler.Handler.handle(CheckChannelSubsEvent)
  private async onChannelCheck(@NotNull context: Context, argument: any) {
    const channelId = parseInt(argument);
    const reqChannels: Array<Channel> = await this.module.getRequiredChannels()
    const channelKeyboard = this.module.createChannelsKeyboard(reqChannels)
    context.reply(this.module.getMessage("main"),
    {
      reply_markup: Markup.inlineKeyboard(channelKeyboard).reply_markup
  })
  }
}
