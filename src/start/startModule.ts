import { Bot } from "../../bot";
import { Module } from "../../module";
import { EventHandler } from "../events/eventHandler";
import { StartListener } from "./startListener";
import { StringBuilder } from "../utils/stringBuilder";
import { NotNull } from "../../src/utils/decorators";
import { StartEvent} from "./startEvent";
import { AccessLevel } from "../interface/security";

export class StartModule implements Module {
  constructor(private readonly bot: Bot) {}

  init(): void {

    EventHandler.Handler.addListener(new StartListener(this));
    this.bot.Telegraf.command("start", async (context) => {
      if (this.bot.Utils.checkAccess(await this.bot.Utils.getUserStatus(context.from.id),AccessLevel.user))
        StartEvent.execute(context, context.args[0]);
    });
  }
}
