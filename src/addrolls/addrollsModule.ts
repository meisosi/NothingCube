import { Bot } from "../../bot";
import { Module } from "../../module";
import { EventHandler } from "../events/eventHandler";
import { AddRollsListener } from "./addrollsListener";
import { StringBuilder } from "../utils/stringBuilder";
import { YAML_PATH_SEPARATOR } from "../utils/yaml";
import { AddRollsMenuEvent, CheckChannelSubsEvent } from "./addrollsEvent";
import { Channel } from "../../src/interface/channel";
import { Markup } from "telegraf";

type AddRollsMessages = 'sucsess' | 'no_subs' | 'collected' | 'main';

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
  }

  async getRequiredChannels() {
    return this.bot.Utils.getRequiredChannels();
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
    return keyboard;
  }

  async refreshUserSubscriptionChannels(userId: number) {
    const currentSubscriptions = await this.bot.Utils.getUserSubscriptions(userId);

    if (currentSubscriptions === null) {
        throw new Error('Failed to fetch user subscriptions.');
    }

    const reqChannelsIds = await this.getRequiredChannels()
        .then(channels => channels.map(channel => channel.id));

    const newChannels = await this.updateSubscriptions(userId, currentSubscriptions.сhannals, reqChannelsIds);

    if (newChannels.length > 0) {
        await this.bot.Utils.setUserSubscriptions(userId, newChannels);
        return newChannels.length;
    } else {
        return 0;
    }
  }
  async updateSubscriptions(userId: number, currentChannels: number[], reqChannels: number[]): Promise<number[]> {
    const newChannels: number[] = [];

    for (const channelId of reqChannels) {
        if (!currentChannels.includes(channelId) && await this.checkSubscribe(userId, channelId)) {
            newChannels.push(channelId);
        }
    }

    return newChannels;
  }

  async checkSubscribe(userId: number, channelId: number): Promise<boolean> {
      const chatMember = await this.bot.Telegraf.telegram.getChatMember(channelId, userId);
      return ['member', 'administrator', 'creator'].includes(chatMember.status);
  }
  

  getMessage(message: AddRollsMessages, ...params: any) : string {
    return StringBuilder.format(
        this.bot.getConfig('messages.yaml').
        get(`addrolls${YAML_PATH_SEPARATOR}${message}`) as string, ...params
    );
  }
}
