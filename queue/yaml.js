"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultConfigCreator = exports.ConfigurationCreator = exports.Configuration = exports.YAML_PATH_SEPARATOR = exports.YAML_FILE_TYPES = exports.FILE_REGEX = void 0;
const yaml_1 = require("yaml");
const fs = require("fs");
const stringBuilder_1 = require("./stringBuilder");
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
exports.FILE_REGEX = /(?:(.+)(?:\:\/))?(.+\/)?(.+(?:\.)(.+))/;
/**
 * Формат файлов YAML конфигурации. При том,
 * {@link YamlConfiguration} обрабатывает не только
 * такие файлы.
 */
exports.YAML_FILE_TYPES = ['yaml', 'yml'];
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
exports.YAML_PATH_SEPARATOR = '.';
class Configuration {
    load(file, encoding = 'utf-8') {
        if (!fs.existsSync(file)) {
            throw new Error('File not Found');
        }
        this.document = file instanceof Buffer ?
            (0, yaml_1.parseDocument)(file.toString(encoding)) :
            (0, yaml_1.parseDocument)(fs.readFileSync(file, encoding));
        this.documentMap = this.document.contents;
        this.documentJSON = this.documentMap.toJSON();
        return this;
    }
    save(path) {
        fs.writeFile(path, this.document.toString(), (error) => {
            if (error)
                return error;
        });
    }
    get(path) {
        if (!this.document)
            throw new Error('Document not Found');
        return this.document.getIn(path.split(exports.YAML_PATH_SEPARATOR));
    }
    set(path, value) {
        if (!this.document)
            throw new Error('Document not Found');
        this.document.setIn(path.split(exports.YAML_PATH_SEPARATOR), value);
    }
    has(path) {
        if (!this.document)
            throw new Error('Document not Found');
        return this.document.hasIn(path.split(exports.YAML_PATH_SEPARATOR));
    }
    keysIn(path) {
        if (!this.document)
            throw new Error('Document not Found');
        if (!path || path === stringBuilder_1.StringBuilder.empty)
            return this.keys();
        let value = this.get(path);
        if (value instanceof yaml_1.YAMLMap) {
            return Object.keys(value.toJSON());
        }
        else {
            return undefined;
        }
    }
    keys() {
        if (!this.documentJSON)
            throw new Error('Document not Found');
        return Object.keys(this.documentJSON);
    }
}
exports.Configuration = Configuration;
class ConfigurationCreator {
    checkFileType(path) {
        return exports.YAML_FILE_TYPES.includes(exports.FILE_REGEX.exec(path)[4]);
    }
}
exports.ConfigurationCreator = ConfigurationCreator;
class DefaultConfigCreator extends ConfigurationCreator {
    create(file, encoding = 'utf-8', checkFileType = true) {
        if (checkFileType && typeof file === 'string') {
            if (!this.checkFileType(file))
                throw new Error('File type Not Correct');
        }
        let configuration = new Configuration();
        return configuration.load(file, encoding);
    }
}
exports.DefaultConfigCreator = DefaultConfigCreator;
