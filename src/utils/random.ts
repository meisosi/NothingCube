export class Random {
    static getSumRandomArray(count: number, from?: number, to?: number) {
        return Random.getRandomArray(count, from, to).reduce((a, b) => a + b);
    }

    static getRandomArray(count: number, from?: number, to? : number) {
        if(from && to) {
            return Array.from(new Array<Number>(count), result => Random.getRandom(from, to));
        } else {
            return Array.from(new Array<Number>(count), result => Random.getRandom(0, 1));
        }
    }
    
    static getRandom(from: number, to: number) {
        if(Number.isInteger(from) && Number.isInteger(to)) {
            return Random.getRandomInteger(from, to);
        } else {
            return 
        }
    }

    static getRandomInteger(from: number, to: number) {
        let random = Math.random();

        from = Math.ceil(from);
        to = Math.floor(to);

        return Math.floor(this.getRandomNumber(from, to));
    }

    static getRandomNumber(from: number, to: number) {
        let random = Math.random();
        return random * (to - from) + from;
    }
}