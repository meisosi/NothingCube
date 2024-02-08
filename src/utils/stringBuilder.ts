import { NotNull } from "./decorators";

/**
 * Утилита, обобщающая и расширяющая возможности при работе с типом `string`.
 * Не является паттерном "строитель" (!).
 */
export class StringBuilder {
    /** Пустая строка. */
    static readonly empty : string = '';
    /** Вид подстроки, заменяемой методом {@link format}. */
    private static readonly formatRegex : RegExp = /\{(\d)\}/g
    
    private constructor() { }

    /**
     * Метод заменяет подстроки вида {n} (см. {@link formatRegex}), где n - натуральное число 
     * на соответствующие им значения из `args` (`args[n]`). В случае, если указан номер,
     * однако список меньшего размера - подстрока не будет заменена; если же значение в 
     * списке не указано - подстрока заменится на пустую строку {@link empty}.
     * 
     * ```ts
     * StringBuilder.format('Hello, {0}! My name is {1}...', 'Earth', 'Sun');
     * // Output: Hello, Earth! My name is Sun...
     * ```
     * 
     * @param formattedString Строка, в которую требуется вставить аргументы `args`.
     * @param {any[]} args Значения, вставляемые в строку `formattedString`.
     * @returns {string} Строка, с заменёнными подстроками.
     */
    static format(@NotNull formattedString : string, ...args : any[]) : string {
        if(formattedString == null || typeof formattedString === 'undefined') {
            throw new Error(this.name);
        }
        return formattedString.replace(StringBuilder.formatRegex, (match, index) => 
            typeof args[index] !== 'undefined' ? args[index]: StringBuilder.empty); 
    }
}