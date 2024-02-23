export enum StatusType {
    admin = 'admin',
    support = 'support',
    streamer = 'streamer',
    user = 'user',
    dead = 'dead',
    ban = 'ban'
}

export interface Stats {
    user_id: string;
    status: StatusType;
    cases: number;
    rolls: number;
    earend: number;
    win: number;
    gems_earn: number;
    moons_earn: number;
    created_at: Date | boolean;
}
