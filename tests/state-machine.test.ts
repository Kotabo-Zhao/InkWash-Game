import { describe, it, expect } from 'vitest';
import { GameStateMachine, GameState } from '../src/core/GameStateMachine';

describe('GameStateMachine', () => {
  it('初始状态为 BOOT', () => {
    const fsm = new GameStateMachine();
    expect(fsm.state).toBe(GameState.BOOT);
  });

  it('合法转移', () => {
    const fsm = new GameStateMachine();
    expect(fsm.transition(GameState.MENU)).toBe(true);
    expect(fsm.state).toBe(GameState.MENU);
  });

  it('非法转移被拒绝', () => {
    const fsm = new GameStateMachine();
    expect(fsm.transition(GameState.MENU)).toBe(true);
    expect(fsm.transition(GameState.GAME_OVER)).toBe(false);
  });

  it('回滚功能', () => {
    const fsm = new GameStateMachine();
    fsm.transition(GameState.MENU);
    fsm.transition(GameState.INIT_RUN);
    expect(fsm.rollback()).toBe(true);
    expect(fsm.state).toBe(GameState.MENU);
  });
});
