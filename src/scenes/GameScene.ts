import Phaser from 'phaser';
import { GameStateMachine, GameState } from '../core/GameStateMachine';
import { Board } from '../core/Board';
import { Card } from '../cards/CardSystem';
import { BattleEngine } from '../combat/BattleEngine';
import { FrameBudget } from '../debug/FrameBudget';

export class GameScene extends Phaser.Scene {
  public fsm!: GameStateMachine;
  public board!: Board;
  public frameBudget!: FrameBudget;

  private player!: any;
  private enemies: any[] = [];

  constructor() { super({ key: 'GameScene' }); }

  init(): void {
    this.fsm = new GameStateMachine();
    this.board = new Board(5, 5);
    this.frameBudget = new FrameBudget();
  }

  create(): void {
    this.fsm.transition(GameState.INIT_RUN);
    this.renderBoard();
    this.renderHUD();
  }

  update(_time: number, _delta: number): void {
    this.frameBudget.beginFrame();
    // 游戏循环逻辑
  }

  private renderBoard(): void {
    const cellSize = 70;
    const offsetX = 20;
    const offsetY = 240;

    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const x = offsetX + c * cellSize;
        const y = offsetY + r * cellSize;
        this.add.rectangle(x, y, cellSize - 2, cellSize - 2, 0x1a1a2e)
          .setStrokeStyle(1, 0x2a2a3e);
      }
    }
  }

  private renderHUD(): void {
    this.add.text(10, 10, 'HP: 60/60', { fontSize: '16px', color: '#6bff8a' });
    this.add.text(10, 30, 'AP: 3', { fontSize: '16px', color: '#6bb5ff' });
    this.add.text(10, 50, '金币: 0', { fontSize: '16px', color: '#ffd76b' });
  }
}
