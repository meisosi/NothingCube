export enum StatusType {
    admin = 'admin',
    support = 'support',
    streamer = 'streamer',
    user = 'user',
    dead = 'dead',
    ban = 'ban'
}

export interface Stats {
    user_id: number;
    status: StatusType;
    cases: number;
    rolls: number;
    earend: number;
    win: number;
    gems_earn: number;
    moons_earn: number;
    referalId: number|null;
    created_at: Date;
}