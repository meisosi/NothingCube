export interface Promocode{
    id: number,
    code: string,
    type: string,
    count: number,
    expires_at: Date | boolean
}