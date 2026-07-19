/**
 * BattleEngine.ts - 回合制战斗引擎
 * 整合棋道系统：每张牌打出后需要在棋盘上落子
 * 位置决定效果加成，这是墨境棋局的核心玩法
 */

import { Player } from '../core/Player';
import { Enemy } from '../core/Enemy';
import { DeckManager } from '../core/DeckManager';
import { Card, CardEffect, CardType } from '../cards/CardSystem';
import { createVulnerable, createWeak, createPoison, createStrength } from '../core/StatusSystem';
import { BoardBattle, Formation, PositionType } from '../core/BoardBattle';

export enum BattlePhase {
  PLAYER_TURN,
  ENEMY_TURN,
  BATTLE_END,
}

export interface BattleEvent {
  type: 'damage' | 'block' | 'heal' | 'status' | 'draw' | 'play' | 'enemy_action' | 'ink_stone' | 'formation' | 'position_bonus' | 'ink_charge';
  source?: string;
  target?: string;
  value?: number;
  x?: number;
  y?: number;
  description: string;
}

export interface CardPlayResult {
  events: BattleEvent[];
  stonePosition?: { x: number; y: number };
  positionBonus?: {
    damageMultiplier: number;
    blockBonus: number;
    drawBonus: number;
    description: string;
  };
  formations?: Array<{
    formation: Formation;
    effect: string;
    damageBonus?: number;
    blockBonus?: number;
    drawBonus?: number;
    inkChargeBonus?: number;
    strengthBonus?: number;
  }>;
}

export class BattleEngine {
  public player: Player;
  public enemies: Enemy[];
  public deck: DeckManager;
  public board: BoardBattle;
  public phase: BattlePhase = BattlePhase.PLAYER_TURN;
  public turnNumber = 1;
  public log: BattleEvent[] = [];
  public consecutiveAttacks = 0;
  public pendingCardIndex: number | null = null; // 等待落子的卡牌

  constructor(player: Player, enemies: Enemy[], deck: DeckManager) {
    this.player = player;
    this.enemies = enemies;
    this.deck = deck;
    this.board = new BoardBattle();
  }

  /**
   * 开始战斗（初始化抽牌）
   */
  startBattle(initialDraw = 5): void {
    this.deck.draw(initialDraw);
    this.board.reset();
    this.log.push({
      type: 'draw',
      value: initialDraw,
      description: `战斗开始，抽取 ${initialDraw} 张牌`,
    });
  }

  /**
   * 玩家选择打出卡牌（进入落子阶段）
   */
  selectCard(cardIndex: number): BattleEvent[] {
    const events: BattleEvent[] = [];
    const card = this.deck.hand[cardIndex];
    if (!card) return events;

    if (!this.player.spendAp(card.cost)) {
      events.push({
        type: 'play',
        description: `AP 不足，无法打出 ${card.name}`,
      });
      return events;
    }

    // 进入落子等待状态
    this.pendingCardIndex = cardIndex;
    events.push({
      type: 'play',
      source: card.name,
      description: `选择 ${card.name}，请在棋盘上落子`,
    });

    return events;
  }

