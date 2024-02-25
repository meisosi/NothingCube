"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringBuilder = void 0;
/**
 * Утилита, обобщающая и расширяющая возможности при работе с типом `string`.
 * Не является паттерном "строитель" (!).
 */
class StringBuilder {
    constructor() { }
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
    static format(formattedString, ...args) {
        if (formattedString == null || typeof formattedString === 'undefined') {
            throw new Error(this.name);
        }
        return formattedString.replace(StringBuilder.formatRegex, (match, index) => typeof args[index] !== 'undefined' ? args[index] : StringBuilder.empty);
    }
}
exports.StringBuilder = StringBuilder;
/** Пустая строка. */
StringBuilder.empty = '';
/** Вид подстроки, заменяемой методом {@link format}. */
StringBuilder.formatRegex = /\{(\d)\}/g;
