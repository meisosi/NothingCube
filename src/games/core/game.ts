import { Player, StepResult } from '../types/core-types';
/**
 * Основной класс игры. В нём описывается
 * основная игровая мехника.
 * 
 * (!) Игра является пошаговой.
 */
export abstract class Game {
    constructor(
        private readonly maxPlayers: number
    ) { }
    get MaximumPlayers() {
        return this.maxPlayers;
    }
    /**
     * Метод, определяющий поведение
     * игрового шага.
     * 
     * @param { Player } from Выполняющий шаг.
     * @param { unknown[] } params Информация для выполнения шага.
     */
    abstract step(
        from: Player,
        ...params: unknown[]
    ): StepResult;
}