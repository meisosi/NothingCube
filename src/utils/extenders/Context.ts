import { ExtraEditMessageText } from "node_modules/telegraf/typings/telegram-types";
import * as tg from "node_modules/telegraf/typings/core/types/typegram";
import { Context } from "telegraf";
import { FmtString } from "telegraf/format";

/**
 * Расширение для метода editMessageText. Добавляет проверку сообщения на изменение перед отправкой метода
 * @see https://core.telegram.org/bots/api#editmessagetext
 */
Context.prototype.editMessageText = async function (
  text: string | FmtString,
  extra?: ExtraEditMessageText
): Promise<true | (tg.Update.Edited & tg.Message.TextMessage)> {
  if (this.message && this.message.text !== text) {
    const editedMessage = await this.telegram.editMessageText(
      this.chat?.id,
      this.callbackQuery?.message?.message_id,
      this.inlineMessageId,
      text,
      extra
    );
    return editedMessage as tg.Update.Edited & tg.Message.TextMessage;
  } else {
    throw new Error("The message has not been modified");
  }
};
