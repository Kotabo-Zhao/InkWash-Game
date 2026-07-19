/**
 * BoardBattle.ts - 棋道核心系统
 * 墨境棋局的独特玩法：每张牌打出后需要在5×5棋盘上落子
 * 落子位置影响效果加成，这是区别于杀戮尖塔的核心机制
 */

import { Card, CardType } from '../cards/CardSystem';

// ====== 位置类型 ======
export enum PositionType {
  CENTER = 'CENTER',       // 天元 (2,2) - 双倍伤害
  CORNER = 'CORNER',       // 四角 - +护甲
  EDGE = 'EDGE',           // 边缘(非角非中心) - +抽牌
  INNER = 'INNER',         // 内圈(非中心) - 标准效果
}

// ====== 墨子类型 ======
export enum InkStoneType {
  EMPTY = 'EMPTY',
  PLAYER = 'PLAYER',       // 玩家墨子（黑）
  ENEMY = 'ENEMY',         // 敌人墨子（白）
  BLOCKED = 'BLOCKED',     // 封锁格
}

// ====== 墨子数据 ======
export interface InkStone {
  type: InkStoneType;
  cardId?: string;
  cardName?: string;
  owner: 'player' | 'enemy';
  turn: number;
}

// ====== 位置加成 ======
export interface PositionBonus {
  damageMultiplier: number;
  blockBonus: number;
  drawBonus: number;
  description: string;
}

// ====== 阵型 ======
export enum Formation {
  NONE = 'NONE',
  FOUR_CORNERS = 'FOUR_CORNERS',   // 四角占满 - 全屏伤害
  CROSS = 'CROSS',                 // 十字 - 力量+2
  LINE = 'LINE',                   // 一线 - 抽2牌
  DIAGONAL = 'DIAGONAL',           // 对角线 - 护甲+5
  CENTER_RING = 'CENTER_RING',     // 中心+四邻 - 墨压+20
}

export interface FormationBonus {
  formation: Formation;
  effect: string;
  damageBonus?: number;
  blockBonus?: number;
  drawBonus?: number;
  inkChargeBonus?: number;
  strengthBonus?: number;
}

// ====== 棋盘战斗系统 ======
export class BoardBattle {
  readonly size = 5;
  readonly board: InkStone[][] = [];
  public inkCharge = 0;        // 墨压值 (0-100)
  public maxInkCharge = 100;

  constructor() {
    this.reset();
  }

  reset(): void {
    for (let y = 0; y < this.size; y++) {
      this.board[y] = [];
      for (let x = 0; x < this.size; x++) {
        this.board[y][x] = { type: InkStoneType.EMPTY, owner: 'player', turn: 0 };
      }
    }
    this.inkCharge = 0;
  }

  // ====== 落子 ======
  placeStone(x: number, y: number, owner: 'player' | 'enemy', cardId?: string, cardName?: string, turn?: number): boolean {
    if (!this.isValid(x, y)) return false;
    if (this.board[y][x].type !== InkStoneType.EMPTY) return false;
    this.board[y][x] = {
      type: owner === 'player' ? InkStoneType.PLAYER : InkStoneType.ENEMY,
      cardId,
      cardName,
      owner,
      turn: turn ?? 0,
    };
    // 玩家落子增加墨压
    if (owner === 'player') {
      this.addInkCharge(10);
    }
    return true;
  }

  // ====== 获取位置类型 ======
  getPositionType(x: number, y: number): PositionType {
    if (x === 2 && y === 2) return PositionType.CENTER;
    const isCorner = (x === 0 || x === 4) && (y === 0 || y === 4);
    if (isCorner) return PositionType.CORNER;
    const isEdge = x === 0 || x === 4 || y === 0 || y === 4;
    if (isEdge) return PositionType.EDGE;
    return PositionType.INNER;
  }

