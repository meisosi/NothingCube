import { Bot } from "../../bot";
import { Module } from "../../module";
import { EventHandler } from "../events/eventHandler";
import { FAQListener } from "./faqListener";
import { StringBuilder } from "../utils/stringBuilder";
import { YAML_PATH_SEPARATOR } from "../../src/utils/yaml";
import { 
  FAQCasesEvent,
  FAQGlobalEvent, FAQMiniGamesEvent, FAQOnlineEvent, FAQRefEvent, 
} from "./faqEvent";

type FAQMessages = 'global' | 'mini_games' | 'cases' | 'online' | 'ref' | 'mini_games_btn' | 'ref_btn' | 'cases_btn' | 'online_btn';

export class FAQModule implements Module {
  constructor(private readonly bot: Bot) {}

  init(): void {

    EventHandler.Handler.addListener(new FAQListener(this));
    this.bot.Telegraf.action('faq_global', context => {
      FAQGlobalEvent.execute(context, 0)
    });
    this.bot.Telegraf.action('faq_mini_games', context => {
      FAQMiniGamesEvent.execute(context, 0)
    });
    this.bot.Telegraf.action('faq_ref', context => {
      FAQRefEvent.execute(context, 0)
    });
    this.bot.Telegraf.action('faq_cases', context => {
      FAQCasesEvent.execute(context, 0)
    });
    this.bot.Telegraf.action('faq_online', context => {
      FAQOnlineEvent.execute(context, 0)
    });
  }

  getMessage(message: FAQMessages, ...params: any) : string {
    return StringBuilder.format(
        this.bot.getConfig('messages.yaml').
        get(`faq${YAML_PATH_SEPARATOR}${message}`) as string, ...params
    );
  }
}
