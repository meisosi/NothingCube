import { NotEmpty, NotNull } from "../utils/decorators";
import { BotEvent } from "./botEvent";
import { Listener } from "./listener";
import "reflect-metadata";

export class EventHandler {
    private static instance : EventHandler;
    public listeners: Array<Listener> = new Array()
    
    public static get Handler() : EventHandler {
        return this.instance || (this.instance = new this());
    }

    private constructor() { }

    public addListener(@NotNull listener: Listener) {
        if(this.listeners.includes(listener) || listener == null) {
            return;
        } else {
            this.listeners.push(listener);
        }
    }

    public removeListener(@NotNull listener: Listener) {
        if(this.listeners.includes(listener)) {
            const index = this.listeners.indexOf(listener);
            if(index > -1) {
                this.listeners.splice(index, 1);
            }
        }
    }

    public invoke(@NotNull botEvent: BotEvent, ...args: any[]) {
        if(this.listeners.length && botEvent != null) {
            this.listeners.forEach(listener => listener.react(botEvent, ...args));
        }
    }

    public handle(@NotEmpty ...botEvents: BotEvent[]) {
        if(botEvents.length) {
            return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
                Reflect.defineMetadata("eventHandler:events", botEvents, target, propertyKey);
            }
        }
    }
}