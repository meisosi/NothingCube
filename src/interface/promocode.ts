export interface Promocode{
    code: string,
    type: string,
    count: number,
    expires_at: Date | boolean
}