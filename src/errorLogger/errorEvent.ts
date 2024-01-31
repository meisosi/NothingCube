import { TelegramError } from "telegraf";
import { BotEvent } from "../events/botEvent";
import { ErrorLogger, ErrorMessageFormat, LogType } from "./errorLogger";
import { EventHandler } from "../events/eventHandler";
import { Listener } from "../events/listener";

export class EventError extends BotEvent {
    public static execute(error: Error) {
        super.execute(error);
    }
}

export class ErrorListener extends Listener {
    private readonly telegrafErrorLogger: ErrorLogger = new ErrorLogger(
        new ErrorMessageFormat('{1} ({3}): {0} may be at {2}')
    );
    private readonly processErrorLogger: ErrorLogger = new ErrorLogger(
        new ErrorMessageFormat()
    );

    @EventHandler.Handler.handle(
        EventError
    )
    onError(error: Error) {
        if(error instanceof Error) {
            if(error instanceof TelegramError) {
                this.telegrafErrorLogger.log(error, '/src', LogType.FILE, error.code);
            } else {
                this.processErrorLogger.log(error, '/src', LogType.CONSOLE);
            }
        }
    }
}