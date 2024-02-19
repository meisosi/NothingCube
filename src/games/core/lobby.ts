import { Player, StepResult } from '../types/core-types';
import { Game } from './game';
import { LobbyHandler } from './handler';
import { DataStorage } from './storages/data-storage';
/**
 * Лобби игры. Хранит информацию об игроках
 * и различную другую информацию.
 */
export abstract class Lobby<G extends Game> {
    /** Игроки, находящиеся в лобби. */
    private players: Player[] = [];
    /** Хранилище информации лобби. */
    protected dataStorage: DataStorage;
    /** Число игроков в лобби. */
    get CountPlayers(): number {
        return this.players.length;
    }
    /** {@link DataStorage.Values} */
    get DataValues(): unknown[] {
        return this.dataStorage.Values;
    }
    constructor(
        defaultData: Record<string, unknown>,
        private readonly handler: LobbyHandler<G>
    ) {
        this.dataStorage = new DataStorage(defaultData);
    }
    /**
     * Заносит заданного игрока в список
     * игроков данного лобби.
     * 
     * @param player Игрок, который заходит в лобби.
     * @returns { number } Новое число игроков.
     */
    bringPlayer(player: Player): number {
        return this.players.push(player);
    }
    /**
     * Убирает заданного игрока из списка
     * игроков данного лоббию
     * 
     * @param player Игрока, которого нужно убрать из списка игроков лобби.
     */
    kickPlayer(player: Player): void {
        this.players
            = this.players.filter(p => p !== player);
    }
    /** Убирает всех игроков из данного лобби. */
    kickAllPlayers(): void {
        this.players = [];
    }
    /**
     * Переносит игрока с конца списка
     * в самое начало, не выбрасывая первого.
     * 
     * @returns { Player } Перенесённого игрока.
     */
    lastToStart(): Player {
        const last = this.players.pop();
        this.players.unshift(last);
        return last;
    }
    /**
     * Отправляет запрос на обработку, следующим образом:
     * - отправляется запрос в обработчик;
     * - изменение хранилища в зависимости от результата
     *   запроса;
     * - 
     * 
     * @param { StepResult } stepResult Результат выполнения игрового шага.
     * @returns { Record<string, unknown> } Результат обработки.
     */
    pushQuery(stepResult: StepResult): Record<string, unknown> {
        const data = this.handler.handleUpdate(stepResult);
        if(stepResult.result === 'game_end') {
            this.kickAllPlayers();
            this.dataStorage.resetDefaultData();
        } else {
            this.dataStorage.safetySetData(data);
        }
        return data;
    }
}