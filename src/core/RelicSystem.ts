/**
 * RelicSystem.ts - 遗物效果系统
 * 处理遗物的各种触发效果
 */

import { Player } from './Player';
import { Enemy } from './Enemy';
import { DeckManager } from './DeckManager';

export interface RelicEffect {
  id: string;
  name: string;
  description: string;
}

/**
 * 遗物定义
 */
export const RELICS: Record<string, RelicEffect> = {
  inkStone: {
    id: 'inkStone',
    name: '墨砚',
    description: '每回合开始+1行动点',
  },
  brushPen: {
    id: 'brushPen',
    name: '灵笔',
    description: '每回合多抽1张牌',
  },
  inkBadge: {
    id: 'inkBadge',
    name: '墨徽',
    description: '战斗开始时+10护甲',
  },
  jadePendant: {
    id: 'jadePendant',
    name: '玉佩',
    description: '击杀敌人时恢复5生命',
  },
  inkMirror: {
    id: 'inkMirror',
    name: '墨镜',
    description: '每回合开始获得2点墨压',
  },
  dragonScale: {
    id: 'dragonScale',
    name: '龙鳞',
    description: '受到伤害-2（最少1）',
  },
  phoenixFeather: {
    id: 'phoenixFeather',
    name: '凤羽',
    description: '生命低于30%时，攻击伤害+50%',
  },
  tigerTalisman: {
    id: 'tigerTalisman',
    name: '虎符',
    description: '商店物品价格-20%',
  },
};

/**
 * 遗物系统
 */
export class RelicSystem {
  private relics: string[] = [];

  constructor(relicIds: string[] = []) {
    this.relics = [...relicIds];
  }

  /**
   * 获取玩家拥有的遗物列表
   */
  getRelics(): string[] {
    return [...this.relics];
  }

  /**
   * 添加遗物
   */
  addRelic(relicId: string): void {
    if (!this.relics.includes(relicId)) {
      this.relics.push(relicId);
    }
  }

  /**
   * 是否拥有某遗物
   */
  hasRelic(relicId: string): boolean {
    return this.relics.includes(relicId);
  }

  /**
   * 战斗开始时触发
   */
  onBattleStart(player: Player, events: string[]): void {
    if (this.hasRelic('inkBadge')) {
      player.gainArmor(10);
      events.push('遗物 [墨徽]: +10 护甲');
    }
  }

  /**
   * 回合开始时触发
   */
  onTurnStart(player: Player, deck: DeckManager, board: any, events: string[]): void {
    if (this.hasRelic('inkStone')) {
      player.gainAp(1);
      events.push('遗物 [墨砚]: +1 行动点');
    }
    if (this.hasRelic('brushPen')) {
      deck.draw(1);
      events.push('遗物 [灵笔]: 抽1张牌');
    }
    if (this.hasRelic('inkMirror')) {
      board.addInkCharge(2);
      events.push('遗物 [墨镜]: +2 墨压');
    }
  }

  /**
   * 敌人被击杀时触发
   */
  onEnemyKilled(player: Player, events: string[]): void {
    if (this.hasRelic('jadePendant')) {
      const heal = 5;
      const actualHeal = Math.min(heal, player.maxHp - player.hp);
      if (actualHeal > 0) {
        player.heal(actualHeal);
        events.push(`遗物 [玉佩]: 恢复 ${actualHeal} 生命`);
      }
    }
  }

  /**
   * 受到伤害时触发，返回修正后的伤害值
   */
  onDamageTaken(damage: number, player: Player, events: string[]): number {
    if (this.hasRelic('dragonScale')) {
      const reduced = Math.max(1, damage - 2);
      if (reduced < damage) {
        events.push(`遗物 [龙鳞]: 伤害 ${damage} → ${reduced}`);
      }
      return reduced;
    }
    return damage;
  }

  /**
   * 计算伤害时触发，返回修正后的伤害值
   */
  onDealDamage(baseDamage: number, player: Player, events: string[]): number {
    if (this.hasRelic('phoenixFeather')) {
      const threshold = player.maxHp * 0.3;
      if (player.hp < threshold) {
        const boosted = Math.floor(baseDamage * 1.5);
        events.push(`遗物 [凤羽]: 伤害 ${baseDamage} → ${boosted}`);
        return boosted;
      }
    }
    return baseDamage;
  }

  /**
   * 商店价格修正
   */
  applyShopDiscount(price: number): number {
    if (this.hasRelic('tigerTalisman')) {
      return Math.floor(price * 0.8);
    }
    return price;
  }
}
