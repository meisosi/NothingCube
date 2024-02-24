import { Context, Markup } from "telegraf";
import { EventHandler } from "../events/eventHandler";
import { Listener } from "../events/listener";
import { CaseModule } from "./casesModule";
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
import { NotNull } from "../utils/decorators";

enum Cost {
  HR = 100,
  HRP = 1000,
  NT = 10,
  PEP = 300,
  LD = 6000,
  FR = 10,
  LDP = 20000
}

export class CaseListener extends Listener {
  constructor(private readonly module: CaseModule) {
    super();
  }

  @EventHandler.Handler.handle(CaseMenuEvent)
  private async onMenu(@NotNull context: Context, argument: any) {
    return context.reply(this.module.getMessage("caseMenu"), {
      reply_markup: Markup.inlineKeyboard([
        [
          Markup.button.callback(this.module.getMessage('open_btn'), `caseHR`),
          Markup.button.callback(this.module.getMessage('home_btn'), `caseHRP`),
          Markup.button.callback(this.module.getMessage('open_btn'), `caseNT`),
        ],
        [
          Markup.button.callback(this.module.getMessage('open_btn'), `caseHR`),
          Markup.button.callback(this.module.getMessage('home_btn'), `caseHRP`),
          Markup.button.callback(this.module.getMessage('open_btn'), `caseNT`),
        ],
      ]).reply_markup
    })
  }

