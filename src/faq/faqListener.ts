import { Context, Markup } from "telegraf";
import { EventHandler } from "../events/eventHandler";
import { Listener } from "../events/listener";
import { FAQModule } from "./faqModule";
import { 
  FAQCasesEvent,
  FAQGlobalEvent, FAQMiniGamesEvent, FAQOnlineEvent, FAQRefEvent, 
} from "./faqEvent";
import { NotNull } from "../utils/decorators";

export class FAQListener extends Listener {
  constructor(private readonly module: FAQModule) {
    super();
  }

  @EventHandler.Handler.handle(FAQGlobalEvent)
  private async onFAQGlobal(@NotNull context: Context, argument: any) {
    context.reply(this.module.getMessage("global"),
      {
          reply_markup: Markup.inlineKeyboard([
            [
              Markup.button.callback(this.module.getMessage('mini_games_btn'), `faq_mini_games`),
              Markup.button.callback(this.module.getMessage('ref_btn'), `faq_ref`)
            ]
        ]).reply_markup,
          parse_mode: 'MarkdownV2'
      })
  }

  @EventHandler.Handler.handle(FAQMiniGamesEvent)
  private async onFAQMiniGames(@NotNull context: Context, argument: any) {
    context.reply(this.module.getMessage("mini_games"),
      {
          reply_markup: Markup.inlineKeyboard([
            [
              Markup.button.callback(this.module.getMessage('cases_btn'), `faq_cases`),
              Markup.button.callback(this.module.getMessage('online_btn'), `faq_online`)
            ]
        ]).reply_markup,
          parse_mode: 'MarkdownV2'
      })
  }

  @EventHandler.Handler.handle(FAQRefEvent)
  private async onFAQRef(@NotNull context: Context, argument: any) {
    context.reply(this.module.getMessage("ref"),
      {
          parse_mode: 'MarkdownV2'
      })
  }

  @EventHandler.Handler.handle(FAQOnlineEvent)
  private async onFAQOnline(@NotNull context: Context, argument: any) {
    context.reply(this.module.getMessage("online"),
      {
          parse_mode: 'MarkdownV2'
      })
  }

  @EventHandler.Handler.handle(FAQCasesEvent)
  private async onFAQCases(@NotNull context: Context, argument: any) {
    context.reply(this.module.getMessage("cases"),
      {
          parse_mode: 'MarkdownV2'
      })
  }
}
