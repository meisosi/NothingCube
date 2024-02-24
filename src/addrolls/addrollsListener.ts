import { Context, Markup } from "telegraf";
import { EventHandler } from "../events/eventHandler";
import { Listener } from "../events/listener";
import { AddRollsModule } from "./addrollsModule";
import { AddRollsMenuEvent, CheckChannelSubsEvent, CollcetRollsEvent } from "./addrollsEvent";
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
    return context.reply(this.module.getMessage("main"),
    {
      reply_markup: Markup.inlineKeyboard(channelKeyboard).reply_markup
  })
  }

  @EventHandler.Handler.handle(CheckChannelSubsEvent)
  private async onChannelCheck(@NotNull context: Context, argument: any) {
    const userId = context.from.id;
    const channelId = parseInt(argument);
    if(await this.module.checkSubscribe(userId, channelId)) {
      return context.answerCbQuery(this.module.getMessage("allreadySub"))
    }
    else {
      const channel = await this.module.getChannel(channelId);
      return context.reply(this.module.getMessage("subsReqwest", channel.name), {
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.url(
              this.module.getMessage("sub_btn"),
              channel.link
            )
          ],
        ]).reply_markup
      })
    }
  }

  @EventHandler.Handler.handle(CollcetRollsEvent)
  private async onRollsCollect(@NotNull context: Context, argument: any) {
    const userId = context.from.id;
    let nowSubs = await this.module.getUserSubscriptions(userId);
    let reqChannels = await this.module.getRequiredChannels();
    if(nowSubs) {
      if(nowSubs.channels)
        if(reqChannels.length <= nowSubs.channels.length) {
          return context.reply(this.module.getMessage("allCollected"))
        }
    }
    else {
      await this.module.createUserSubscriptions(userId)
    }
    const userSubs = await this.module.refreshUserSubscriptionChannels(userId, nowSubs, reqChannels)
    if(userSubs == 0) {
      return context.reply(this.module.getMessage("noSubs"))
    }
    else {
      await this.module.changeRolls(userId, userSubs)
      return context.reply(this.module.getMessage("sucsess", userSubs), {
        reply_markup: Markup.inlineKeyboard([
        [
          Markup.button.callback(this.module.getMessage("home_btn"),`home`)
        ],
      ]).reply_markup})
    }
  }
}