  /**
   * 玩家在棋盘上落子（完成出牌）
   */
  playCardAtPosition(cardIndex: number, x: number, y: number, targetEnemyIndex = 0): CardPlayResult {
    const result: CardPlayResult = { events: [] };
    const card = this.deck.hand[cardIndex];
    if (!card) return result;

    // 检查位置是否可用
    if (!this.board.isEmpty(x, y)) {
      result.events.push({
        type: 'play',
        description: `位置 (${x},${y}) 已被占据`,
      });
      // 返还AP
      this.player.ap += card.cost;
      return result;
    }

    // 获取位置加成
    const posBonus = this.board.getPositionBonus(x, y, card.type);
    result.positionBonus = posBonus;

    // 落子
    this.board.placeStone(x, y, 'player', card.id, card.name, this.turnNumber);
    result.stonePosition = { x, y };

    result.events.push({
      type: 'ink_stone',
      source: card.name,
      x,
      y,
      description: `落子 ${card.name} 于 (${x},${y})`,
    });

    // 墨压增加
    result.events.push({
      type: 'ink_charge',
      value: this.board.inkCharge,
      description: `墨压: ${this.board.inkCharge}/${this.board.maxInkCharge}`,
    });

    // 执行卡牌效果（带位置加成）
    for (const effect of card.effects) {
      const effectEvents = this.resolveEffectWithBonus(effect, targetEnemyIndex, card, posBonus);
      result.events.push(...effectEvents);
    }

    // 连击系统：连续出攻击牌+2伤害
    if (card.type === 'ATTACK') {
      this.consecutiveAttacks++;
    } else {
      this.consecutiveAttacks = 0;
    }

    // 打出卡牌
    this.deck.play(cardIndex);
    this.pendingCardIndex = null;

    // 位置加成额外抽牌
    if (posBonus.drawBonus > 0) {
      this.deck.draw(posBonus.drawBonus);
      result.events.push({
        type: 'draw',
        value: posBonus.drawBonus,
        description: `位置加成: +${posBonus.drawBonus} 抽牌`,
      });
    }

    // 位置加成额外护甲
    if (posBonus.blockBonus > 0) {
      this.player.gainArmor(posBonus.blockBonus);
      result.events.push({
        type: 'block',
        value: posBonus.blockBonus,
        description: `位置加成: +${posBonus.blockBonus} 护甲`,
      });
    }

    // 检测阵型
    const formations = this.board.detectFormations('player');
    if (formations.length > 0) {
      result.formations = formations;
      for (const f of formations) {
        if (f.strengthBonus) {
          this.player.statusSystem.add(createStrength());
          this.player.statusSystem.add({ ...createStrength(), stacks: f.strengthBonus - 1 });
          result.events.push({
            type: 'formation',
            description: `阵型: ${f.effect}`,
          });
        }
        if (f.blockBonus) {
          this.player.gainArmor(f.blockBonus);
          result.events.push({
            type: 'formation',
            description: `阵型: ${f.effect}`,
          });
        }
        if (f.drawBonus) {
          this.deck.draw(f.drawBonus);
          result.events.push({
            type: 'formation',
            description: `阵型: ${f.effect}`,
          });
        }
        if (f.inkChargeBonus) {
          this.board.addInkCharge(f.inkChargeBonus);
          result.events.push({
            type: 'formation',
            description: `阵型: ${f.effect}`,
          });
        }
      }
    }

    result.events.push({
      type: 'play',
      source: card.name,
      description: `打出 ${card.name}`,
    });

    this.log.push(...result.events);
    return result;
  }

  /**
   * 墨压终极技：墨染乾坤
   */
  useInkUltimate(): BattleEvent[] {
    const events: BattleEvent[] = [];
    if (!this.board.isInkFull()) {
      events.push({
        type: 'ink_charge',
        description: `墨压不足: ${this.board.inkCharge}/${this.board.maxInkCharge}`,
      });
      return events;
    }

    this.board.spendInkCharge(this.board.maxInkCharge);

    // 全屏伤害：对所有敌人造成20点伤害
    for (const enemy of this.enemies) {
      if (!enemy.isAlive()) continue;
      const damage = 20;
      const actual = enemy.takeDamage(damage);
      events.push({
        type: 'damage',
        target: enemy.name,
        value: actual,
        description: `墨染乾坤！对 ${enemy.name} 造成 ${actual} 点伤害`,
      });
    }

    // 清空棋盘
    this.board.clearAll();
    events.push({
      type: 'ink_charge',
      value: 0,
      description: '墨压释放，棋盘清空',
    });

    this.log.push(...events);
    return events;
  }

