import { Bot } from "../../bot";
import { Module } from "../../module";
import { EventHandler } from "../events/eventHandler";
import { AddRollsListener } from "./addrollsListener";
import { StringBuilder } from "../utils/stringBuilder";
import { YAML_PATH_SEPARATOR } from "../utils/yaml";
import { AddRollsMenuEvent, CheckChannelSubsEvent, CollcetRollsEvent } from "./addrollsEvent";
import { Channel } from "../../src/interface/channel";
import { Markup } from "telegraf";
import { Inventory } from "src/interface/inventory";

type AddRollsMessages = 'sucsess' | 'noSubs' | 'allCollected' | 'main' | 'sub_btn' | 
'allreadySub' | 'subsReqwest' | 'collect_btn' | 'home';

export class AddRollsModule implements Module {
  constructor(private readonly bot: Bot) {}

  init(): void {

    EventHandler.Handler.addListener(new AddRollsListener(this));
    this.bot.Telegraf.action('addrolls', context => {
      AddRollsMenuEvent.execute(context, 0)
    });
    this.bot.Telegraf.action(/^__addroll(.+)$/, context => {
      CheckChannelSubsEvent.execute(context, context.match[1])
    });
    this.bot.Telegraf.action('collcetRolls', context => {
      CollcetRollsEvent.execute(context, 0)
    });

  }


  async changeRolls(userId: number, amount: number): Promise<void> {
    const userInventory: Inventory = await this.bot.Utils.getUserInventory(userId);
    if (userInventory) {
      const updatedRolls: number = userInventory.rolls + amount;
      await this.bot.Utils.updateUserRolls(userId, updatedRolls);
    } else {
      throw new Error(`User with ID ${userId} not found.`);
    }
  }

  async getRequiredChannels() {
    return await this.bot.Utils.getRequiredChannels();
  }
  async createUserSubscriptions(userId: number) {
    return await this.bot.Utils.createUserSubscriptions(userId);
  }

  createChannelsKeyboard(channels: Array<Channel>) {
    const keyboard = [];
    for (let i = 0; i < channels.length; i += 2) {
      const pair = [];

      for (let j = i; j < i + 2 && j < channels.length; j++) {
        pair.push(
          Markup.button.callback(channels[j].name, `__addroll${channels[j].id}`)
        );
      }
    keyboard.push(pair);
    }
    keyboard.push([
      Markup.button.callback(this.getMessage('collect_btn'), `collcetRolls`),
      Markup.button.callback(this.getMessage('home'), `home`)
    ])
    return keyboard;
  }

  async refreshUserSubscriptionChannels(userId: number) {
    let currentSubscriptions = await this.getUserSubscriptions(userId);
    if(!currentSubscriptions.channels) {
      currentSubscriptions.channels = []
    }
    
    const reqChannelsIds = await this.getRequiredChannels().then(channels => channels.map(channel => channel.id));

    const newChannels = await this.updateSubscriptions(userId, currentSubscriptions.channels, reqChannelsIds);
    let updateChannels = currentSubscriptions.channels.concat(newChannels);
    updateChannels = [...new Set(updateChannels)];
    if(!currentSubscriptions.channels && !newChannels) {
      return 0;
    }

    if (updateChannels.length > 0) {
        await this.bot.Utils.setUserSubscriptions(userId, updateChannels);
        return newChannels.length;
    } else {
        return 0;
    }
  }
  async getUserSubscriptions(userId: number) {
    return await this.bot.Utils.getUserSubscriptions(userId);
  }
  async updateSubscriptions(userId: number, currentChannels: number[], reqChannels: number[]): Promise<number[]> {
    const newChannels: number[] = [];
    if(!currentChannels) {
      currentChannels = [];
    }
    for (const channelId of reqChannels) {
        if (!currentChannels.includes(channelId) && await this.checkSubscribe(userId, channelId)) {
            newChannels.push(channelId);
        }
    }

    return newChannels;
  }

  async checkSubscribe(userId: number, channelId: number): Promise<boolean> {
    const timeoutPromise = new Promise<boolean>((resolve) => {
        setTimeout(() => resolve(false), 3000); 
    });

    const chatMemberPromise = this.bot.Telegraf.telegram.getChatMember(channelId, userId)
        .then((chatMember) => ['member', 'administrator', 'creator'].includes(chatMember.status))
        .catch((error) => {
            return false;
        });

    return Promise.race([chatMemberPromise, timeoutPromise]);
}
  async getChannel(channelId: number) {
    return await this.bot.Utils.getChannel(channelId);
  }
  

  getMessage(message: AddRollsMessages, ...params: any) : string {
    return StringBuilder.format(
        this.bot.getConfig('messages.yaml').
        get(`addrolls${YAML_PATH_SEPARATOR}${message}`) as string, ...params
    );
  }
}
