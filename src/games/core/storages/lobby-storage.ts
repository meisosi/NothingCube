import { Game } from '../game';
import { Lobby } from '../lobby';
/** Хранилище лобби. */
export class LobbyStorage<G extends Game> {
    /** Лобби, ожидающие запуск. */
    private waiting: Record<string, Lobby<G>> = { };
    /** Лобби, которые были запущены. */
    private going: Record<string, Lobby<G>> = { };
    /** Список айди лобби, ожидающих запуск. */
    get WaitingKeys() {
        return Object.keys(this.waiting);
    }
    /** Список айди лобби, которые были запущены. */
    get GoingKeys() {
        return Object.keys(this.going);
    }
    get FirstWaitingId() {
        return Object.keys(this['waiting'])[0];
    }
    get FirstGoingId() {
        return Object.keys(this['going'])[0];
    }
    /**
     * Получает состояние лобби, т.е.
     * принадлежность определённому словарю любби:
     * - `waiting` - словарь {@link waiting}
     * - `going` - словарь {@link going}
     * 
     * @param { string } id Айди лобби.
     * @returns { string } Состояние соответствующего лобби.
     */
    getState(id: string): 'waiting' | 'going' | undefined {
        if(this.WaitingKeys.includes(id)) {
            return 'waiting';
        } else if(this.GoingKeys.includes(id)) {
            return 'going';
        }
    }
    /**
     * Первым лобби считаем лобби, ключ которого
     * первый в списке ключей заданного состояния.
     * 
     * @param { string } state Состояние ({@link getState}).
     * @returns { Lobby<G> } Первое лобби в заданном словаре.
     */
    getFirstLobby(state: 'waiting' | 'going' = 'waiting'): Lobby<G> {
        if(Object.keys(this[state]).length) {
            return this[state][
                Object.keys(this[state])[0]
            ];
        }
    }
    /**
     * Получает лобби по соответствующему состоянию.
     * Если состояние не указано - состояние
     * ищется по айди ({@link getState}).
     * 
     * @param { string } id Айди лобби.
     * @param { string= } state Требуемое состояние.
     * @returns { Lobby<G> } Соответствующее лобби.
     */
    getLobby(id: string, state: 'going' | 'waiting' = undefined): Lobby<G> {
        if(state) {
            return this[state][id];
        } else {
            state = this.getState(id);
            if(state) {
                return this[state][id];
            }
        }
    }
    /**
     * Заносит лобби в словарь `waiting`, 
     * в случае, если лобби с заданным айди не
     * существует.
     * 
     * @param { string } id Айди лобби.
     * @param { Lobby<G> } lobby Устанавливаемое лобби.
     */
    setLobby(id: string, lobby: Lobby<G>) {
        const state = this.getState(id);
        if(!state) {
            this.waiting[id] = lobby;
        }
    }
    /**
     * Меняет состояние лобби, т.е.
     * переносит оное из одного списка
     * в другой.
     * 
     * @param { string } id Айди лобби. 
     */
    changeState(id: string) {
        switch (this.getState(id)) {
            case 'waiting':
                this.setGoing(id, this.waiting[id]);
                break;
            case 'going':
                this.setWaiting(id, this.going[id]);
                break;
            default:
                break;
        }
    }
    private setWaiting(id: string, lobby: Lobby<G>) {
        this.waiting[id] = lobby;
        this.delete(id, 'going');
    }
    private setGoing(id: string, lobby: Lobby<G>) {
        this.going[id] = lobby;
        this.delete(id, 'waiting');
    }
    private delete(id: string, type: 'waiting' | 'going') {
        delete this[type][id];
    }
}