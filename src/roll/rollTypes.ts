import { Inventory } from "../interface/inventory"

/**
 * Эмодзи, используемое при бросках.
 * 
 * {@link emoji} - эмодзи, которое
 * является одинм из сообщений телеграма.
 * {@link maxValue} - максимальное, выпадаемое
 * число при броске.
 */
export interface DiceEmoji {
    emoji:      '🎲' | '🎯' | '🎳' | '🏀' | '⚽' | '🎰' ,
    maxValue:   number
}
/**
 * Приз включает в себя тип из инвенторя {@link type}
 * и выдаваемое значение {@link value}.
 */
export type Prize = {
    type:       keyof Inventory,
    value:      Inventory[keyof Inventory],
}

export const CUBE : DiceEmoji = {
    emoji:      '🎲',
    maxValue:   6
}