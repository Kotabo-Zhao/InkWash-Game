import { describe, it, expect } from 'vitest';
import { Board, CellType } from '../src/core/Board';

describe('Board', () => {
  it('创建 5x5 棋盘', () => {
    const board = new Board(5, 5);
    expect(board.rows).toBe(5);
    expect(board.cols).toBe(5);
  });

  it('边界外返回 WALL', () => {
    const board = new Board(5, 5);
    expect(board.getCell(-1, 0).type).toBe(CellType.WALL);
    expect(board.getCell(5, 5).type).toBe(CellType.WALL);
  });

  it('放置和查找实体', () => {
    const board = new Board(5, 5);
    board.setCell(2, 3, CellType.PLAYER, 'hero');
    const cell = board.findEntity('hero');
    expect(cell).not.toBeNull();
    expect(cell!.x).toBe(2);
    expect(cell!.y).toBe(3);
  });

  it('冲突检测：非空格不能再次放置', () => {
    const board = new Board(5, 5);
    expect(board.setCell(2, 2, CellType.PLAYER, 'p1')).toBe(true);
    expect(board.setCell(2, 2, CellType.ENEMY, 'e1')).toBe(false);
  });
});