  // ====== 获取位置加成 ======
  getPositionBonus(x: number, y: number, cardType?: CardType): PositionBonus {
    const posType = this.getPositionType(x, y);
    switch (posType) {
      case PositionType.CENTER:
        return {
          damageMultiplier: 2.0,
          blockBonus: 0,
          drawBonus: 0,
          description: '天元 · 双倍伤害',
        };
      case PositionType.CORNER:
        return {
          damageMultiplier: 1.0,
          blockBonus: 3,
          drawBonus: 0,
          description: '角落 · +3护甲',
        };
      case PositionType.EDGE:
        return {
          damageMultiplier: 1.0,
          blockBonus: 0,
          drawBonus: 1,
          description: '边缘 · +1抽牌',
        };
      case PositionType.INNER:
      default:
        return {
          damageMultiplier: 1.0,
          blockBonus: 0,
          drawBonus: 0,
          description: '内圈 · 标准',
        };
    }
  }

  // ====== 相邻加成 ======
  getAdjacentBonususes(x: number, y: number, owner: 'player' | 'enemy'): number {
    const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    let count = 0;
    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (this.isValid(nx, ny) && this.board[ny][nx].owner === owner && this.board[ny][nx].type !== InkStoneType.EMPTY) {
        count++;
      }
    }
    return count;
  }

  // ====== 检测阵型 ======
  detectFormations(owner: 'player' | 'enemy'): FormationBonus[] {
    const formations: FormationBonus[] = [];
    const stones = this.getStones(owner);

    // 四角阵
    const corners = [[0, 0], [4, 0], [0, 4], [4, 4]];
    const allCorners = corners.every(([cx, cy]) =>
      this.isValid(cx, cy) && this.board[cy][cx].owner === owner && this.board[cy][cx].type !== InkStoneType.EMPTY
    );
    if (allCorners) {
      formations.push({
        formation: Formation.FOUR_CORNERS,
        effect: '四角阵 · 全屏震慑',
        damageBonus: 0,
      });
    }

    // 十字阵：中心+上下左右
    const crossPositions = [[2, 1], [2, 3], [1, 2], [3, 2]];
    const hasCenter = this.isValid(2, 2) && this.board[2][2].owner === owner && this.board[2][2].type !== InkStoneType.EMPTY;
    const allCross = hasCenter && crossPositions.every(([cx, cy]) =>
      this.isValid(cx, cy) && this.board[cy][cx].owner === owner && this.board[cy][cx].type !== InkStoneType.EMPTY
    );
    if (allCross) {
      formations.push({
        formation: Formation.CROSS,
        effect: '十字阵 · 力量+2',
        strengthBonus: 2,
      });
    }

    // 一线阵：同一行或同一列满5个
    for (let row = 0; row < 5; row++) {
      let full = true;
      for (let col = 0; col < 5; col++) {
        if (this.board[row][col].owner !== owner || this.board[row][col].type === InkStoneType.EMPTY) {
          full = false;
          break;
        }
      }
      if (full) {
        formations.push({
          formation: Formation.LINE,
          effect: '一线阵 · +2抽牌',
          drawBonus: 2,
        });
        break;
      }
    }
    for (let col = 0; col < 5; col++) {
      let full = true;
      for (let row = 0; row < 5; row++) {
        if (this.board[row][col].owner !== owner || this.board[row][col].type === InkStoneType.EMPTY) {
          full = false;
          break;
        }
      }
      if (full) {
        formations.push({
          formation: Formation.LINE,
          effect: '一线阵 · +2抽牌',
          drawBonus: 2,
        });
        break;
      }
    }

    // 对角线阵
    const diag1 = [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]];
    const diag2 = [[4, 0], [3, 1], [2, 2], [1, 3], [0, 4]];
    const checkDiag = (positions: number[][]) =>
      positions.every(([cx, cy]) =>
        this.board[cy][cx].owner === owner && this.board[cy][cx].type !== InkStoneType.EMPTY
      );
    if (checkDiag(diag1) || checkDiag(diag2)) {
      formations.push({
        formation: Formation.DIAGONAL,
        effect: '对角阵 · +5护甲',
        blockBonus: 5,
      });
    }

    // 中心环阵：中心+四邻全占
    const centerRing = [[2, 2], [2, 1], [2, 3], [1, 2], [3, 2]];
    const allRing = centerRing.every(([cx, cy]) =>
      this.board[cy][cx].owner === owner && this.board[cy][cx].type !== InkStoneType.EMPTY
    );
    if (allRing) {
      formations.push({
        formation: Formation.CENTER_RING,
        effect: '墨环阵 · 墨压+20',
        inkChargeBonus: 20,
      });
    }

    return formations;
  }

  // ====== 获取所有墨子位置 ======
  getStones(owner: 'player' | 'enemy'): Array<{ x: number; y: number; stone: InkStone }> {
    const result: Array<{ x: number; y: number; stone: InkStone }> = [];
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.board[y][x].owner === owner && this.board[y][x].type !== InkStoneType.EMPTY) {
          result.push({ x, y, stone: this.board[y][x] });
        }
      }
    }
    return result;
  }

  // ====== 清空指定玩家的墨子 ======
  clearStones(owner: 'player' | 'enemy'): void {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.board[y][x].owner === owner) {
          this.board[y][x] = { type: InkStoneType.EMPTY, owner: 'player', turn: 0 };
        }
      }
    }
  }

  // ====== 清空整盘 ======
  clearAll(): void {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        this.board[y][x] = { type: InkStoneType.EMPTY, owner: 'player', turn: 0 };
      }
    }
  }

  // ====== 墨压管理 ======
  addInkCharge(amount: number): void {
    this.inkCharge = Math.min(this.maxInkCharge, this.inkCharge + amount);
  }

  spendInkCharge(amount: number): boolean {
    if (this.inkCharge < amount) return false;
    this.inkCharge -= amount;
    return true;
  }

  isInkFull(): boolean {
    return this.inkCharge >= this.maxInkCharge;
  }

  getInkChargePercent(): number {
    return this.inkCharge / this.maxInkCharge;
  }

  // ====== 可用格子数 ======
  getEmptyCount(): number {
    let count = 0;
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.board[y][x].type === InkStoneType.EMPTY) count++;
      }
    }
    return count;
  }

  // ====== 格子是否有效 ======
  isValid(x: number, y: number): boolean {
    return x >= 0 && x < this.size && y >= 0 && y < this.size;
  }

  // ====== 格子是否为空 ======
  isEmpty(x: number, y: number): boolean {
    return this.isValid(x, y) && this.board[y][x].type === InkStoneType.EMPTY;
  }

  // ====== 玩家墨子数 ======
  getPlayerStoneCount(): number {
    return this.getStones('player').length;
  }

  // ====== 敌人墨子数 ======
  getEnemyStoneCount(): number {
    return this.getStones('enemy').length;
  }

  // ====== 敌人落子AI ======
  getEnemyPlacement(cardType: CardType): { x: number; y: number } | null {
    // 简单AI：优先占据关键位置
    // 1. 如果天元空着，优先占
    if (this.isEmpty(2, 2)) return { x: 2, y: 2 };
    // 2. 占角落
    const cornerOrder = [[0, 0], [4, 0], [0, 4], [4, 4]];
    for (const [cx, cy] of cornerOrder) {
      if (this.isEmpty(cx, cy)) return { x: cx, y: cy };
    }
    // 3. 占内圈
    const innerOrder = [[1, 1], [3, 1], [1, 3], [3, 3], [2, 1], [2, 3], [1, 2], [3, 2]];
    for (const [cx, cy] of innerOrder) {
      if (this.isEmpty(cx, cy)) return { x: cx, y: cy };
    }
    // 4. 随便占
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.isEmpty(x, y)) return { x, y };
      }
    }
    return null;
  }
}
