export interface WithdrawPromocode {
    code:            string;
    type:           'gems' | 'moons' | 'big_gems';
    userId?:        number | undefined
}

export interface WithdrawUser {
    userId:         number;
    waitingType:    'gems' | 'moons' | 'big_gems';
}