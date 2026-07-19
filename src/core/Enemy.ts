/**
 * Enemy.ts - 敌人实体
 */

import { StatusSystem } from './StatusSystem';

export interface EnemyIntent {
  type: 'attack' | 'block' | 'buff' | 'debuff';
  value: number;
  description: string;
}

export class Enemy {
  public id: string;
  public name: string;
  public maxHp: number;
  public hp: number;
  public armor: number;
  public x: number;
  public y: number;
  public statusSystem: StatusSystem;
  public intent: EnemyIntent;
  public patterns: EnemyIntent[];
  public patternIndex: number;

  constructor(id: string, name: string, hp = 30, patterns?: EnemyIntent[]) {
    this.id = id;
    this.name = name;
    this.maxHp = hp;
    this.hp = hp;
    this.armor = 0;
    this.x = 2;
    this.y = 1;
    this.statusSystem = new StatusSystem();
    this.patterns = patterns || this.getDefaultPatterns();
    this.patternIndex = 0;
    this.intent = this.patterns[0];
  }

  private getDefaultPatterns(): EnemyIntent[] {
    return [
      { type: 'attack', value: 6, description: '斩击 6' },
      { type: 'block', value: 4, description: '防御 4' },
      { type: 'attack', value: 8, description: '重斩 8' },
    ];
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

  gainArmor(amount: number): void {
    this.armor += amount;
  }

  onTurnStart(): void {
    this.armor = 0;
  }

  onTurnEnd(): void {
    this.patternIndex = (this.patternIndex + 1) % this.patterns.length;
    this.intent = this.patterns[this.patternIndex];
  }

  isAlive(): boolean {
    return this.hp > 0;
  }
}
