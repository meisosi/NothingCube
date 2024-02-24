import { Bot } from "../../bot";
import { Module } from "../../module";
import { EventHandler } from "../events/eventHandler";
import { ProfileListener } from "./profileListener";
import { StringBuilder } from "../utils/stringBuilder";
import { YAML_PATH_SEPARATOR } from "../utils/yaml";
import { ProfileInventoryEvent, ProfileMenuEvent } from "./profileEvent";
import { NotNull } from "../../src/utils/decorators";
import { Inventory } from "src/interface/inventory";

type ProfileMessages = 'menu' | 'inv_btn' | 'inv' | 'ref_btn';

export class ProfileModule implements Module {
  constructor(private readonly bot: Bot) {}

  init(): void {

    EventHandler.Handler.addListener(new ProfileListener(this));
    this.bot.Telegraf.action('profile_menu', context => {
      ProfileMenuEvent.execute(context, 0)
    });
    this.bot.Telegraf.action('profile_inventory', context => {
      ProfileInventoryEvent.execute(context, 0)
    });
  }

  async getUser(@NotNull userId: number) {
    return await this.bot.Utils.getUser(userId);
  }
  async getStats(@NotNull userId: number) {
    return await this.bot.Utils.getUserStats(userId);
  }
  async getInventory(@NotNull userId: number) : Promise<Inventory> {
    return await this.bot.Utils.getUserInventory(userId);
  }

  getMessage(message: ProfileMessages, ...params: any) : string {
    return StringBuilder.format(
        this.bot.getConfig('messages.yaml').
        get(`profile${YAML_PATH_SEPARATOR}${message}`) as string, ...params
    );
  }
}
