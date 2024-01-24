import { TelegramError } from "telegraf";
import { BotEvent, EventHandler, Listener } from "../../events/event";
import { ErrorLogger, ErrorMessageFormat, LogType } from "../../utils/errorLogger";

export class EventError extends BotEvent {
    private static readonly telegrafErrorLogger: ErrorLogger = new ErrorLogger(
        new ErrorMessageFormat('{1} ({3}): {0} may be at {2}')
    );
    private static readonly processErrorLogger: ErrorLogger = new ErrorLogger(
        new ErrorMessageFormat()
    );

    static send(error: any) {
        EventHandler.invoke(this, error, EventError.telegrafErrorLogger, EventError.processErrorLogger);
    }
}

class ErrorListener extends Listener {
    @EventHandler.Handler(
        EventError
    )
    onError(error: any, telegrafErrorLogger : ErrorLogger, processErrorLogger: ErrorLogger) {
        if(error instanceof Error) {
            if(error instanceof TelegramError) {
                telegrafErrorLogger.log(error, '/src', LogType.FILE, error.code);
            } else {
                processErrorLogger.log(error, '/src', LogType.CONSOLE);
            }
        }
    }
}