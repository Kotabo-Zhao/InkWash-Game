export enum CellType {
  EMPTY, WALL, PLAYER, ENEMY, TREASURE, OBSTACLE,
}

export interface Cell {
  type: CellType;
  x: number;
  y: number;
  entityId?: string;
}

export class Board {
  private grid: Cell[][] = [];
  readonly rows: number;
  readonly cols: number;

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    for (let r = 0; r < rows; r++) {
      this.grid[r] = [];
      for (let c = 0; c < cols; c++) {
        this.grid[r][c] = { type: CellType.EMPTY, x: c, y: r };
      }
    }
  }

  getCell(x: number, y: number): Cell {
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) {
      return { type: CellType.WALL, x, y };
    }
    return this.grid[y][x];
  }

  setCell(x: number, y: number, type: CellType, entityId?: string): boolean {
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return false;
    if (this.grid[y][x].type !== CellType.EMPTY && type !== CellType.EMPTY) return false;
    this.grid[y][x] = { type, x, y, entityId };
    return true;
  }

  getAdjacent(x: number, y: number): Cell[] {
    const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    return dirs
      .map(([dx, dy]) => this.getCell(x + dx, y + dy))
      .filter(c => c.type !== CellType.WALL);
  }

  findEntity(entityId: string): Cell | null {
    for (const row of this.grid) {
      const found = row.find(c => c.entityId === entityId);
      if (found) return found;
    }
    return null;
  }

  clear(): void {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c].type === CellType.EMPTY) continue;
        this.grid[r][c] = { type: CellType.EMPTY, x: c, y: r };
      }
    }
  }
}
