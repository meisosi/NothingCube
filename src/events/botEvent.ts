import { EventHandler } from "./eventHandler";

export class BotEvent {
    public static execute(...args: any[]) {
        EventHandler.Handler.invoke(this, ...args);
    }
}