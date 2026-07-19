export enum GameState {
  BOOT       = 'BOOT',
  MENU       = 'MENU',
  INIT_RUN   = 'INIT_RUN',
  PLAYER_TURN= 'PLAYER_TURN',
  ENEMY_TURN = 'ENEMY_TURN',
  RESOLVING  = 'RESOLVING',
  REWARD     = 'REWARD',
  GAME_OVER  = 'GAME_OVER',
  PAUSED     = 'PAUSED',
}

const TRANSITIONS: Record<GameState, GameState[]> = {
  [GameState.BOOT]:        [GameState.MENU],
  [GameState.MENU]:        [GameState.INIT_RUN],
  [GameState.INIT_RUN]:    [GameState.PLAYER_TURN],
  [GameState.PLAYER_TURN]: [GameState.ENEMY_TURN, GameState.PAUSED],
  [GameState.ENEMY_TURN]:  [GameState.RESOLVING],
  [GameState.RESOLVING]:   [GameState.PLAYER_TURN, GameState.REWARD, GameState.GAME_OVER],
  [GameState.REWARD]:      [GameState.PLAYER_TURN, GameState.GAME_OVER],
  [GameState.GAME_OVER]:   [GameState.MENU],
  [GameState.PAUSED]:      [GameState.PLAYER_TURN, GameState.MENU],
};

export class GameStateMachine {
  private _current: GameState = GameState.BOOT;
  private history: GameState[] = [];

  get state(): GameState { return this._current; }

  transition(to: GameState): boolean {
    const allowed = TRANSITIONS[this._current];
    if (!allowed?.includes(to)) {
      console.error(`[StateMachine] 非法转移: ${this._current} → ${to}`);
      return false;
    }
    this.history.push(this._current);
    this._current = to;
    return true;
  }

  rollback(): boolean {
    if (this.history.length === 0) return false;
    this._current = this.history.pop()!;
    return true;
  }

  snapshot(): string {
    return JSON.stringify({ state: this._current, history: this.history });
  }

  restore(snapshot: string): void {
    const data = JSON.parse(snapshot);
    this._current = data.state;
    this.history = data.history;
  }
}
