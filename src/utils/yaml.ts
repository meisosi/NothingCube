import YAML, { YAMLMap, parseDocument } from "yaml";
import fs from "fs";
import { StringBuilder } from "./stringBuilder";

/**
 * Регулярное выражение, определяющее файлы.
 * Выделяет следующие группы:
 * - (1). Наименование диска.
 * - (2). Путь до файла (наименование диска не включается).
 * - (3). Название файла.
 * - (4). Тип файла.
 * 
 * @example
 * `E:/main directory/config.yaml`
 * // (E), (main directory/), (config.yaml), (yaml)
 * `./config.yaml`
 * // (), (./), (config.yaml), (yaml)
 * `./root dir/src/config.yaml`
 * // (), (./root dir/src/), (config.yaml), (yaml)
 * `config.yaml`
 * // (), (), (config.yaml), (yaml)
 */
export const FILE_REGEX = /(?:(.+)(?:\:\/))?(.+\/)?(.+(?:\.)(.+))/;
/**
 * Формат файлов YAML конфигурации. При том,
 * {@link YamlConfiguration} обрабатывает не только
 * такие файлы.
 */
export const YAML_FILE_TYPES = ['yaml', 'yml'];
/**
 * Разделитель между секциями внутри файла yaml.
 *
 * Например:
 * ```yaml
 * section:
 *   first:
 *     - Hi!
 *   second: "Bye!"
 * ```
 * при получении значения second, будем использовать:
 * ```js
 * ConfigurationSection.get('section${YAML_PATH_SEPARATOR}second')
 * ```
 * см. {@link ConfigurationSection}
 */
export const YAML_PATH_SEPARATOR = '.';

export interface YamlConfiguration {
    /**
     * Загружает конфигурацию из файла и замещает
     * нынешнюю новой.
     * 
     * @param {Buffer} buffer Информация о файле.
     * @param {BufferEncoding} encoding Кодировка файла.
     */
    load(buffer: Buffer, encoding: BufferEncoding) : this;
    /**
     * Загружает конфигурацию из файла и замещает
     * нынешнюю новой.
     * 
     * @param {string} filePath Путь до файла. 
     * @param {BufferEncoding} encoding Кодировка файла.
     */
    load(filePath: string, encoding: BufferEncoding) : this;

    /**
     * Сохраняет нынешнюю конфигурацию в файл.
     * 
     * @param {string} path Путь до файла.
     */
    save(path: string) : void;
}

export interface ConfigurationSection {
    /**
     * Метод для получения информации из конфигурации.
     * 
     * @param {string} path Путь до секции.
     */
    get(path: string) : any;
    /**
     * Метод для установки значения в конфигурацию.
     * 
     * @param path Путь до секции.
     * @param value Устанавливаемое значение.
     */
    set(path: string, value: any) : any;
    /**
     * Метод для проверки существования значения
     * в секции (подразумевается и наличие другой
     * секции).
     * 
     * @param path Путь до секции.
     */
    has(path: string) : boolean;
    /**
     * Метод для получения списка названий секций
     * по заданному пути.
     * 
     * @param path Путь до секции.
     * @returns {string[]} Список наименований секций.
     */
    keysIn(path: string) : string[];
    /**
     * Метод для получения списка названий секций
     * в конфигурации (нулевая секция).
     * 
     * см. {@link keysIn}
     */
    keys() : string[]
}

export class Configuration implements YamlConfiguration, ConfigurationSection {
    private document: YAML.Document<YAML.Node, true>;
    private documentMap: YAML.YAMLMap<unknown, unknown>;
    private documentJSON: JSON;

    load(buffer: Buffer, encoding: BufferEncoding): this;
    load(filePath: string, encoding: BufferEncoding): this;
    load(file: Buffer | string, encoding: BufferEncoding) : this;
    load(file: Buffer | string, encoding: BufferEncoding = 'utf-8'): this {
        if(!fs.existsSync(file)) {
            throw new Error('File not Found');
        }

        this.document = file instanceof Buffer ? 
            parseDocument(file.toString(encoding), ) :
            parseDocument(fs.readFileSync(file, encoding));
        this.documentMap = this.document.contents as YAMLMap
        this.documentJSON = this.documentMap.toJSON();

        return this;
    }
    save(path: string): void {
        fs.writeFile(path, this.document.toString(), (error) => {
            if(error) return error;
        })
    }
    get(path: string) : any {
        if(!this.document) throw new Error('Document not Found');
        return this.document.getIn(path.split(YAML_PATH_SEPARATOR)) as any;
    }
    set(path: string, value: any) : any {
        if(!this.document) throw new Error('Document not Found');
        this.document.setIn(path.split(YAML_PATH_SEPARATOR), value);
    }
    has(path: string): boolean {
        if(!this.document) throw new Error('Document not Found');
        return this.document.hasIn(path.split(YAML_PATH_SEPARATOR));
    }
    keysIn(path: string): string[] {
        if(!this.document) throw new Error('Document not Found');
        if(!path || path === StringBuilder.empty) return this.keys();

        let value = this.get(path);

        if(value instanceof YAMLMap) {
            return Object.keys(value.toJSON());
        } else {
            return undefined;
        }
    }
    keys(): string[] {
        if(!this.documentJSON) throw new Error('Document not Found');
        return Object.keys(this.documentJSON);
    }
}

export abstract class ConfigurationCreator<C extends Configuration> {
    abstract create(file: Buffer | string , encoding: BufferEncoding, checkFileType: boolean) : C;
    checkFileType(path: string) : boolean {
        return YAML_FILE_TYPES.includes(FILE_REGEX.exec(path)[4]);
    }
}

export class DefaultConfigCreator extends ConfigurationCreator<Configuration> {
    create(file: string | Buffer, encoding: BufferEncoding = 'utf-8', checkFileType: boolean = true): Configuration {
        if(checkFileType && typeof file === 'string') {
            if(!this.checkFileType(file)) throw new Error('File type Not Correct');
        }
        let configuration: Configuration = new Configuration();
        return configuration.load(file, encoding);
    }
}