  /**
   * 解析单个效果（带位置加成）
   */
  private resolveEffectWithBonus(effect: CardEffect, targetIndex: number, card?: Card, posBonus?: any): BattleEvent[] {
    const events: BattleEvent[] = [];
    const times = effect.count ?? 1;

    for (let i = 0; i < times; i++) {
      switch (effect.type) {
        case 'damage': {
          const target = this.enemies[targetIndex];
          if (!target || !target.isAlive()) break;
          let damage = (effect.base ?? 0) + this.player.statusSystem.getStacks('strength');

          // 连击加成：连续攻击牌+2伤害
          if (card?.type === 'ATTACK' && this.consecutiveAttacks > 0) {
            damage += 2;
          }

          // 位置加成：伤害倍率
          if (posBonus && posBonus.damageMultiplier > 1) {
            damage = Math.floor(damage * posBonus.damageMultiplier);
          }

          // 虚弱状态：伤害-30%
          if (this.player.statusSystem.has('weak')) {
            damage = Math.floor(damage * 0.7);
          }

          // 易伤状态：受到伤害+50%
          if (target.statusSystem.has('vulnerable')) {
            damage = Math.floor(damage * 1.5);
          }

          const actual = target.takeDamage(damage);
          events.push({
            type: 'damage',
            target: target.name,
            value: actual,
            description: `对 ${target.name} 造成 ${actual} 点伤害${posBonus?.damageMultiplier > 1 ? ' (位置加成)' : ''}`,
          });
          break;
        }

        case 'block': {
          let block = effect.base ?? 0;
          // 位置加成已在外面处理
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
            strength: createStrength,
          };
          const factory = statusMap[effect.statusId ?? ''];
          if (factory) {
            const status = factory();
            status.stacks = amount;
            // 给敌人上debuff，给自己上buff
            if (status.type === 'debuff' && effect.statusId !== 'strength') {
              const target = this.enemies[targetIndex];
              if (target) target.statusSystem.add(status);
            } else {
              this.player.statusSystem.add(status);
            }
            events.push({
              type: 'status',
              description: `${status.type === 'buff' ? '获得' : '施加'} ${amount} 层 ${status.name}`,
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
    this.consecutiveAttacks = 0;
    this.pendingCardIndex = null;
  }

  /**
   * 敌人行动（也会落子）
   */
  executeEnemyTurns(): BattleEvent[] {
    const events: BattleEvent[] = [];

    for (const enemy of this.enemies) {
      if (!enemy.isAlive()) continue;

      enemy.onTurnStart();
      const intent = enemy.intent;

      // 敌人落子
      const placement = this.board.getEnemyPlacement(intent.type === 'attack' ? CardType.ATTACK : CardType.SKILL);
      if (placement) {
        this.board.placeStone(placement.x, placement.y, 'enemy', undefined, enemy.name, this.turnNumber);
        events.push({
          type: 'ink_stone',
          source: enemy.name,
          x: placement.x,
          y: placement.y,
          description: `${enemy.name} 落子于 (${placement.x},${placement.y})`,
        });
      }

      switch (intent.type) {
        case 'attack': {
          let damage = intent.value;

          // 敌人虚弱：伤害-30%
          if (enemy.statusSystem.has('weak')) {
            damage = Math.floor(damage * 0.7);
          }

          // 玩家易伤：受到伤害+50%
          if (this.player.statusSystem.has('vulnerable')) {
            damage = Math.floor(damage * 1.5);
          }

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

        case 'buff': {
          enemy.statusSystem.add(createStrength());
          events.push({
            type: 'enemy_action',
            source: enemy.name,
            description: `${enemy.name} 蓄力，力量+1`,
          });
          break;
        }

        case 'debuff': {
          this.player.statusSystem.add(createWeak());
          events.push({
            type: 'enemy_action',
            source: enemy.name,
            description: `${enemy.name} 施法，你获得虚弱`,
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

  /**
   * 是否有卡牌正在等待落子
   */
  hasPendingCard(): boolean {
    return this.pendingCardIndex !== null;
  }

  getPendingCard(): Card | null {
    if (this.pendingCardIndex === null) return null;
    return this.deck.hand[this.pendingCardIndex] || null;
  }
}
