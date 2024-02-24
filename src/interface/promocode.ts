export enum PromocodeType {
    coins = 'coins',
    gems = 'gems',
    moons = 'moons',
    bigGems = 'big_gems',
    friend_coins = 'friend_coins',
    rolls = 'rolls'
}

export interface Promocode {
    code: string;
    type: PromocodeType;
    activations: number;
    count: number;
    expires_at: Date;
}
