import { Inventory } from "../interface/inventory";
import { NotNull } from "../utils/decorators";
import { Configuration, ConfigurationCreator } from "../utils/yaml";
import { YAML_PATH_SEPARATOR as separator } from "../utils/yaml";
import { Prize } from "./rollTypes";

/** Путь до секции с значения приза. */
const YAML_PRIZES_PATH_ROOT = 'rolls';
/** Формат наименования секции с призом. */
const PRIZE_SECTION_FORMAT = /\((\d)\)/

export class PrizesConfiguration extends Configuration {
    private prizes: Record<number, Prize> = { };

    load(file: Buffer | string, encoding: BufferEncoding = 'utf-8'): this {
        super.load(file, encoding); // Тут ошибка
        this.prizes = this.getPrizesFromConfig();
        return this;
    }

    getPrize(value: number) : Prize {
        return this.prizes[value];
    }

    private getPrizesFromConfig() : Record<number, Prize> {
        let result : Record<number, Prize> = { };
        this.keysIn(YAML_PRIZES_PATH_ROOT).forEach(section => {
            let prize = this.getPrizeFromConfig(section);
            if(prize) {
                result[PRIZE_SECTION_FORMAT.exec(section)[1]] = prize;
            }
        });
        return result;
    }

    private getPrizeFromConfig(@NotNull value: string) : Prize {
        if(
            value &&
            PRIZE_SECTION_FORMAT.test(value) &&
            this.hasPrize(value)
        ) {
            let path = `${YAML_PRIZES_PATH_ROOT}${separator}${value}${separator}`;
            let prizeType = this.get(`${path}type`);
            let prizeValue = parseInt(this.get(`${path}value`));
            if(typeof prizeType !== 'string' || isNaN(prizeValue)) {
                throw new Error(`Not correct prize: ${value}`);
            }
            return {
                type: prizeType as keyof Inventory,
                value: prizeValue
            }
        } else {
            throw new Error(`Not found prize: ${value}`);
        }
    }

    private hasPrize(@NotNull value: string) : boolean {
        return this.has(`${YAML_PRIZES_PATH_ROOT}${separator}${value}${separator}type`) 
            && this.has(`${YAML_PRIZES_PATH_ROOT}${separator}${value}${separator}value`);
    }
}

export class PrizesConfigCreator extends ConfigurationCreator<PrizesConfiguration> {
    create(file: string | Buffer, encoding: BufferEncoding = 'utf-8', checkFileType: boolean = true): PrizesConfiguration {
        if(checkFileType && typeof file === 'string') {
            console.log('Не нашли файл')
            if(!this.checkFileType(file)) throw new Error('File type Not Correct');
        }
        let configuration: PrizesConfiguration = new PrizesConfiguration();
        console.log('Запуск загрузки')
        return configuration.load(file, encoding);
    }
}