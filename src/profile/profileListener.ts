import { Context, Markup } from "telegraf";
import { EventHandler } from "../events/eventHandler";
import { Listener } from "../events/listener";
import { ProfileModule } from "./profileModule";
import { ProfileInventoryEvent, ProfileMenuEvent } from "./profileEvent";
import { NotNull } from "../utils/decorators";

export class ProfileListener extends Listener {
  constructor(private readonly module: ProfileModule) {
    super();
  }

  @EventHandler.Handler.handle(ProfileMenuEvent)
  private async onProfileMenu(@NotNull context: Context, argument: any) {
    const userId = context.from.id;
    let userStats = await this.module.getStats(userId);
    let userInventory = await this.module.getInventory(userId);
    let userDB = await this.module.getUser(userId);
    const days = Math.floor((new Date().getTime() - new Date(userStats.created_at).getTime()) / (1000 * 60 * 60 * 24));
    context.reply(
      this.module.getMessage("menu", userDB.name, userStats.earend, userStats.rolls, userStats.cases, days, userStats.win, userInventory.gems, userInventory.moons, userInventory.big_gems),
      {
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback(
              this.module.getMessage("inv_btn"),
              `home`
            ),
            Markup.button.callback(
              this.module.getMessage("ref_btn"),
              `referal_menu`
            ),
          ],
        ]).reply_markup
      }
    );
  }

  @EventHandler.Handler.handle(ProfileInventoryEvent)
  private async onInventoryMenu(@NotNull context: Context, argument: any) {
    const userId = context.from.id;
    let userInventory = await this.module.getInventory(userId);
    context.reply(
      this.module.getMessage("inv",userInventory.coins,userInventory.gems,userInventory.moons,userInventory.big_gems, userInventory.friend_coins),
      {
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback(
              this.module.getMessage("inv_btn"),
              `profile_inventory`
            ),
            Markup.button.callback(
              this.module.getMessage("ref_btn"),
              `referal_menu`
            ),
          ],
        ]).reply_markup
      }
    );
  }
}
