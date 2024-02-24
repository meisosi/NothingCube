import { Context, Markup } from "telegraf";
import { EventHandler } from "../events/eventHandler";
import { Listener } from "../events/listener";
import { ReferalModule } from "./referalModule";
import { CreateReferalLinkEvent, NewReferalEvent, ReferalEvent } from "./referalEvent";
import { NotNull } from "../utils/decorators";

export class ReferalListener extends Listener {
  constructor(private readonly module: ReferalModule) {
    super();
  }

  @EventHandler.Handler.handle(CreateReferalLinkEvent)
  private async onLinkCreate(@NotNull context: Context, argument: any) {
    const userId: number = context.from.id;
    await this.module.createReferalLink(userId);
    const refLink = "https://t.me/nothing_cube_game_bot?start=ref_" + userId;
    return context.sendMessage(this.module.getMessage('createRefLink', refLink))
  }

  @EventHandler.Handler.handle(ReferalEvent)
  private async onReferal(@NotNull context: Context, argument: any) {
    const userId: number = context.from.id;
    const refs = await this.module.getReferal(userId)
    if(refs) {
      if(refs.referals) {
        let refTxt: string = "";
        const page: number = parseInt(argument) || 1;
        const itemsPerPage = 15;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        for (let i = startIndex; i < Math.min(endIndex, refs.referals.length); i++) {
            const ref = refs.referals[i];
            const user = await this.module.getUser(ref);
            refTxt += user.name + '\n';
        }
        return context.sendMessage(this.module.getMessage('myRefs', refTxt))
      }
      else {
        return context.sendMessage(this.module.getMessage('noRefs'))
      }
    }
    else {
      return context.sendMessage(this.module.getMessage('noRefLink'), 
      {
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback(
              this.module.getMessage("newLink_btn"),
              `referal_linkCreate`
            )
          ],
        ]).reply_markup
      })
    }
  }

  @EventHandler.Handler.handle(NewReferalEvent)
  private async onNewReferal(@NotNull context: Context, argument: any) {
    const userId: number = context.from.id; 
    const username = context.from.first_name;
    let userInventory = await this.module.getInventory(userId);
    let userStat = await this.module.getStats(userId);
    const createDate = new Date(userStat.created_at);
    if(((new Date().getTime() - createDate.getTime())/(1000*60) < 30) && !userStat.referalId) {
      let referal: string = argument;
      if(referal.startsWith('-')) {
        const adId: number = parseInt(referal);
        this.module.addAdViews(referal);
        this.module.linkReferal(userId, adId);
        context.sendMessage(this.module.getMessage("sucsessRef"));
        userInventory.coins = userInventory.coins + 100;
      }
      else {
        const referalId: number = parseInt(referal);
        const userReferal = await this.module.getReferal(referalId);
        if(userReferal) {
          this.module.addReferal(userId, referalId);
          this.module.linkReferal(userId, referalId);
          context.sendMessage(this.module.getMessage("sucsessRef"));
          userInventory.coins = userInventory.coins + 100;
          await this.module.updateUserInventory(userId, 'coins',  userInventory.coins)
          const refInventory = await this.module.getInventory(referalId);
          refInventory.rolls = refInventory.rolls + 1;
          refInventory.friend_coins = refInventory.friend_coins + 1;
          await this.module.updateUserInventory(referalId, 'rolls',  refInventory.rolls)
          await this.module.updateUserInventory(referalId, 'friend_coins',  refInventory.friend_coins)
          context.telegram.sendMessage(referalId, this.module.getMessage("newRef", username))
        }
      }
    }
  }
}
