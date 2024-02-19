import { StepResult } from '../types/core-types';
import { Game } from './game';
/** Счётчик событий из лобби. */
export abstract class LobbyHandler<G extends Game> {
    constructor(
        protected readonly game: G
    ) { }
    abstract handleUpdate(stepResult: StepResult): Record<string, unknown>;
}