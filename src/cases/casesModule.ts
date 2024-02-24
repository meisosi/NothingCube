import { Bot } from "../../bot";
import { Module } from "../../module";
import { EventHandler } from "../events/eventHandler";
import { CaseListener } from "./casesListener";
import { StringBuilder } from "../utils/stringBuilder";
import { User } from "../interface/user";
import { Inventory } from "../interface/inventory";
import { NotNull } from "../../src/utils/decorators";
import { 
  HRCaseEvent, HRCaseOpenEvent,
  HRPremCaseEvent, HRPremCaseOpenEvent, 
  LuckyDropOpenEvent, LuckyDropEvent, 
  LuckyDropPEvent, LuckyDropPOpenEvent,
  NTCaseEvent, NTCaseOpenEvent,
  PepsEvent, PepsOpenEvent,
  FriendOpenEvent, FriendEvent, 
  CaseMenuEvent
} from "./casesEvent";
import { AccessLevel } from "../interface/security";

import { Random } from "../../src/utils/random";
import { YAML_PATH_SEPARATOR } from "../../src/utils/yaml";

type CaseMessages = 'notEnough' | 'open_btn' | 'HRcase' | 'HRlose' | 'HRwin' | 'home_btn' | 'retry_btn' | 'NTwin' | 'HRPwin' | 'HRPcase'
| 'NTcase' | 'LDwin' | 'LDcase' | 'LDPcase' | 'PEPcase' | 'caseMenu' | 'FRcase'
export class CaseModule implements Module {
  constructor(private readonly bot: Bot) {}

  init(): void {
    EventHandler.Handler.addListener(new CaseListener(this));
    this.bot.Telegraf.action("caseHR", async (context) => {
      await this.bot.Utils.initUser(context.from.id, context.from.first_name);
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id),AccessLevel.user))
      HRCaseEvent.execute(context, 0);
    });
    this.bot.Telegraf.action("HRopen", async (context) => {
      await this.bot.Utils.initUser(context.from.id, context.from.first_name);
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id),AccessLevel.user))
      HRCaseOpenEvent.execute(context, 0);
    });
    this.bot.Telegraf.action("caseHRP", async (context) => {
      await this.bot.Utils.initUser(context.from.id, context.from.first_name);
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id),AccessLevel.user))
      HRPremCaseEvent.execute(context, 0);
    });
    this.bot.Telegraf.action("HRPopen", async (context) => {
      await this.bot.Utils.initUser(context.from.id, context.from.first_name);
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id),AccessLevel.user))
      HRPremCaseOpenEvent.execute(context, 0);
    });
    this.bot.Telegraf.action("caseNT", async (context) => {
      await this.bot.Utils.initUser(context.from.id, context.from.first_name);
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id),AccessLevel.user))
      NTCaseEvent.execute(context, 0);
    });
    this.bot.Telegraf.action("NTopen", async (context) => {
      await this.bot.Utils.initUser(context.from.id, context.from.first_name);
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id),AccessLevel.user))
      NTCaseOpenEvent.execute(context, 0);
    });
    this.bot.Telegraf.action("caseLD", async (context) => {
      await this.bot.Utils.initUser(context.from.id, context.from.first_name);
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id),AccessLevel.user))
      LuckyDropEvent.execute(context, 0);
    });
    this.bot.Telegraf.action("LDopen", async (context) => {
      await this.bot.Utils.initUser(context.from.id, context.from.first_name);
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id),AccessLevel.user))
      LuckyDropOpenEvent.execute(context, 0);
    });
    this.bot.Telegraf.action("caseLDP", async (context) => {
      await this.bot.Utils.initUser(context.from.id, context.from.first_name);
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id),AccessLevel.user))
      LuckyDropPEvent.execute(context, 0);
    });
    this.bot.Telegraf.action("LDPopen", async (context) => {
      await this.bot.Utils.initUser(context.from.id, context.from.first_name);
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id),AccessLevel.user))
      LuckyDropPOpenEvent.execute(context, 0);
    });
    this.bot.Telegraf.action("casePEP", async (context) => {
      await this.bot.Utils.initUser(context.from.id, context.from.first_name);
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id),AccessLevel.user))
      PepsEvent.execute(context, 0);
    });
    this.bot.Telegraf.action("PEPopen", async (context) => {
      await this.bot.Utils.initUser(context.from.id, context.from.first_name);
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id),AccessLevel.user))
      PepsOpenEvent.execute(context, 0);
    });
    this.bot.Telegraf.action("caseFR", async (context) => {
      await this.bot.Utils.initUser(context.from.id, context.from.first_name);
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id),AccessLevel.user))
      FriendEvent.execute(context, 0);
    });
    this.bot.Telegraf.action("FRopen", async (context) => {
      await this.bot.Utils.initUser(context.from.id, context.from.first_name);
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id),AccessLevel.user))
      FriendOpenEvent.execute(context, 0);
    });
  }

  async getInventory(@NotNull userId: number) : Promise<Inventory> {
    return await this.bot.Utils.getUserInventory(userId);
  }

  async updateUserInventory(@NotNull userId: number, type: keyof Omit<Inventory, 'user_id'>,value: number) {
      return await this.bot.Utils.updateUserInventory(userId, type, value);
  }

  getResult(min: number, max:number): number {
    return Random.getRandom(min, max);
  }
  getMessage(message: CaseMessages, ...params: any) : string {
    return StringBuilder.format(
        this.bot.getConfig('messages.yaml').
        get(`case${YAML_PATH_SEPARATOR}${message}`) as string, ...params
    );
  }
}
