/**
 * Интерфейс игрока. Заместо него
 * может использоваться и User (
 * должен иметься userId).
 */
export interface Player {
    /** Айди пользователя из телеграма. */
    userId:         number;
}
/** Результат выполнения шага в игре. */
export interface StepResult {
    /**
     * Определяет "судьбу" следующего шага:
     * - `'next_step'` - игра продолжается;
     * - `'game_end'` - игра законечна.
     */
    result:         'next_step' | 'game_end';
    /** Дополнительная информация результата. */
    data?:          Record<string, unknown>;
}