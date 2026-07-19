/**
 * CardDatabase.ts - 卡牌数据库
 */

import { CardTemplate, CardType, School, Rarity, TargetType } from './CardSystem';

// ====== 基础卡牌模板 ======

export const CardDatabase: Record<string, CardTemplate> = {
  // ====== 剑派攻击卡 ======
  strike: {
    id: 'strike',
    name: '斩击',
    cost: 1,
    type: CardType.ATTACK,
    school: School.SWORD,
    rarity: Rarity.COMMON,
    description: '造成 6 点伤害',
    targetType: TargetType.SINGLE_ENEMY,
    effects: [{ type: 'damage', base: 6 }],
    weight: 10,
  },

  heavyStrike: {
    id: 'heavyStrike',
    name: '重斩',
    cost: 2,
    type: CardType.ATTACK,
    school: School.SWORD,
    rarity: Rarity.COMMON,
    description: '造成 12 点伤害',
    targetType: TargetType.SINGLE_ENEMY,
    effects: [{ type: 'damage', base: 12 }],
    weight: 5,
  },

  quickSlash: {
    id: 'quickSlash',
    name: '快斩',
    cost: 0,
    type: CardType.ATTACK,
    school: School.SWORD,
    rarity: Rarity.COMMON,
    description: '造成 3 点伤害',
    targetType: TargetType.SINGLE_ENEMY,
    effects: [{ type: 'damage', base: 3 }],
    weight: 8,
  },

  cleave: {
    id: 'cleave',
    name: '横扫',
    cost: 2,
    type: CardType.ATTACK,
    school: School.SWORD,
    rarity: Rarity.RARE,
    description: '对所有敌人造成 8 点伤害',
    targetType: TargetType.ALL_ENEMIES,
    effects: [{ type: 'damage', base: 8 }],
    weight: 3,
  },

  // ====== 防御/技能卡 ======
  defend: {
    id: 'defend',
    name: '防御',
    cost: 1,
    type: CardType.SKILL,
    school: School.SHIELD,
    rarity: Rarity.COMMON,
    description: '获得 5 点护甲',
    targetType: TargetType.SELF,
    effects: [{ type: 'block', base: 5 }],
    weight: 10,
  },

  ironSkin: {
    id: 'ironSkin',
    name: '铁布衫',
    cost: 2,
    type: CardType.SKILL,
    school: School.SHIELD,
    rarity: Rarity.RARE,
    description: '获得 12 点护甲',
    targetType: TargetType.SELF,
    effects: [{ type: 'block', base: 12 }],
    weight: 3,
  },

  // ====== 法术/能力卡 ======
  meditate: {
    id: 'meditate',
    name: '冥想',
    cost: 1,
    type: CardType.POWER,
    school: School.SPELL,
    rarity: Rarity.RARE,
    description: '获得 1 层力量（永久）',
    targetType: TargetType.SELF,
    effects: [
      { type: 'apply_status', statusId: 'strength', amount: 1 },
    ],
    weight: 2,
  },

  healingLight: {
    id: 'healingLight',
    name: '治愈之光',
    cost: 2,
    type: CardType.SKILL,
    school: School.SPELL,
    rarity: Rarity.RARE,
    description: '恢复 8 点生命',
    targetType: TargetType.SELF,
    effects: [{ type: 'heal', base: 8 }],
    weight: 2,
  },

  // ====== 特殊机制卡 ======
  doubleStrike: {
    id: 'doubleStrike',
    name: '连斩',
    cost: 1,
    type: CardType.ATTACK,
    school: School.SWORD,
    rarity: Rarity.EPIC,
    description: '造成 4 点伤害 2 次',
    targetType: TargetType.SINGLE_ENEMY,
    effects: [{ type: 'damage', base: 4, count: 2 }],
    weight: 2,
  },

  exhaustStrike: {
    id: 'exhaustStrike',
    name: '破釜沉舟',
    cost: 1,
    type: CardType.ATTACK,
    school: School.SWORD,
    rarity: Rarity.EPIC,
    description: '造成 15 点伤害，消耗',
    targetType: TargetType.SINGLE_ENEMY,
    effects: [
      { type: 'damage', base: 15 },
      { type: 'exhaust' },
    ],
    weight: 1,
  },

  // ====== 基础牌组 ======
  defendUpgraded: {
    id: 'defendUpgraded',
    name: '防御+',
    cost: 1,
    type: CardType.SKILL,
    school: School.SHIELD,
    rarity: Rarity.COMMON,
    description: '获得 8 点护甲',
    targetType: TargetType.SELF,
    effects: [{ type: 'block', base: 8 }],
    weight: 0, // 不随机出现
  },

  strikeUpgraded: {
    id: 'strikeUpgraded',
    name: '斩击+',
    cost: 1,
    type: CardType.ATTACK,
    school: School.SWORD,
    rarity: Rarity.COMMON,
    description: '造成 9 点伤害',
    targetType: TargetType.SINGLE_ENEMY,
    effects: [{ type: 'damage', base: 9 }],
    weight: 0,
  },
};

/**
 * 创建初始牌组
 */
export function createStarterDeck(): CardTemplate[] {
  const deck: CardTemplate[] = [];

  // 5 张斩击
  for (let i = 0; i < 5; i++) deck.push(CardDatabase.strike);

  // 4 张防御
  for (let i = 0; i < 4; i++) deck.push(CardDatabase.defend);

  // 1 张快斩
  deck.push(CardDatabase.quickSlash);

  return deck;
}
