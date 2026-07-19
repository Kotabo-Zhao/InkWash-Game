/**
 * BattleEngine.ts - 回合制战斗引擎
 * 处理出牌、伤害结算、敌人行动、胜负判定
 */

import { Player } from '../core/Player';
import { Enemy } from '../core/Enemy';
import { DeckManager } from '../core/DeckManager';
import { Card, CardEffect } from '../cards/CardSystem';
import { createVulnerable, createWeak, createPoison } from '../core/StatusSystem';

export enum BattlePhase {
  PLAYER_TURN,
  ENEMY_TURN,
  BATTLE_END,
}

export interface BattleEvent {
  type: 'damage' | 'block' | 'heal' | 'status' | 'draw' | 'play' | 'enemy_action';
  source?: string;
  target?: string;
  value?: number;
  description: string;
}

export class BattleEngine {
  public player: Player;
  public enemies: Enemy[];
  public deck: DeckManager;
  public phase: BattlePhase = BattlePhase.PLAYER_TURN;
  public turnNumber = 1;
  public log: BattleEvent[] = [];

  constructor(player: Player, enemies: Enemy[], deck: DeckManager) {
    this.player = player;
    this.enemies = enemies;
    this.deck = deck;
  }

  /**
   * 开始战斗（初始化抽牌）
   */
  startBattle(initialDraw = 5): void {
    this.deck.draw(initialDraw);
    this.log.push({
      type: 'draw',
      value: initialDraw,
      description: `战斗开始，抽取 ${initialDraw} 张牌`,
    });
  }

  /**
   * 玩家出牌
   */
  playCard(cardIndex: number, targetEnemyIndex = 0): BattleEvent[] {
    const events: BattleEvent[] = [];
    const card = this.deck.hand[cardIndex];
    if (!card) return events;

    // 检查 AP
    if (!this.player.spendAp(card.cost)) {
      events.push({
        type: 'play',
        description: `AP 不足，无法打出 ${card.name}`,
      });
      return events;
    }

    // 执行卡牌效果
    for (const effect of card.effects) {
      const effectEvents = this.resolveEffect(effect, targetEnemyIndex);
      events.push(...effectEvents);
    }

    // 打出卡牌
    this.deck.play(cardIndex);

    events.push({
      type: 'play',
      source: card.name,
      description: `打出 ${card.name}`,
    });

    this.log.push(...events);
    return events;
  }

  /**
   * 解析单个效果
   */
  private resolveEffect(effect: CardEffect, targetIndex: number): BattleEvent[] {
    const events: BattleEvent[] = [];
    const times = effect.count ?? 1;

    for (let i = 0; i < times; i++) {
      switch (effect.type) {
        case 'damage': {
          const target = this.enemies[targetIndex];
          if (!target || !target.isAlive()) break;
          const damage = (effect.base ?? 0) + this.player.statusSystem.getStacks('strength');
          const actual = target.takeDamage(damage);
          events.push({
            type: 'damage',
            target: target.name,
            value: actual,
            description: `对 ${target.name} 造成 ${actual} 点伤害`,
          });
          break;
        }

        case 'block': {
          const block = effect.base ?? 0;
          this.player.gainArmor(block);
          events.push({
            type: 'block',
            value: block,
            description: `获得 ${block} 点护甲`,
          });
          break;
        }

        case 'heal': {
          const amount = effect.base ?? 0;
          this.player.heal(amount);
          events.push({
            type: 'heal',
            value: amount,
            description: `恢复 ${amount} 点生命`,
          });
          break;
        }

        case 'apply_status': {
          const amount = effect.amount ?? 1;
          const statusMap: Record<string, () => any> = {
            vulnerable: createVulnerable,
            weak: createWeak,
            poison: createPoison,
          };
          const factory = statusMap[effect.statusId ?? ''];
          if (factory) {
            const status = factory();
            status.stacks = amount;
            this.player.statusSystem.add(status);
            events.push({
              type: 'status',
              description: `获得 ${amount} 层 ${status.name}`,
            });
          }
          break;
        }
      }
    }

    return events;
  }

  /**
   * 结束玩家回合
   */
  endPlayerTurn(): void {
    this.player.onTurnEnd();
    this.deck.clearHand();
    this.phase = BattlePhase.ENEMY_TURN;
  }

  /**
   * 敌人行动
   */
  executeEnemyTurns(): BattleEvent[] {
    const events: BattleEvent[] = [];

    for (const enemy of this.enemies) {
      if (!enemy.isAlive()) continue;

      enemy.onTurnStart();
      const intent = enemy.intent;

      switch (intent.type) {
        case 'attack': {
          const damage = intent.value;
          const actual = this.player.takeDamage(damage);
          events.push({
            type: 'enemy_action',
            source: enemy.name,
            target: 'player',
            value: actual,
            description: `${enemy.name} 攻击，造成 ${actual} 点伤害`,
          });
          break;
        }

        case 'block': {
          enemy.gainArmor(intent.value);
          events.push({
            type: 'enemy_action',
            source: enemy.name,
            value: intent.value,
            description: `${enemy.name} 防御，获得 ${intent.value} 点护甲`,
          });
          break;
        }
      }

      enemy.onTurnEnd();
    }

    this.log.push(...events);

    // 检查胜负
    if (!this.player.isAlive()) {
      this.phase = BattlePhase.BATTLE_END;
    } else if (this.enemies.every(e => !e.isAlive())) {
      this.phase = BattlePhase.BATTLE_END;
    } else {
      this.phase = BattlePhase.PLAYER_TURN;
      this.turnNumber++;
      this.player.onTurnStart();
      this.deck.draw(5);
      events.push({
        type: 'draw',
        value: 5,
        description: `回合 ${this.turnNumber} 开始，抽取 5 张牌`,
      });
    }

    return events;
  }

  /**
   * 战斗是否结束
   */
  isBattleOver(): boolean {
    return this.phase === BattlePhase.BATTLE_END;
  }

  /**
   * 玩家是否胜利
   */
  isVictory(): boolean {
    return this.enemies.every(e => !e.isAlive());
  }
}
