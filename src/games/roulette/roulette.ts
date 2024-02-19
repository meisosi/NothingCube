import { Game } from '../core/game';
import { LobbyHandler } from '../core/handler';
import { Lobby } from '../core/lobby';
import { GameFacade } from '../game-facade';
import { Player, StepResult } from '../types/core-types';
import { Random } from '../../utils/random';

const SHOOTS_CHANCES = [0.2, 0.4, 0.6, 0.8, 1];

export class Roulette extends Game {
    constructor() {
        super(2);
    }
    step(from: Player, shootsBefore: number): StepResult {
        if(shootsBefore >= SHOOTS_CHANCES.length) {
            throw new Error(
                `Число выстрелов до ${shootsBefore}
                 превышает ${SHOOTS_CHANCES.length}`
            );
        }
        const random = Random.getRandomNumber(0, 1);
        return {
            result: random <= SHOOTS_CHANCES[shootsBefore]?
                'game_end':
                'next_step',
            data: { shootsBefore: shootsBefore + 1 }
        };
    }
}

export class RouletteHandler extends LobbyHandler<Roulette> {
    handleUpdate(stepResult: StepResult): Record<string, unknown> {
        if(stepResult.result === 'game_end') {
            return { };
        } else {
            return stepResult.data;
        }
    }
}

export class RouletteLobby extends Lobby<Roulette> {
    constructor(handler: RouletteHandler) {
        super({ shootsBefore: 0 }, handler);
    }
}

export class RouletteFacade extends GameFacade<Roulette> { }