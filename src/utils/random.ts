import { createHash, randomBytes } from 'crypto';

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
            return Random.getRandomNumber(from, to);
        }
    }

    static generateRandomSeed(length: number): string {
        return randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
    }

    static getRandomInteger(from: number, to: number) {
        const seed = this.generateRandomSeed(16);
        const hash = createHash('sha256');
        hash.update(seed);
        const hashValue = hash.digest('hex');
        const randomNumber = parseInt(hashValue.substring(0, 16), 16);
        return Math.floor(from + (randomNumber % (to - from + 1)));
    }

    static getRandomNumber(from: number, to: number) {
        const seed = this.generateRandomSeed(16);
        const hash = createHash('sha256');
        hash.update(seed);
        const hashValue = hash.digest('hex');
        const randomNumber = parseInt(hashValue.substring(0, 16), 16);
        return from + (randomNumber / 0xFFFFFFFFFFFFFFFF) * (to - from);
    }
}