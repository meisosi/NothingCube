import { Game } from '../core/game';
import { LobbyHandler } from '../core/handler';
import { Lobby } from '../core/lobby';
import { GameFacade } from '../game-facade';
import { Player, StepResult } from '../types/core-types';

type Side = 'left' | 'center' | 'right' | undefined;

export class Penalty extends Game {
    constructor() {
        super(2);
    }
    step(from: Player, penaltySide: Side, goalkeeperSide: Side): StepResult {
        if(penaltySide === undefined || goalkeeperSide === undefined) {
            return { result: 'next_step' };
        }
        return {
            result: 'game_end',
            data: {
                winner: penaltySide === goalkeeperSide?
                    'goalkeeper':
                    'penalty'
            }
        };
    }
}

export class PenaltyHandler extends LobbyHandler<Penalty> {
    handleUpdate(stepResult: StepResult): Record<string, unknown> {
        if(stepResult.result !== 'game_end') {
            throw new Error(
                `Ошибка результата игры Penalty: ${stepResult.result}`
            );
        }
        return stepResult.data;
    }
}

export class PenaltyLobby extends Lobby<Penalty> {
    constructor(handler: PenaltyHandler) {
        super({
            penaltySide: undefined,
            goalkeeperSide: undefined
        }, handler);
    }
    setPenaltySide(side: Side) {
        this.dataStorage.safetySet('penaltySide', side);
    }
    setGoalkeeperSide(side: Side) {
        this.dataStorage.safetySet('goalkeeperSide', side);
    }
}

export class PenaltyFacade extends GameFacade<Penalty> {
    setPenaltySide(id: string, side: Side) {
        const state = this.lobbyStorage.getState(id);
        if(state === 'going') {
            (this.lobbyStorage.getLobby(id, state) as PenaltyLobby)
                .setPenaltySide(side);
        }
    }
    setGoalkeeperSide(id: string, side: Side) {
        const state = this.lobbyStorage.getState(id);
        if(state === 'going') {
            (this.lobbyStorage.getLobby(id, state) as PenaltyLobby)
                .setGoalkeeperSide(side);
        }
    }
}