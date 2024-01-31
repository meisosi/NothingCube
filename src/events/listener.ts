import { NotNull } from "../utils/decorators";
import { BotEvent } from "./botEvent";

export class Listener {
    public events: Map<BotEvent, string[]> = new Map();

    public constructor(...args: any) {
        this.construct(this);
    }

    public react(botEvent: BotEvent, ...args: any[]) {
        if(this.events.has(botEvent)) {
            this.events.get(botEvent).forEach(property => this[property](...args));
        } else {
            return;
        }
    }

    public construct(@NotNull target: Listener) {
        if(target == null || !(target instanceof Listener)) {
            return;
        }
        Object.getOwnPropertyNames(target.constructor.prototype)
            .filter(property => typeof target[property] === 'function')
            .forEach(method => {
                target.setEvents(method);
            })
    }

    public setEvents(propertyKey: string);
    public setEvents(@NotNull propertyKey: string, ...botEvents: BotEvent[] | undefined) {
        botEvents = botEvents.concat(Reflect.getMetadata('eventHandler:events', this, propertyKey));
        if(botEvents.includes(undefined) || typeof botEvents === 'undefined' || propertyKey == null) {
            return;
        }
        botEvents.forEach(event => {
                if(this.events.has(event) && !this.events.get(event).includes(propertyKey)) {
                    this.events.get(event).push(propertyKey);
                } else {
                    this.events.set(event, [propertyKey]);
                }
            });
    }
}