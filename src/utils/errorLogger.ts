import { StringBuilder } from "./stringBuilder";
import { NotNull } from "./decorators";
import { promises as fsPromises } from "fs";
import { join } from "path";

export enum LogType {
    CONSOLE =   0,
    FILE    = 1,
}

export class ErrorMessageFormat {
    /** Вид строки */
    private readonly line : RegExp = /\x20+at\x20(?:([^(]+)\x20\()?(.*):(\d+):(\d+)\)?/;
    private readonly newLine : RegExp = /\r\n|\n/;

    /**
     * Для поля `format` определены следующие структурные части:
     * - `{0}`: дата сообщения об ошибке;
     * - `{1}`: название ошибки `Error.name`;
     * - `{2}`: вероятные места ошибки (выдаются в виде списка с разделителем `\n\t`);
     * - `{3}`: дополнительные параметры.
     * 
     * Для поля `fileFormat` определены следующие структурные части:
     * - `{0}`: название возможного метода ошибки;
     * - `{1}`: путь до файла (до модуля) с местом, где возможно произошла ошибка;
     * - `{2}`: номер строки в соответствующем файле, где возможно произошла ошибка;
     * - `{3}`: номер символа в соответствующей строке.
     * 
     * @param {string} format Формат, под который 'подгоняется' результат метода `formatStack`.
     * @param {string} fileFormat Формат, под который 'подгоняются' строки с файлами (см. `formatStack` и `format`).
     */
    constructor(
        private readonly format: string = '{1}: {0}, возможно в: {2}',
        private readonly fileFormat: string = `{0}, {1}:{2}:{3}`
    ) { }

    /**
     * Приводит stacktrace в надлежащий для отладки вид, соответствующий определённым в `constructor` параметрам.
     * 
     * @param {Error} error Форматируемая ошибка.
     * @param {string} pathPart Часть пути, среди файлов, в которых может находиться ошибка.
     * @param {any[]} properties Возможные параметры (например, код ошибки в `telegraf`).
     * @returns Отформатированный stacktrace, по формату `format` и `lineFormat`.
     */
    public formatStack(@NotNull error: Object, pathPart: string = StringBuilder.empty, properties : any[]) : string | null {
        if(error instanceof Error) {
            if(typeof error.stack !== 'string') {
                return;
            }
            const parsedStack = Array.from(error.stack.split(this.newLine)
                .filter(str => str.includes(pathPart) && this.line.test(str)),
                        str => this.line.exec(str));

            return StringBuilder.format(this.format, 
                new Date().toString(), error.name, 
                Array.from(parsedStack, s => StringBuilder.format(this.fileFormat, s.slice(1))).join('\n\t'),
                properties.length ? properties.join(',') : StringBuilder.empty)
        }
        return null;
    }

}

export class ErrorLogger {
    /**
     * @param {ErrorMessageFormat} messageFormat Формат строки при отладке ошибки (см. {@link ErrorMessageFormat}).
     * @param {string} directory Путь к папке с логами (см. {@link logAtFile}).
     */
    constructor(
        private readonly messageFormat : ErrorMessageFormat, 
        private readonly directory: string = "logs/"
    ) { }

    /**
     * Отсылает на методы {@link logAtFile} и {@link logAtConsole} в зависимости
     * от параметра `toFile`.
     * 
     * @param {Error} error Записываемая ошибка. 
     * @param {string} pathPart Часть пути (файла или директории), требуемая в пути до файла с потенциальной ошибкой.
     * @param {LogType} toFile Требуется ли вести запись в файл или в консоль.
     * @param {string[]} properties Возможные параметры отладки (см. {@link ErrorMessageFormat.formatStack})
     * @returns {Promise<void> | void}
     */
    public log(@NotNull error: Object, pathPart : string = StringBuilder.empty, toFile : LogType = LogType.CONSOLE, ...properties : any[]) : Promise<void> | void {
        if(error === null || error === undefined || !(error instanceof Error)) {
            return;
        }
        return toFile? this.logAtFile(error, pathPart, properties) : this.logAtConsole(error, pathPart, properties);
    }

    /**
     * Заносит ошибку в файл по формату `messageFormat` в файл.
     * 
     * @param {Error} error {@link log}
     * @param {string} pathPart {@link log}
     */
    private async logAtFile(error: Error, pathPart : string, properties : any[]) : Promise<void> | undefined {
        try {
            await fsPromises.writeFile(join(this.directory, new Date().toDateString() + '.log'),
                this.messageFormat.formatStack(error!, pathPart, properties) + '\n',
                {flag: 'a+'})
        } catch(fileWriteError) {
            this.log(fileWriteError)
        }
    }

    /**
     * Отправляет ошибку по формату `messageFormat` в консоль.
     * 
     * @param {Error} error {@link log}
     * @param {string} pathPart {@link log}
     */
    private logAtConsole(error: Error, pathPart : string, properties : any[]) : void {
        return console.log(this.messageFormat.formatStack(error!, pathPart, properties));
    }
}