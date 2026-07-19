/**
 * ShopData.ts - 商店数据
 * 定义商品池、价格体系、随机生成逻辑
 */

import { CardDatabase } from '../cards/CardDatabase';
import { Rarity } from '../cards/CardSystem';

// 消耗品定义
export interface ConsumableItem {
  id: string;
  name: string;
  description: string;
  price: number;
  effect: (state: any) => void;
  condition?: (state: any) => boolean;
}

// 遗物定义
export interface RelicItem {
  id: string;
  name: string;
  description: string;
  price: number;
  effect: string; // 遗物效果标识符，BattleScene 中处理
}

// 消耗品池
export const CONSUMABLES: ConsumableItem[] = [
  {
    id: 'healthPotion',
    name: '生命药水',
    description: '恢复20点生命',
    price: 50,
    effect: (state) => { state.hp = Math.min(state.maxHp, state.hp + 20); },
  },
  {
    id: 'largeHealthPotion',
    name: '大生命药水',
    description: '恢复50点生命',
    price: 100,
    effect: (state) => { state.hp = Math.min(state.maxHp, state.hp + 50); },
  },
  {
    id: 'maxHpBoost',
    name: '墨池精华',
    description: '永久增加5点最大生命',
    price: 75,
    effect: (state) => { state.maxHp += 5; state.hp += 5; },
  },
  {
    id: 'apBoost',
    name: '灵墨丹',
    description: '永久增加1点最大行动点',
    price: 150,
    effect: (state) => { state.maxAp += 1; state.ap += 1; },
  },
  {
    id: 'fullRestore',
    name: '回春丹',
    description: '完全恢复生命',
    price: 200,
    effect: (state) => { state.hp = state.maxHp; },
  },
  {
    id: 'armorScroll',
    name: '护甲卷轴',
    description: '下场战斗开始时+15护甲',
    price: 60,
    effect: (state) => { state.startingArmor = (state.startingArmor || 0) + 15; },
  },
  {
    id: 'damageScroll',
    name: '力量卷轴',
    description: '下场战斗所有攻击+3伤害',
    price: 80,
    effect: (state) => { state.tempDamageBonus = (state.tempDamageBonus || 0) + 3; },
  },
];

// 遗物池（一次性购买，永久生效）
export const RELICS: RelicItem[] = [
  {
    id: 'inkStone',
    name: '墨砚',
    description: '每回合开始+1行动点',
    price: 200,
    effect: 'startTurn_ap+1',
  },
  {
    id: 'brushPen',
    name: '灵笔',
    description: '每回合多抽1张牌',
    price: 180,
    effect: 'startTurn_draw+1',
  },
  {
    id: 'inkBadge',
    name: '墨徽',
    description: '战斗开始时+10护甲',
    price: 150,
    effect: 'battleStart_armor+10',
  },
  {
    id: 'jadePendant',
    name: '玉佩',
    description: '击杀敌人时恢复5生命',
    price: 160,
    effect: 'onEnemyKill_heal+5',
  },
  {
    id: 'inkMirror',
    name: '墨镜',
    description: '每回合开始获得2点墨压',
    price: 220,
    effect: 'startTurn_inkCharge+2',
  },
  {
    id: 'dragonScale',
    name: '龙鳞',
    description: '受到伤害-2（最少1）',
    price: 250,
    effect: 'onDamageTaken_reduce-2',
  },
  {
    id: 'phoenixFeather',
    name: '凤羽',
    description: '生命低于30%时，攻击伤害+50%',
    price: 280,
    effect: 'lowHp_damageBoost+50%',
  },
  {
    id: 'tigerTalisman',
    name: '虎符',
    description: '商店物品价格-20%',
    price: 300,
    effect: 'shopPriceDiscount-20%',
  },
];

/**
 * 生成商店商品（卡牌+消耗品+遗物）
 * @param chapter 当前章节
 * @param playerRelics 玩家已拥有的遗物
 */
export function generateShopItems(chapter: number, playerRelics: string[] = []): {
  cards: Array<{ id: string; price: number }>;
  consumables: ConsumableItem[];
  relics: RelicItem[];
} {
  // 生成3张卡牌（按稀有度和章节）
  const allCards = Object.values(CardDatabase);
  const availableCards = allCards.filter(c => 
    c.id !== 'strike' && c.id !== 'defend' && c.id !== 'quickSlash'
  );

  // 按稀有度加权
  const rarityWeight: Record<Rarity, number> = {
    [Rarity.COMMON]: 50,
    [Rarity.RARE]: 35 + chapter * 2,
    [Rarity.EPIC]: 12 + chapter * 3,
    [Rarity.LEGENDARY]: 3 + chapter,
  };

  const cardPrices: Record<Rarity, number> = {
    [Rarity.COMMON]: 40 + chapter * 5,
    [Rarity.RARE]: 70 + chapter * 8,
    [Rarity.EPIC]: 120 + chapter * 12,
    [Rarity.LEGENDARY]: 200 + chapter * 20,
  };

  const selectedCards: Array<{ id: string; price: number }> = [];
  const cardPool = [...availableCards];

  for (let i = 0; i < 3 && cardPool.length > 0; i++) {
    const totalWeight = cardPool.reduce((sum, c) => sum + (rarityWeight[c.rarity] || 10), 0);
    let roll = Math.random() * totalWeight;

    for (let j = 0; j < cardPool.length; j++) {
      roll -= (rarityWeight[cardPool[j].rarity] || 10);
      if (roll <= 0) {
        selectedCards.push({
          id: cardPool[j].id,
          price: cardPrices[cardPool[j].rarity] || 50,
        });
        cardPool.splice(j, 1);
        break;
      }
    }
  }

  // 随机2-3个消耗品
  const numConsumables = 2 + Math.floor(Math.random() * 2);
  const selectedConsumables: ConsumableItem[] = [];
  const consumablePool = [...CONSUMABLES];

  for (let i = 0; i < numConsumables && consumablePool.length > 0; i++) {
    const idx = Math.floor(Math.random() * consumablePool.length);
    selectedConsumables.push(consumablePool[idx]);
    consumablePool.splice(idx, 1);
  }

  // 随机1-2个遗物（排除已拥有的）
  const availableRelics = RELICS.filter(r => !playerRelics.includes(r.id));
  const numRelics = Math.min(availableRelics.length, 1 + Math.floor(Math.random() * 2));
  const selectedRelics: RelicItem[] = [];
  const relicPool = [...availableRelics];

  for (let i = 0; i < numRelics && relicPool.length > 0; i++) {
    const idx = Math.floor(Math.random() * relicPool.length);
    selectedRelics.push(relicPool[idx]);
    relicPool.splice(idx, 1);
  }

  return {
    cards: selectedCards,
    consumables: selectedConsumables,
    relics: selectedRelics,
  };
}

/**
 * 应用虎符折扣（如果玩家有这个遗物）
 */
export function applyShopDiscount(price: number, playerRelics: string[]): number {
  if (playerRelics.includes('tigerTalisman')) {
    return Math.floor(price * 0.8);
  }
  return price;
}
