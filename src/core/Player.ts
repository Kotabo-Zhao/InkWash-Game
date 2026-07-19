/**
 * Player.ts - 玩家实体
 */

import { StatusSystem } from './StatusSystem';

export class Player {
  public maxHp: number;
  public hp: number;
  public maxAp: number;
  public ap: number;
  public armor: number;
  public x: number;
  public y: number;
  public statusSystem: StatusSystem;

  constructor(hp = 60, maxAp = 3) {
    this.maxHp = hp;
    this.hp = hp;
    this.maxAp = maxAp;
    this.ap = maxAp;
    this.armor = 0;
    this.x = 2;
    this.y = 4;
    this.statusSystem = new StatusSystem();
  }

  takeDamage(amount: number): number {
    const actual = Math.max(0, amount - this.armor);
    this.armor = Math.max(0, this.armor - amount);
    this.hp = Math.max(0, this.hp - actual);
    return actual;
  }

  heal(amount: number): void {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  spendAp(cost: number): boolean {
    if (this.ap < cost) return false;
    this.ap -= cost;
    return true;
  }

  gainArmor(amount: number): void {
    this.armor += amount;
  }

  gainAp(amount: number): void {
    this.ap += amount;
  }

  onTurnStart(): void {
    this.ap = this.maxAp;
    this.armor = 0;
  }

  onTurnEnd(): void {
    // 状态衰减、回合结算逻辑
  }

  isAlive(): boolean {
    return this.hp > 0;
  }

  moveTo(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
}
