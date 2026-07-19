/**
 * CardDatabase.ts - 扩展版卡牌数据库
 * 40+ 种卡牌，覆盖攻击/防御/技能/能力四大类
 */

import { CardTemplate, CardType, School, Rarity, TargetType } from './CardSystem';

// ====== 卡牌数据库 ======

export const CardDatabase: Record<string, CardTemplate> = {
  // ==================== 基础卡牌 ====================
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
    weight: 0, // 升级获得
  },

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
    weight: 0, // 升级获得
  },

  // ==================== 攻击卡 - 剑派 (15种) ====================
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

  doubleStrike: {
    id: 'doubleStrike',
    name: '连斩',
    cost: 1,
    type: CardType.ATTACK,
    school: School.SWORD,
    rarity: Rarity.RARE,
    description: '造成 4 点伤害 2 次',
    targetType: TargetType.SINGLE_ENEMY,
    effects: [{ type: 'damage', base: 4, count: 2 }],
    weight: 4,
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

  piercingStrike: {
    id: 'piercingStrike',
    name: '穿甲刺',
    cost: 1,
    type: CardType.ATTACK,
    school: School.SWORD,
    rarity: Rarity.COMMON,
    description: '造成 5 点伤害，无视护甲',
    targetType: TargetType.SINGLE_ENEMY,
    effects: [{ type: 'damage', base: 5, ignoreArmor: true }],
    weight: 6,
  },

  whirlwindSlash: {
    id: 'whirlwindSlash',
    name: '旋风斩',
    cost: 1,
    type: CardType.ATTACK,
    school: School.SWORD,
    rarity: Rarity.COMMON,
    description: '造成 4 点伤害，随机攻击 2 次',
    targetType: TargetType.RANDOM_ENEMY,
    effects: [{ type: 'damage', base: 4, count: 2 }],
    weight: 6,
  },

  decisiveBlow: {
    id: 'decisiveBlow',
    name: '致命一击',
    cost: 2,
    type: CardType.ATTACK,
    school: School.SWORD,
    rarity: Rarity.RARE,
    description: '造成 10 点伤害，若敌人生命<30%则翻倍',
    targetType: TargetType.SINGLE_ENEMY,
    effects: [{ type: 'damage', base: 10, executeThreshold: 0.3 }],
    weight: 3,
  },

  inkBlade: {
    id: 'inkBlade',
    name: '墨刃',
    cost: 1,
    type: CardType.ATTACK,
    school: School.SWORD,
    rarity: Rarity.COMMON,
    description: '造成 6 点伤害，获得 1 层力量',
    targetType: TargetType.SINGLE_ENEMY,
    effects: [
      { type: 'damage', base: 6 },
      { type: 'apply_status', statusId: 'strength', amount: 1 },
    ],
    weight: 5,
  },

  shadowStep: {
    id: 'shadowStep',
    name: '影步突袭',
    cost: 1,
    type: CardType.ATTACK,
    school: School.SWORD,
    rarity: Rarity.RARE,
    description: '造成 7 点伤害，抽 1 张牌',
    targetType: TargetType.SINGLE_ENEMY,
    effects: [
      { type: 'damage', base: 7 },
      { type: 'draw', amount: 1 },
    ],
    weight: 4,
  },

  inkSplash: {
    id: 'inkSplash',
    name: '墨溅',
    cost: 0,
    type: CardType.ATTACK,
    school: School.SWORD,
    rarity: Rarity.COMMON,
    description: '造成 2 点伤害，施加 1 层易伤',
    targetType: TargetType.SINGLE_ENEMY,
    effects: [
      { type: 'damage', base: 2 },
      { type: 'apply_status', statusId: 'vulnerable', amount: 1 },
    ],
    weight: 7,
  },

  tripleThrust: {
    id: 'tripleThrust',
    name: '三连刺',
    cost: 2,
    type: CardType.ATTACK,
    school: School.SWORD,
    rarity: Rarity.RARE,
    description: '造成 3 点伤害 3 次',
    targetType: TargetType.SINGLE_ENEMY,
    effects: [{ type: 'damage', base: 3, count: 3 }],
    weight: 3,
  },

  inkStorm: {
    id: 'inkStorm',
    name: '墨雨',
    cost: 3,
    type: CardType.ATTACK,
    school: School.SWORD,
    rarity: Rarity.EPIC,
    description: '对所有敌人造成 12 点伤害，消耗',
    targetType: TargetType.ALL_ENEMIES,
    effects: [
      { type: 'damage', base: 12 },
      { type: 'exhaust' },
    ],
    weight: 1,
  },

  counterStrike: {
    id: 'counterStrike',
    name: '反击',
    cost: 1,
    type: CardType.ATTACK,
    school: School.SWORD,
    rarity: Rarity.COMMON,
    description: '造成 5 点伤害，若本回合受到攻击则+5',
    targetType: TargetType.SINGLE_ENEMY,
    effects: [{ type: 'damage', base: 5, counterBonus: 5 }],
    weight: 6,
  },

  // ==================== 防御卡 - 盾派 (10种) ====================
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

  shieldBash: {
    id: 'shieldBash',
    name: '盾击',
    cost: 1,
    type: CardType.ATTACK,
    school: School.SHIELD,
    rarity: Rarity.COMMON,
    description: '造成 4 点伤害，获得 4 点护甲',
    targetType: TargetType.SINGLE_ENEMY,
    effects: [
      { type: 'damage', base: 4 },
      { type: 'block', base: 4 },
    ],
    weight: 7,
  },

  inkBarrier: {
    id: 'inkBarrier',
    name: '墨障',
    cost: 1,
    type: CardType.SKILL,
    school: School.SHIELD,
    rarity: Rarity.COMMON,
    description: '获得 6 点护甲，抽 1 张牌',
    targetType: TargetType.SELF,
    effects: [
      { type: 'block', base: 6 },
      { type: 'draw', amount: 1 },
    ],
    weight: 5,
  },

  fortress: {
    id: 'fortress',
    name: '堡垒',
    cost: 3,
    type: CardType.SKILL,
    school: School.SHIELD,
    rarity: Rarity.RARE,
    description: '获得 20 点护甲，消耗',
    targetType: TargetType.SELF,
    effects: [
      { type: 'block', base: 20 },
      { type: 'exhaust' },
    ],
    weight: 2,
  },

  reflectiveArmor: {
    id: 'reflectiveArmor',
    name: '反甲',
    cost: 2,
    type: CardType.SKILL,
    school: School.SHIELD,
    rarity: Rarity.RARE,
    description: '获得 8 点护甲，本回合受到伤害时反弹 3 点',
    targetType: TargetType.SELF,
    effects: [
      { type: 'block', base: 8 },
      { type: 'apply_status', statusId: 'thorns', amount: 3 },
    ],
    weight: 3,
  },

  inkWall: {
    id: 'inkWall',
    name: '墨墙',
    cost: 2,
    type: CardType.SKILL,
    school: School.SHIELD,
    rarity: Rarity.COMMON,
    description: '获得 10 点护甲，护甲保留到下一回合',
    targetType: TargetType.SELF,
    effects: [
      { type: 'block', base: 10 },
      { type: 'retain_armor' },
    ],
    weight: 5,
  },

  phalanx: {
    id: 'phalanx',
    name: '方阵',
    cost: 2,
    type: CardType.SKILL,
    school: School.SHIELD,
    rarity: Rarity.RARE,
    description: '获得 8 点护甲，所有敌人受到 4 点伤害',
    targetType: TargetType.SELF,
    effects: [
      { type: 'block', base: 8 },
      { type: 'damage_all', base: 4 },
    ],
    weight: 3,
  },

  inkAbsorb: {
    id: 'inkAbsorb',
    name: '墨吸',
    cost: 1,
    type: CardType.SKILL,
    school: School.SHIELD,
    rarity: Rarity.COMMON,
    description: '获得 5 点护甲，每有 1 层力量额外+2',
    targetType: TargetType.SELF,
    effects: [{ type: 'block', base: 5, strengthBonus: 2 }],
    weight: 6,
  },

  defensiveStance: {
    id: 'defensiveStance',
    name: '防御姿态',
    cost: 0,
    type: CardType.SKILL,
    school: School.SHIELD,
    rarity: Rarity.COMMON,
    description: '获得 3 点护甲，消耗',
    targetType: TargetType.SELF,
    effects: [
      { type: 'block', base: 3 },
      { type: 'exhaust' },
    ],
    weight: 7,
  },

  inkFortification: {
    id: 'inkFortification',
    name: '墨固',
    cost: 2,
    type: CardType.SKILL,
    school: School.SHIELD,
    rarity: Rarity.RARE,
    description: '获得 15 点护甲，本回合无法攻击',
    targetType: TargetType.SELF,
    effects: [
      { type: 'block', base: 15 },
      { type: 'apply_status', statusId: 'cannot_attack', amount: 1 },
    ],
    weight: 2,
  },

  // ==================== 技能卡 - 法派 (10种) ====================
  meditate: {
    id: 'meditate',
    name: '冥想',
    cost: 1,
    type: CardType.POWER,
    school: School.SPELL,
    rarity: Rarity.RARE,
    description: '获得 1 层力量（永久）',
    targetType: TargetType.SELF,
    effects: [{ type: 'apply_status', statusId: 'strength', amount: 1 }],
    weight: 3,
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
    weight: 3,
  },

  inkInsight: {
    id: 'inkInsight',
    name: '墨悟',
    cost: 1,
    type: CardType.SKILL,
    school: School.SPELL,
    rarity: Rarity.COMMON,
    description: '抽 3 张牌',
    targetType: TargetType.SELF,
    effects: [{ type: 'draw', amount: 3 }],
    weight: 5,
  },

  focus: {
    id: 'focus',
    name: '凝神',
    cost: 1,
    type: CardType.SKILL,
    school: School.SPELL,
    rarity: Rarity.COMMON,
    description: '本回合 AP +1',
    targetType: TargetType.SELF,
    effects: [{ type: 'gain_ap', amount: 1 }],
    weight: 6,
  },

  inkMeditation: {
    id: 'inkMeditation',
    name: '墨定',
    cost: 2,
    type: CardType.POWER,
    school: School.SPELL,
    rarity: Rarity.EPIC,
    description: '获得 2 层力量，消耗',
    targetType: TargetType.SELF,
    effects: [
      { type: 'apply_status', statusId: 'strength', amount: 2 },
      { type: 'exhaust' },
    ],
    weight: 1,
  },

  massHeal: {
    id: 'massHeal',
    name: '群愈',
    cost: 3,
    type: CardType.SKILL,
    school: School.SPELL,
    rarity: Rarity.RARE,
    description: '恢复 15 点生命，消耗',
    targetType: TargetType.SELF,
    effects: [
      { type: 'heal', base: 15 },
      { type: 'exhaust' },
    ],
    weight: 2,
  },

  inkDraw: {
    id: 'inkDraw',
    name: '墨引',
    cost: 0,
    type: CardType.SKILL,
    school: School.SPELL,
    rarity: Rarity.COMMON,
    description: '抽 1 张牌',
    targetType: TargetType.SELF,
    effects: [{ type: 'draw', amount: 1 }],
    weight: 8,
  },

  quickStudy: {
    id: 'quickStudy',
    name: '速学',
    cost: 1,
    type: CardType.SKILL,
    school: School.SPELL,
    rarity: Rarity.RARE,
    description: '抽 2 张牌，本回合 AP +1',
    targetType: TargetType.SELF,
    effects: [
      { type: 'draw', amount: 2 },
      { type: 'gain_ap', amount: 1 },
    ],
    weight: 3,
  },

  inkFlow: {
    id: 'inkFlow',
    name: '墨流',
    cost: 1,
    type: CardType.POWER,
    school: School.SPELL,
    rarity: Rarity.RARE,
    description: '每回合开始抽 1 张额外牌',
    targetType: TargetType.SELF,
    effects: [{ type: 'apply_status', statusId: 'extra_draw', amount: 1 }],
    weight: 2,
  },

  transcendence: {
    id: 'transcendence',
    name: '超越',
    cost: 4,
    type: CardType.SKILL,
    school: School.SPELL,
    rarity: Rarity.EPIC,
    description: '本回合 AP +3，抽 3 张牌，消耗',
    targetType: TargetType.SELF,
    effects: [
      { type: 'gain_ap', amount: 3 },
      { type: 'draw', amount: 3 },
      { type: 'exhaust' },
    ],
    weight: 1,
  },

  // ==================== 特殊卡 (5种) ====================
  inkUltimate: {
    id: 'inkUltimate',
    name: '墨染乾坤',
    cost: 0,
    type: CardType.ATTACK,
    school: School.SWORD,
    rarity: Rarity.LEGENDARY,
    description: '对所有敌人造成 20 点伤害，需要墨压满',
    targetType: TargetType.ALL_ENEMIES,
    effects: [{ type: 'damage', base: 20, requireInkCharge: 100 }],
    weight: 0, // 只能通过墨压系统获得
  },

  inkSacrifice: {
    id: 'inkSacrifice',
    name: '墨祭',
    cost: 0,
    type: CardType.SKILL,
    school: School.SPELL,
    rarity: Rarity.RARE,
    description: '失去 5 点生命，抽 3 张牌',
    targetType: TargetType.SELF,
    effects: [
      { type: 'damage_self', base: 5 },
      { type: 'draw', amount: 3 },
    ],
    weight: 2,
  },

  inkBalance: {
    id: 'inkBalance',
    name: '墨衡',
    cost: 1,
    type: CardType.SKILL,
    school: School.SPELL,
    rarity: Rarity.COMMON,
    description: '手牌数=5时，抽 2 张牌',
    targetType: TargetType.SELF,
    effects: [{ type: 'draw', base: 2, requireHandSize: 5 }],
    weight: 5,
  },

  inkEcho: {
    id: 'inkEcho',
    name: '墨响',
    cost: 1,
    type: CardType.SKILL,
    school: School.SPELL,
    rarity: Rarity.RARE,
    description: '复制上一张打出的牌的效果',
    targetType: TargetType.SELF,
    effects: [{ type: 'echo_last_card' }],
    weight: 2,
  },

  inkReset: {
    id: 'inkReset',
    name: '墨归',
    cost: 2,
    type: CardType.SKILL,
    school: School.SPELL,
    rarity: Rarity.RARE,
    description: '弃牌堆随机 2 张牌回到手牌',
    targetType: TargetType.SELF,
    effects: [{ type: 'retrieve_from_discard', amount: 2 }],
    weight: 3,
  },

  // ==================== 升级版本 ====================
  quickSlashUpgraded: {
    id: 'quickSlashUpgraded',
    name: '快斩+',
    cost: 0,
    type: CardType.ATTACK,
    school: School.SWORD,
    rarity: Rarity.COMMON,
    description: '造成 5 点伤害',
    targetType: TargetType.SINGLE_ENEMY,
    effects: [{ type: 'damage', base: 5 }],
    weight: 0,
  },

  heavyStrikeUpgraded: {
    id: 'heavyStrikeUpgraded',
    name: '重斩+',
    cost: 2,
    type: CardType.ATTACK,
    school: School.SWORD,
    rarity: Rarity.COMMON,
    description: '造成 16 点伤害',
    targetType: TargetType.SINGLE_ENEMY,
    effects: [{ type: 'damage', base: 16 }],
    weight: 0,
  },

  cleaveUpgraded: {
    id: 'cleaveUpgraded',
    name: '横扫+',
    cost: 2,
    type: CardType.ATTACK,
    school: School.SWORD,
    rarity: Rarity.RARE,
    description: '对所有敌人造成 11 点伤害',
    targetType: TargetType.ALL_ENEMIES,
    effects: [{ type: 'damage', base: 11 }],
    weight: 0,
  },

  doubleStrikeUpgraded: {
    id: 'doubleStrikeUpgraded',
    name: '连斩+',
    cost: 1,
    type: CardType.ATTACK,
    school: School.SWORD,
    rarity: Rarity.RARE,
    description: '造成 6 点伤害 2 次',
    targetType: TargetType.SINGLE_ENEMY,
    effects: [{ type: 'damage', base: 6, count: 2 }],
    weight: 0,
  },

  ironSkinUpgraded: {
    id: 'ironSkinUpgraded',
    name: '铁甲+',
    cost: 2,
    type: CardType.SKILL,
    school: School.SHIELD,
    rarity: Rarity.COMMON,
    description: '获得 11 点护甲',
    targetType: TargetType.SELF,
    effects: [{ type: 'block', base: 11 }],
    weight: 0,
  },

  shieldBashUpgraded: {
    id: 'shieldBashUpgraded',
    name: '盾击+',
    cost: 2,
    type: CardType.ATTACK,
    school: School.SHIELD,
    rarity: Rarity.RARE,
    description: '造成等同于护甲的伤害',
    targetType: TargetType.SINGLE_ENEMY,
    effects: [{ type: 'damage', base: 0, counterBonus: 0 }],
    weight: 0,
  },

  inkBladeUpgraded: {
    id: 'inkBladeUpgraded',
    name: '墨刃+',
    cost: 1,
    type: CardType.ATTACK,
    school: School.SPELL,
    rarity: Rarity.RARE,
    description: '造成 10 点伤害，抽 1 张牌',
    targetType: TargetType.SINGLE_ENEMY,
    effects: [{ type: 'damage', base: 10 }, { type: 'draw', base: 1 }],
    weight: 0,
  },

  inkInsightUpgraded: {
    id: 'inkInsightUpgraded',
    name: '墨悟+',
    cost: 1,
    type: CardType.SKILL,
    school: School.SPELL,
    rarity: Rarity.RARE,
    description: '抽 3 张牌',
    targetType: TargetType.SELF,
    effects: [{ type: 'draw', base: 3 }],
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

/**
 * 获取所有卡牌列表
 */
export function getAllCards(): CardTemplate[] {
  return Object.values(CardDatabase);
}

/**
 * 按稀有度筛选卡牌
 */
export function getCardsByRarity(rarity: Rarity): CardTemplate[] {
  return Object.values(CardDatabase).filter(card => card.rarity === rarity);
}

/**
 * 按类型筛选卡牌
 */
export function getCardsByType(type: CardType): CardTemplate[] {
  return Object.values(CardDatabase).filter(card => card.type === type);
}