  @EventHandler.Handler.handle(HRCaseEvent)
  private async onHRMenu(@NotNull context: Context, argument: any) {
    return context.reply(this.module.getMessage("HRcase"), {
      reply_markup: Markup.inlineKeyboard([
        [
          Markup.button.callback(this.module.getMessage('open_btn'), `HRopen`),
          Markup.button.callback(this.module.getMessage('home_btn'), `home`)
        ]
      ]).reply_markup
    })
  }
  @EventHandler.Handler.handle(HRCaseOpenEvent)
  private async onHROpen(@NotNull context: Context, argument: any) {
    const userId = context.from.id;
    let userInventory = await this.module.getInventory(userId);
    if(userInventory.coins < Cost.HR) {
      return context.reply(this.module.getMessage("notEnough"),{
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback(this.module.getMessage('home_btn'), `home`)
          ]
        ]).reply_markup
      })
    }
    const value = this.module.getResult(0, 300) 
    userInventory.coins = userInventory.coins - Cost.HR;
    this.module.updateUserInventory(userId, 'coins', userInventory.coins)
    if(value == 0) {
      userInventory.moons = userInventory.moons + 1;
      this.module.updateUserInventory(userId, 'moons', userInventory.moons)
      return context.reply(this.module.getMessage("HRwin"),{
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback(this.module.getMessage('retry_btn'), `HRopen`),
            Markup.button.callback(this.module.getMessage('home_btn'), `home`)
          ]
        ]).reply_markup
      })
    }
    else {
      return context.reply(this.module.getMessage("HRlose"),{
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback(this.module.getMessage('retry_btn'), `HRopen`),
            Markup.button.callback(this.module.getMessage('home_btn'), `home`)
          ]
        ]).reply_markup
      })
    }
  }

  @EventHandler.Handler.handle(HRPremCaseEvent)
  private async onHRPremMenu(@NotNull context: Context, argument: any) {
    return context.reply(this.module.getMessage("HRPcase"), {
      reply_markup: Markup.inlineKeyboard([
        [
          Markup.button.callback(this.module.getMessage('open_btn'), `HRPopen`),
          Markup.button.callback(this.module.getMessage('home_btn'), `home`)
        ]
      ]).reply_markup
    })
  }
  @EventHandler.Handler.handle(HRPremCaseOpenEvent)
  private async onHRPremOpen(@NotNull context: Context, argument: any) {
    const userId = context.from.id;
    let userInventory = await this.module.getInventory(userId);
    if(userInventory.coins < Cost.HRP) {
      return context.reply(this.module.getMessage("notEnough"),{
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback(this.module.getMessage('home_btn'), `home`)
          ]
        ]).reply_markup
      })
    }
    const value = this.module.getResult(0, 300);
    userInventory.coins = userInventory.coins - Cost.HRP;
    this.module.updateUserInventory(userId, 'coins', userInventory.coins)
    if(value == 0) {
      userInventory.big_gems = userInventory.big_gems + 1;
      this.module.updateUserInventory(userId, 'big_gems', userInventory.big_gems)
      return context.reply(this.module.getMessage("HRPwin"),{
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback(this.module.getMessage('retry_btn'), `HRPopen`),
            Markup.button.callback(this.module.getMessage('home_btn'), `home`)
          ]
        ]).reply_markup
      })
    }
    else {
      return context.reply(this.module.getMessage("HRlose"),{
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback(this.module.getMessage('retry_btn'), `HRopen`),
            Markup.button.callback(this.module.getMessage('home_btn'), `home`)
          ]
        ]).reply_markup
      })
    }
  }

  @EventHandler.Handler.handle(NTCaseEvent)
  private async onNTMenu(@NotNull context: Context, argument: any) {
    return context.reply(this.module.getMessage("NTcase"), {
      reply_markup: Markup.inlineKeyboard([
        [
          Markup.button.callback(this.module.getMessage('open_btn'), `NTopen`),
          Markup.button.callback(this.module.getMessage('home_btn'), `home`)
        ]
      ]).reply_markup
    })
  }
  @EventHandler.Handler.handle(NTCaseOpenEvent)
  private async onNTOpen(@NotNull context: Context, argument: any) {
    const userId = context.from.id;
    let userInventory = await this.module.getInventory(userId);
    if(userInventory.coins < Cost.NT) {
      return context.reply(this.module.getMessage("notEnough"),{
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback(this.module.getMessage('home_btn'), `home`)
          ]
        ]).reply_markup
      })
    }
    const value = this.module.getResult(0, 300);
    userInventory.coins = userInventory.coins - Cost.NT;
    this.module.updateUserInventory(userId, 'coins', userInventory.coins)
    if(value == 0) {
      userInventory.coins = userInventory.coins + 1000;
      this.module.updateUserInventory(userId, 'coins', userInventory.coins)
      return context.reply(this.module.getMessage("NTwin"),{
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback(this.module.getMessage('retry_btn'), `NTopen`),
            Markup.button.callback(this.module.getMessage('home_btn'), `home`)
          ]
        ]).reply_markup
      })
    }
    else {
      return context.reply(this.module.getMessage("HRlose"),{
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback(this.module.getMessage('retry_btn'), `HRopen`),
            Markup.button.callback(this.module.getMessage('home_btn'), `home`)
          ]
        ]).reply_markup
      })
    }
  }
  @EventHandler.Handler.handle(LuckyDropEvent)
  private async onLDMenu(@NotNull context: Context, argument: any) {
    return context.reply(this.module.getMessage("LDcase"), {
      reply_markup: Markup.inlineKeyboard([
        [
          Markup.button.callback(this.module.getMessage('open_btn'), `LDopen`),
          Markup.button.callback(this.module.getMessage('home_btn'), `home`)
        ]
      ]).reply_markup
    })
  }
  @EventHandler.Handler.handle(LuckyDropOpenEvent)
  private async onLDOpen(@NotNull context: Context, argument: any) {
    const userId = context.from.id;
    let userInventory = await this.module.getInventory(userId);
    if(userInventory.coins < Cost.LD) {
      return context.reply(this.module.getMessage("notEnough"),{
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback(this.module.getMessage('home_btn'), `home`)
          ]
        ]).reply_markup
      })
    }
    const dice = await context.replyWithDice();
    const value = dice.dice.value;
    userInventory.coins = userInventory.coins - Cost.LD;
    this.module.updateUserInventory(userId, 'coins', userInventory.coins)
    switch (value) {
      case 1:
        userInventory.gems = userInventory.gems + 1;
        await this.module.updateUserInventory(userId, "gems", userInventory.gems);
        break;
      case 2:
        userInventory.gems = userInventory.gems + 2;
        await this.module.updateUserInventory(userId, "gems", userInventory.gems);
        break;
      case 3:
        userInventory.gems = userInventory.gems + 3;
        await this.module.updateUserInventory(userId, "gems", userInventory.gems);
        break;
      case 4:
        userInventory.gems = userInventory.gems + 4;
        await this.module.updateUserInventory(userId, "gems", userInventory.gems);
        break;
      case 5:
        userInventory.moons = userInventory.moons + 1;
        await this.module.updateUserInventory(userId, "moons", userInventory.moons);
        return;
      case 6:
        userInventory.gems = userInventory.gems + 1;
        await this.module.updateUserInventory(userId, "gems", userInventory.gems);
        userInventory.moons = userInventory.moons + 1;
        await this.module.updateUserInventory(userId, "moons", userInventory.moons);
        break;
      default:  
    }
    return context.reply(this.module.getMessage("LDwin"),{
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback(this.module.getMessage('retry_btn'), `LDopen`),
            Markup.button.callback(this.module.getMessage('home_btn'), `home`)
          ]
        ]).reply_markup
      })
  }
  @EventHandler.Handler.handle(LuckyDropPEvent)
  private async onLDPMenu(@NotNull context: Context, argument: any) {
    return context.reply(this.module.getMessage("LDPcase"), {
      reply_markup: Markup.inlineKeyboard([
        [
          Markup.button.callback(this.module.getMessage('open_btn'), `LDopen`),
          Markup.button.callback(this.module.getMessage('home_btn'), `home`)
        ]
      ]).reply_markup
    })
  }
  @EventHandler.Handler.handle(LuckyDropPOpenEvent)
  private async onLDPOpen(@NotNull context: Context, argument: any) {
    const userId = context.from.id;
    let userInventory = await this.module.getInventory(userId);
    if(userInventory.coins < Cost.LDP) {
      return context.reply(this.module.getMessage("notEnough"),{
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback(this.module.getMessage('home_btn'), `home`)
          ]
        ]).reply_markup
      })
    }
    const dice = await context.replyWithDice();
    const value = dice.dice.value;
    userInventory.coins = userInventory.coins - Cost.LDP;
    this.module.updateUserInventory(userId, 'coins', userInventory.coins)
    switch (value) {
      case 1:
        userInventory.gems = userInventory.gems + 1;
        await this.module.updateUserInventory(userId, "gems", userInventory.gems);
        break;
      case 2:
        userInventory.gems = userInventory.gems + 3;
        await this.module.updateUserInventory(userId, "gems", userInventory.gems);
        break;
      case 3:
        userInventory.moons = userInventory.moons + 1;
        await this.module.updateUserInventory(userId, "moons", userInventory.moons);
        break;
      case 4:
        userInventory.gems = userInventory.gems + 2;
        await this.module.updateUserInventory(userId, "gems", userInventory.gems);
        userInventory.moons = userInventory.moons + 1;
        await this.module.updateUserInventory(userId, "moons", userInventory.moons);
        break;
      case 5:
        userInventory.moons = userInventory.moons + 2;
        await this.module.updateUserInventory(userId, "moons", userInventory.moons);
        return;
      case 6:
        userInventory.big_gems = userInventory.big_gems + 1;
        await this.module.updateUserInventory(userId, "big_gems", userInventory.big_gems);
        break;
      default:  
    }
    return context.reply(this.module.getMessage("LDwin"),{
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback(this.module.getMessage('retry_btn'), `LDPopen`),
            Markup.button.callback(this.module.getMessage('home_btn'), `home`)
          ]
        ]).reply_markup
      })
  }
  @EventHandler.Handler.handle(PepsEvent)
  private async onPepsMenu(@NotNull context: Context, argument: any) {
    return context.reply(this.module.getMessage("PEPcase"), {
      reply_markup: Markup.inlineKeyboard([
        [
          Markup.button.callback(this.module.getMessage('open_btn'), `LDopen`),
          Markup.button.callback(this.module.getMessage('home_btn'), `home`)
        ]
      ]).reply_markup
    })
  }
  @EventHandler.Handler.handle(PepsOpenEvent)
  private async onPepsOpen(@NotNull context: Context, argument: any) {
    const userId = context.from.id;
    let userInventory = await this.module.getInventory(userId);
    if(userInventory.coins < Cost.PEP) {
      return context.reply(this.module.getMessage("notEnough"),{
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback(this.module.getMessage('home_btn'), `home`)
          ]
        ]).reply_markup
      })
    }
    const dice = await context.replyWithDice();
    const value = dice.dice.value;
    userInventory.coins = userInventory.coins - Cost.PEP;
    this.module.updateUserInventory(userId, 'coins', userInventory.coins)
    switch (value) {
      case 1:
        userInventory.coins = userInventory.coins + 5;
        await this.module.updateUserInventory(userId, "coins", userInventory.coins);
        break;
      case 2:
        userInventory.coins = userInventory.coins + 25;
        await this.module.updateUserInventory(userId, "coins", userInventory.coins);
        break;
      case 3:
        userInventory.coins = userInventory.coins + 50;
        await this.module.updateUserInventory(userId, "coins", userInventory.coins);
        break;
      case 4:
        userInventory.coins = userInventory.coins + 75;
        await this.module.updateUserInventory(userId, "coins", userInventory.coins);
        break;
      case 5:
        userInventory.coins = userInventory.coins + 100;
        await this.module.updateUserInventory(userId, "coins", userInventory.coins);
      case 6:
        userInventory.gems = userInventory.gems + 1;
        await this.module.updateUserInventory(userId, "gems", userInventory.gems);
        break;
      default:  
    }
    return context.reply(this.module.getMessage("LDwin"),{
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback(this.module.getMessage('retry_btn'), `LDPopen`),
            Markup.button.callback(this.module.getMessage('home_btn'), `home`)
          ]
        ]).reply_markup
      })
  }

  @EventHandler.Handler.handle(FriendEvent)
  private async onFriendMenu(@NotNull context: Context, argument: any) {
    return context.reply(this.module.getMessage("FRcase"), {
      reply_markup: Markup.inlineKeyboard([
        [
          Markup.button.callback(this.module.getMessage('open_btn'), `FRopen`),
          Markup.button.callback(this.module.getMessage('home_btn'), `home`)
        ]
      ]).reply_markup
    })
  }
  @EventHandler.Handler.handle(FriendOpenEvent)
  private async onFriendOpen(@NotNull context: Context, argument: any) {
    const userId = context.from.id;
    let userInventory = await this.module.getInventory(userId);
    if(userInventory.friend_coins < Cost.FR) {
      return context.reply(this.module.getMessage("notEnough"),{
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback(this.module.getMessage('home_btn'), `home`)
          ]
        ]).reply_markup
      })
    }
    const dice = await context.replyWithDice();
    const value = dice.dice.value;
    userInventory.friend_coins = userInventory.friend_coins - Cost.FR;
    this.module.updateUserInventory(userId, 'friend_coins', userInventory.friend_coins)
    switch (value) {
      case 1:
        userInventory.coins = userInventory.coins + 10;
        await this.module.updateUserInventory(userId, "coins", userInventory.coins);
        break;
      case 2:
        userInventory.coins = userInventory.coins + 30;
        await this.module.updateUserInventory(userId, "coins", userInventory.coins);
        break;
      case 3:
        userInventory.coins = userInventory.coins + 100;
        await this.module.updateUserInventory(userId, "coins", userInventory.coins);
        break;
      case 4:
        userInventory.coins = userInventory.coins + 200;
        await this.module.updateUserInventory(userId, "coins", userInventory.coins);
        break;
      case 5:
        userInventory.coins = userInventory.coins + 500;
        await this.module.updateUserInventory(userId, "coins", userInventory.coins);
      case 6:
        userInventory.coins = userInventory.coins + 1000;
        await this.module.updateUserInventory(userId, "coins", userInventory.coins);
        break;
      default:  
    }
    return context.reply(this.module.getMessage("LDwin"),{
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback(this.module.getMessage('retry_btn'), `FRopen`),
            Markup.button.callback(this.module.getMessage('home_btn'), `home`)
          ]
        ]).reply_markup
      })
  }
}
