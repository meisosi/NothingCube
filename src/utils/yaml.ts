import fs from "fs";
import YAML, { parseDocument } from "yaml";

export interface YamlConfiguration {
    load(buffer: Buffer, encoding: BufferEncoding);
    load(path: string, encoding: BufferEncoding);

    save(path: string);
}

export interface ConfigurationSection {
    getObject(path: string);
    set(path: string, settable: any);
}

export abstract class Configuration implements YamlConfiguration, ConfigurationSection {
    protected yamlDocument: YAML.Document;

    load(fileInfo: Buffer | string, encoding: BufferEncoding): Configuration {
        if(fileInfo instanceof Buffer) {
            this.yamlDocument = parseDocument(fileInfo.toString(encoding));
        } else if(typeof fileInfo === 'string') {
            this.yamlDocument = parseDocument(fs.readFileSync(fileInfo, encoding));
        } else {
            throw new Error();
        }
        return this;
    }

    save(path: string): Configuration {
        fs.writeFile(path, this.yamlDocument.toString(), error => {
            if(error) {
                throw error;
            }
        });
        return this;
    }

    abstract getObject(path: string);
    abstract set(path: string, settable: any);
    abstract has(path: string);
}

export class Config extends Configuration {
    constructor(private readonly filePath: string, private encoding: BufferEncoding = 'utf-8') {
        super();
        this.load(filePath, encoding);
    }

    getObject(path: string) {
        return this.yamlDocument.getIn(path.split('.'));
    }

    set(path: string, settable: any) {
        this.yamlDocument.setIn(path.split('.'), settable);
    }

    has(path: string) {
        return this.yamlDocument.hasIn(path.split('.'));
    }

    reload() : Config {
        this.load(this.filePath, this.encoding);
        return this;
    }
}