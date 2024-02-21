export enum PromocodeType {
    coins = 'coins',
    gems = 'gems',
    moons = 'moons',
    bigGems = 'big_gems',
}

export interface Promocode {
    code: string;
    type: PromocodeType;
    activations: number;
    count: number;
    expires_at: Date;
}
