import { Game } from './core/game';
import { Lobby } from './core/lobby';
import { LobbyStorage } from './core/storages/lobby-storage';
import { Player } from './types/core-types';

export abstract class GameFacade<G extends Game> {
    protected readonly lobbyStorage: LobbyStorage<G>;
    constructor(
        private readonly game: G
    ) {
        this.lobbyStorage = new LobbyStorage();
    }
    setLobby(id: string, lobby: Lobby<G>): void {
        if(this.game.MaximumPlayers > lobby.CountPlayers) {
            this.lobbyStorage.setLobby(id, lobby);
        }
    }
    bringPlayer(player: Player, id?: string): void {
        let lobby: Lobby<G>;
        if(id) {
            const state = this.lobbyStorage.getState(id);
            if(state === 'waiting') {
                lobby = this.lobbyStorage.getLobby(id, state);
            }
        } else {
            if(!(id = this.lobbyStorage.FirstWaitingId)) return;
            lobby = this.lobbyStorage.getFirstLobby('waiting');
        }
        if(lobby) {
            if(lobby.bringPlayer(player) === this.game.MaximumPlayers) {
                this.lobbyStorage.changeState(id);
            }
        }
    }
    tryStep(id: string): Record<string, unknown> {
        const state = this.lobbyStorage.getState(id);
        if(state === 'going') {
            const lobby = this.lobbyStorage.getLobby(id, state);
            const result = this.game.step(
                lobby.lastToStart(),
                ...lobby.DataValues
            );
            if(result.result === 'game_end') {
                this.lobbyStorage.changeState(id);
            }
            const data = lobby.pushQuery(result);
            return data;
        }
    }
}