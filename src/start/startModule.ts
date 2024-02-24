import { Bot } from "../../bot";
import { Module } from "../../module";
import { EventHandler } from "../events/eventHandler";
import { StartListener } from "./startListener";
import { StringBuilder } from "../utils/stringBuilder";
import { NotNull } from "../../src/utils/decorators";
import { StartEvent} from "./startEvent";
import { AccessLevel } from "../interface/security";
import { YAML_PATH_SEPARATOR } from "../../src/utils/yaml";
import { Inventory } from "../../src/interface/inventory";

type StrartMessages = 'sucsessRef' | 'newRef' | 'startUser' | 'noActivations' | 'used' 
| 'profile_btn' | 'mini_games_btn' | 'withdraw_btn' | 'faq_btn' | 'addroll_btn' | 'shopGD_btn' | 'subscribe_btn';

export class StartModule implements Module {
  constructor(private readonly bot: Bot) {}

  init(): void {

    EventHandler.Handler.addListener(new StartListener(this));
    this.bot.Telegraf.command("start", async (context) => {
      await this.bot.Utils.initUser(context.from.id, context.from.first_name);
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id),AccessLevel.user))
        StartEvent.execute(context, context.args[0]);
    });
    this.bot.Telegraf.action('home', async context => {
      await this.bot.Utils.initUser(context.from.id, context.from.first_name);
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id),AccessLevel.user))
        StartEvent.execute(context, 0)
    });
  }

  async getUser(@NotNull userId: number) {
    return await this.bot.Utils.getUser(userId);
  }
  async createUser(@NotNull userId: number, @NotNull name: string) {
    return await this.bot.Utils.createUser(userId, name, 0, -1, -1);
  }

  async getInventory(@NotNull userId: number) : Promise<Inventory> {
    return await this.bot.Utils.getUserInventory(userId);
  }
  async updateUserInventory(@NotNull userId: number, type: keyof Omit<Inventory, 'user_id'>, value: number) {
    return await this.bot.Utils.updateUserInventory(userId, type, value);
  }
  async createInventory(@NotNull userId: number) {
    return await this.bot.Utils.createUserInventory(userId);
  }

  async getStats(@NotNull userId: number) {
    return await this.bot.Utils.getUserStats(userId);
  }
  async createStats(@NotNull userId: number) {
    return await this.bot.Utils.createUserStats(userId);
  }

  async getReferal(@NotNull userId: number) {
    return await this.bot.Utils.getReferal(userId);
  }
  async addReferal(@NotNull userId: number, @NotNull referalId: number) {
    return this.bot.Utils.addReferal(userId, referalId);
  }

  async addAdViews(@NotNull adcode: string) {
    return this.bot.Utils.addAdViews(adcode);
  }
  
  getMessage(message: StrartMessages, ...params: any) : string {
    return StringBuilder.format(
        this.bot.getConfig('messages.yaml').
        get(`start${YAML_PATH_SEPARATOR}${message}`) as string, ...params
    );
  }

  getAccessLevel(status: string) {
    return this.bot.Utils.getAccessLevel(status)
  }
}
