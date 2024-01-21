import { NotNull } from "../utils/decorators";

export abstract class BotEvent { }
export class Listener { }

/**
 * Основной класс логики обработки событий. См. далее методы.
 */
export class EventHandler {
    private static handled : Map<BotEvent, Array<Function>> = new Map();

    /**
     * Конструктор приватный, дабы класс невозможно было инициализировать.
     * @private
     */
    private constructor() { }

    /**
     * Вызывает функции, соответствующие {botEvent} из поля {handled}
     * @static
     * @param {BotEvent} botEvent Событие, выполнение которого требуется.
     * @param {any} params Аргументы функций, которые представлены для
     *  данного события.
     */
    static invoke(botEvent: BotEvent, ...params: any) : void{
        if(EventHandler.handled.has(botEvent)) {
            EventHandler.handled.get(botEvent).forEach((f: () => any) => f.apply(f, params));
        } else {
            console.warn(`Listener with ${botEvent.constructor.name} not found.`);
        }
    }

    /**
     * Устанавливает связь между событиями из {events} и функциями,
     * поверх которых установлен декоратор.
     * После вызова {Handler} функция записывается в словарь и может
     * быть вызвана наряду с другими методом {invoke}.
     * @static
     * @param {BotEvent} events События, с которыми связан метод.
     */
    static Handler(@NotNull ...events: BotEvent[]) : any {
        return function(target: Listener | any, propertyKey: string, descriptor: PropertyDescriptor) {
            if(!(target instanceof Listener)) {
                return console.warn(`${target.constructor.name} not Listener`);
            }
            events.forEach(concrete => {
                if(EventHandler.handled.has(concrete)) {
                    EventHandler.handled.get(concrete).push(descriptor.value);
                } else {
                    EventHandler.handled.set(concrete, [descriptor.value]);
                }
            });
        }
    }
}