/**
 * Класс, хранящий информацию, по принципу
 * словаря, имеющий изначальную (default) информацию.
 */
export class DataStorage {
    /** Хранящаяся информация. */
    private data: Record<string, unknown>;
    /** Все "ключи" хранящейся информации. */
    get Keys(): string[] {
        return Object.keys(this.data);
    }
    /** Все значения хранящейся информации. */
    get Values(): unknown[] {
        return Object.values(this.data);
    }
    constructor(
        /**
         * Информация, которая устанавливается по
         * стандарту и может быть использована,
         * в качестве изначальной информации (
         * {@link resetDefaultData} например).
         */
        private readonly defaultData: Record<string, unknown> = { }
    ) {
        this.resetDefaultData();
    }
    /** Устанавливает изначальную информацию. */
    resetDefaultData(): void {
        this.data = { ...this.defaultData };
    }
    /**
     * Устанавливает значение на место ключа, заместо прошлого.
     * 
     * @param { string } key Ключ, устанавливаемого значения.
     * @param { unknown } value Устанавливаемое значение.
     */
    set(key: string, value: unknown): void {
        this.data[key] = value;
    }
    /**
     * Устанавливает стандартное значение на место ключа,
     * заместо прошлого, если таковое в стандартной
     * "cхеме" существует.
     * 
     * @param { string } key Ключ, устанавливаемого значения.
     */
    setDefault(key: string): void {
        if(Object.keys(this.defaultData).includes(key)) {
            this.set(key, this.defaultData[key]);
        }
    }
    /**
     * Устанавливает значение только в том случае,
     * если ключ присутствует в стандартной "схеме".
     * 
     * @param { string } key Ключ, устанавливаемого значения.
     * @param { unknown } value Устанавливаемое значение.
     */
    safetySet(key: string, value: unknown): void {
        if(Object.keys(this.defaultData).includes(key)) {
            this.set(key, value);
        }
    }
    /**
     * Устанавливает множество значений по
     * соответствующим ключам.
     * 
     * @param { Record<string, unknown> } data Устанавливаемые значения и их ключи.
     */
    setData(data: Record<string, unknown>): void {
        Object.keys(data).forEach(key => {
            this.set(key, data[key]);
        });
    }
    /** Аналогично {@link setData}, совмещая с {@link safetySet}  */
    safetySetData(data: Record<string, unknown>): void {
        Object.keys(data).forEach(key => {
            this.safetySet(key, data[key]);
        });
    }
    /**
     * Получает значение по заданнному ключу.
     * 
     * @param { string } key Ключ.
     * @returns { unknown } Значение из словаря по заданному ключу.
     */
    get(key: string): unknown {
        return this.data[key];
    }
}