/**
 * EnemyDatabase.ts - 扩展版敌人数据库
 * 20+ 种敌人，覆盖普通/精英/Boss三大类
 */

import { Enemy } from './Enemy';

export type EnemyType = 'normal' | 'elite' | 'boss';

export interface EnemyConfig {
  id: string;
  name: string;
  type: EnemyType;
  hp: number;
  patterns: Array<{
    type: 'attack' | 'block' | 'buff' | 'debuff';
    value: number;
    description: string;
  }>;
}

// ====== 敌人数据库 ======

export const EnemyDatabase: Record<string, EnemyConfig> = {
  // ==================== 第一章：墨林迷踪 ====================
  
  // 普通敌人 (6种)
  inkBlob: {
    id: 'inkBlob',
    name: '墨滴怪',
    type: 'normal',
    hp: 20,
    patterns: [
      { type: 'attack', value: 4, description: '墨击 4' },
      { type: 'block', value: 2, description: '凝墨 2' },
      { type: 'attack', value: 5, description: '墨溅 5' },
    ],
  },

  bambooSpirit: {
    id: 'bambooSpirit',
    name: '竹精',
    type: 'normal',
    hp: 18,
    patterns: [
      { type: 'attack', value: 3, description: '竹叶飞刀 3' },
      { type: 'attack', value: 3, description: '竹叶飞刀 3' },
      { type: 'debuff', value: 1, description: '缠绕 虚弱1' },
    ],
  },

  inkFox: {
    id: 'inkFox',
    name: '墨狐',
    type: 'normal',
    hp: 22,
    patterns: [
      { type: 'attack', value: 5, description: '狐爪 5' },
      { type: 'block', value: 4, description: '幻影 4' },
      { type: 'attack', value: 6, description: '撕咬 6' },
      { type: 'debuff', value: 1, description: '魅惑 虚弱1' },
    ],
  },

  stoneGuardian: {
    id: 'stoneGuardian',
    name: '石卫兵',
    type: 'normal',
    hp: 28,
    patterns: [
      { type: 'block', value: 6, description: '石盾 6' },
      { type: 'attack', value: 7, description: '石锤 7' },
      { type: 'block', value: 6, description: '石盾 6' },
      { type: 'attack', value: 9, description: '重击 9' },
    ],
  },

  shadowWolf: {
    id: 'shadowWolf',
    name: '影狼',
    type: 'normal',
    hp: 24,
    patterns: [
      { type: 'attack', value: 4, description: '撕咬 4' },
      { type: 'attack', value: 4, description: '撕咬 4' },
      { type: 'attack', value: 6, description: '扑击 6' },
    ],
  },

  inkMushroom: {
    id: 'inkMushroom',
    name: '墨菇',
    type: 'normal',
    hp: 16,
    patterns: [
      { type: 'debuff', value: 1, description: '毒孢子 中毒1' },
      { type: 'attack', value: 3, description: '弹射 3' },
      { type: 'debuff', value: 1, description: '毒孢子 中毒1' },
      { type: 'block', value: 5, description: '孢子护盾 5' },
    ],
  },

  // 精英敌人 (2种)
  forestGuardian: {
    id: 'forestGuardian',
    name: '竹林守卫',
    type: 'elite',
    hp: 50,
    patterns: [
      { type: 'attack', value: 8, description: '竹枪突刺 8' },
      { type: 'block', value: 8, description: '竹盾 8' },
      { type: 'attack', value: 12, description: '横扫千军 12' },
      { type: 'buff', value: 2, description: '竹之韧性 力量2' },
    ],
  },

  inkGeneral: {
    id: 'inkGeneral',
    name: '墨将军',
    type: 'elite',
    hp: 60,
    patterns: [
      { type: 'attack', value: 10, description: '墨戟 10' },
      { type: 'block', value: 10, description: '墨甲 10' },
      { type: 'attack', value: 15, description: '将军斩 15' },
      { type: 'buff', value: 1, description: '战意 力量1' },
      { type: 'attack', value: 10, description: '墨戟 10' },
    ],
  },

  // Boss (1种)
  bambooDemon: {
    id: 'bambooDemon',
    name: '竹魔',
    type: 'boss',
    hp: 100,
    patterns: [
      { type: 'attack', value: 12, description: '竹鞭 12' },
      { type: 'block', value: 12, description: '竹甲 12' },
      { type: 'debuff', value: 2, description: '缠绕 虚弱2' },
      { type: 'attack', value: 18, description: '竹龙卷 18' },
      { type: 'buff', value: 3, description: '竹之怒 力量3' },
      { type: 'attack', value: 25, description: '终极技：万竹齐发 25' },
    ],
  },

  // ==================== 第二章：墨池深渊 ====================

  // 普通敌人 (5种)
  inkFish: {
    id: 'inkFish',
    name: '墨鱼',
    type: 'normal',
    hp: 20,
    patterns: [
      { type: 'attack', value: 4, description: '墨汁喷射 4' },
      { type: 'debuff', value: 1, description: '墨雾 虚弱1' },
      { type: 'block', value: 5, description: '墨盾 5' },
    ],
  },

  deepDweller: {
    id: 'deepDweller',
    name: '深渊居民',
    type: 'normal',
    hp: 26,
    patterns: [
      { type: 'attack', value: 5, description: '触手 5' },
      { type: 'attack', value: 5, description: '触手 5' },
      { type: 'debuff', value: 2, description: '深渊凝视 虚弱2' },
    ],
  },

  inkEel: {
    id: 'inkEel',
    name: '墨鳗',
    type: 'normal',
    hp: 22,
    patterns: [
      { type: 'attack', value: 6, description: '缠绕咬 6' },
      { type: 'block', value: 4, description: '滑溜 4' },
      { type: 'attack', value: 8, description: '电击 8' },
    ],
  },

  coralSpirit: {
    id: 'coralSpirit',
    name: '珊瑚精',
    type: 'normal',
    hp: 30,
    patterns: [
      { type: 'block', value: 8, description: '珊瑚护盾 8' },
      { type: 'attack', value: 6, description: '珊瑚刺 6' },
      { type: 'buff', value: 2, description: '再生 力量2' },
    ],
  },

  abyssalEye: {
    id: 'abyssalEye',
    name: '深渊之眼',
    type: 'normal',
    hp: 24,
    patterns: [
      { type: 'debuff', value: 2, description: '恐惧凝视 虚弱2' },
      { type: 'attack', value: 7, description: '精神冲击 7' },
      { type: 'debuff', value: 1, description: '混乱 虚弱1' },
    ],
  },

  // 精英敌人 (2种)
  seaMonster: {
    id: 'seaMonster',
    name: '海怪',
    type: 'elite',
    hp: 70,
    patterns: [
      { type: 'attack', value: 12, description: '触手横扫 12' },
      { type: 'block', value: 12, description: '墨汁护盾 12' },
      { type: 'attack', value: 18, description: '深海漩涡 18' },
      { type: 'debuff', value: 2, description: '海妖之歌 虚弱2' },
    ],
  },

  inkDragonYoung: {
    id: 'inkDragonYoung',
    name: '幼墨龙',
    type: 'elite',
    hp: 80,
    patterns: [
      { type: 'attack', value: 15, description: '龙息 15' },
      { type: 'block', value: 15, description: '龙鳞 15' },
      { type: 'buff', value: 2, description: '龙之怒 力量2' },
      { type: 'attack', value: 20, description: '龙爪 20' },
    ],
  },

  // Boss (1种)
  abyssLord: {
    id: 'abyssLord',
    name: '深渊之主',
    type: 'boss',
    hp: 150,
    patterns: [
      { type: 'attack', value: 15, description: '深渊之握 15' },
      { type: 'block', value: 15, description: '深渊护盾 15' },
      { type: 'debuff', value: 3, description: '深渊凝视 虚弱3' },
      { type: 'attack', value: 22, description: '深渊漩涡 22' },
      { type: 'buff', value: 3, description: '深渊之力 力量3' },
      { type: 'attack', value: 30, description: '终极技：深渊吞噬 30' },
      { type: 'block', value: 20, description: '深渊之甲 20' },
    ],
  },

  // ==================== 第三章：墨山秘境 ====================

  // 普通敌人 (4种)
  mountainSpirit: {
    id: 'mountainSpirit',
    name: '山灵',
    type: 'normal',
    hp: 28,
    patterns: [
      { type: 'attack', value: 6, description: '岩石投掷 6' },
      { type: 'block', value: 8, description: '石甲 8' },
      { type: 'attack', value: 9, description: '地震 9' },
    ],
  },

  inkBird: {
    id: 'inkBird',
    name: '墨鸦',
    type: 'normal',
    hp: 20,
    patterns: [
      { type: 'attack', value: 5, description: '俯冲 5' },
      { type: 'attack', value: 5, description: '利爪 5' },
      { type: 'debuff', value: 1, description: '诅咒 虚弱1' },
    ],
  },

  stoneGolem: {
    id: 'stoneGolem',
    name: '石魔像',
    type: 'normal',
    hp: 35,
    patterns: [
      { type: 'block', value: 10, description: '石盾 10' },
      { type: 'attack', value: 8, description: '巨拳 8' },
      { type: 'attack', value: 12, description: '地震波 12' },
    ],
  },

  windDancer: {
    id: 'windDancer',
    name: '风舞者',
    type: 'normal',
    hp: 22,
    patterns: [
      { type: 'attack', value: 4, description: '风刃 4' },
      { type: 'attack', value: 4, description: '风刃 4' },
      { type: 'attack', value: 7, description: '旋风斩 7' },
      { type: 'block', value: 6, description: '风盾 6' },
    ],
  },

  // 精英敌人 (2种)
  ancientGuardian: {
    id: 'ancientGuardian',
    name: '远古守卫',
    type: 'elite',
    hp: 90,
    patterns: [
      { type: 'attack', value: 14, description: '古剑斩 14' },
      { type: 'block', value: 18, description: '古盾 18' },
      { type: 'buff', value: 2, description: '古老智慧 力量2' },
      { type: 'attack', value: 20, description: '远古之力 20' },
    ],
  },

  inkPhoenix: {
    id: 'inkPhoenix',
    name: '墨凤凰',
    type: 'elite',
    hp: 85,
    patterns: [
      { type: 'attack', value: 16, description: '凤炎 16' },
      { type: 'buff', value: 3, description: '浴火重生 力量3' },
      { type: 'attack', value: 22, description: '凤凰涅槃 22' },
      { type: 'block', value: 15, description: '羽翼护盾 15' },
    ],
  },

  // Boss (1种)
  mountainKing: {
    id: 'mountainKing',
    name: '山岳之王',
    type: 'boss',
    hp: 200,
    patterns: [
      { type: 'attack', value: 18, description: '山崩 18' },
      { type: 'block', value: 20, description: '山岳之盾 20' },
      { type: 'buff', value: 3, description: '大地之力 力量3' },
      { type: 'attack', value: 25, description: '地震波 25' },
      { type: 'attack', value: 35, description: '终极技：山岳崩塌 35' },
      { type: 'block', value: 25, description: '山岳之甲 25' },
    ],
  },

  // ==================== 第四章：影武者殿堂 ====================

  // 普通敌人 (5种)
  shadowSoldier: {
    id: 'shadowSoldier',
    name: '影兵',
    type: 'normal',
    hp: 28,
    patterns: [
      { type: 'attack', value: 7, description: '影刃 7' },
      { type: 'block', value: 5, description: '影盾 5' },
      { type: 'attack', value: 9, description: '影突刺 9' },
    ],
  },

  inkAssassin: {
    id: 'inkAssassin',
    name: '墨刺者',
    type: 'normal',
    hp: 22,
    patterns: [
      { type: 'attack', value: 8, description: '暗刺 8' },
      { type: 'debuff', value: 2, description: '致盲 虚弱2' },
      { type: 'attack', value: 10, description: '背刺 10' },
    ],
  },

  darkMage: {
    id: 'darkMage',
    name: '暗法师',
    type: 'normal',
    hp: 26,
    patterns: [
      { type: 'debuff', value: 2, description: '暗影诅咒 虚弱2' },
      { type: 'attack', value: 7, description: '暗影弹 7' },
      { type: 'buff', value: 2, description: '暗影护体 力量2' },
      { type: 'attack', value: 10, description: '暗影爆裂 10' },
    ],
  },

  phantomKnight: {
    id: 'phantomKnight',
    name: '幻骑士',
    type: 'normal',
    hp: 32,
    patterns: [
      { type: 'block', value: 8, description: '幻影盾 8' },
      { type: 'attack', value: 8, description: '幻影枪 8' },
      { type: 'attack', value: 12, description: '幻影突击 12' },
    ],
  },

  inkEcho: {
    id: 'inkEcho',
    name: '墨回声',
    type: 'normal',
    hp: 20,
    patterns: [
      { type: 'attack', value: 5, description: '回声 5' },
      { type: 'attack', value: 5, description: '回声 5' },
      { type: 'attack', value: 5, description: '回声 5' },
      { type: 'buff', value: 2, description: '共鸣 力量2' },
    ],
  },

  // 精英敌人 (2种)
  shadowWarrior: {
    id: 'shadowWarrior',
    name: '影武者',
    type: 'elite',
    hp: 100,
    patterns: [
      { type: 'attack', value: 14, description: '影斩 14' },
      { type: 'block', value: 14, description: '影甲 14' },
      { type: 'attack', value: 20, description: '无影斩 20' },
      { type: 'buff', value: 3, description: '影之强化 力量3' },
      { type: 'attack', value: 16, description: '影斩 16' },
    ],
  },

  inkMirror: {
    id: 'inkMirror',
    name: '墨镜',
    type: 'elite',
    hp: 90,
    patterns: [
      { type: 'attack', value: 12, description: '镜像反射 12' },
      { type: 'block', value: 16, description: '镜盾 16' },
      { type: 'debuff', value: 3, description: '镜像诅咒 虚弱3' },
      { type: 'attack', value: 18, description: '镜像爆裂 18' },
      { type: 'buff', value: 2, description: '镜像强化 力量2' },
    ],
  },

  // Boss (1种)
  shadowWarlord: {
    id: 'shadowWarlord',
    name: '影武者将军',
    type: 'boss',
    hp: 220,
    patterns: [
      { type: 'attack', value: 20, description: '将军斩 20' },
      { type: 'block', value: 18, description: '将军甲 18' },
      { type: 'attack', value: 28, description: '影将军之怒 28' },
      { type: 'debuff', value: 3, description: '影之压制 虚弱3' },
      { type: 'buff', value: 4, description: '将军之威 力量4' },
      { type: 'attack', value: 35, description: '终极技：影武者全斩 35' },
      { type: 'block', value: 22, description: '将军之盾 22' },
      { type: 'attack', value: 45, description: '灭世之斩 45' },
    ],
  },

  // ==================== 第五章：墨渊核心 ====================

  // 普通敌人 (4种) — 复用前几章素材变体
  chaosInkBlob: {
    id: 'chaosInkBlob',
    name: '混沌墨滴',
    type: 'normal',
    hp: 30,
    patterns: [
      { type: 'attack', value: 8, description: '混沌墨击 8' },
      { type: 'block', value: 6, description: '混沌凝墨 6' },
      { type: 'attack', value: 10, description: '混沌墨溅 10' },
    ],
  },

  voidTentacle: {
    id: 'voidTentacle',
    name: '虚空触手',
    type: 'normal',
    hp: 26,
    patterns: [
      { type: 'attack', value: 7, description: '虚空缠绕 7' },
      { type: 'debuff', value: 2, description: '虚空凝视 虚弱2' },
      { type: 'attack', value: 10, description: '虚空抽击 10' },
    ],
  },

  corruptedSpirit: {
    id: 'corruptedSpirit',
    name: '堕落精灵',
    type: 'normal',
    hp: 24,
    patterns: [
      { type: 'buff', value: 2, description: '堕落之力 力量2' },
      { type: 'attack', value: 9, description: '堕落之光 9' },
      { type: 'debuff', value: 2, description: '堕落诅咒 虚弱2' },
      { type: 'attack', value: 12, description: '堕落爆裂 12' },
    ],
  },

  inkGuardian: {
    id: 'inkGuardian',
    name: '墨守护者',
    type: 'normal',
    hp: 35,
    patterns: [
      { type: 'block', value: 12, description: '墨守护盾 12' },
      { type: 'attack', value: 10, description: '墨守护拳 10' },
      { type: 'attack', value: 14, description: '墨守护波 14' },
    ],
  },

  // 精英敌人 (2种)
  inkOverlord: {
    id: 'inkOverlord',
    name: '墨霸王',
    type: 'elite',
    hp: 130,
    patterns: [
      { type: 'attack', value: 18, description: '霸王斩 18' },
      { type: 'block', value: 20, description: '霸王甲 20' },
      { type: 'buff', value: 4, description: '霸王之怒 力量4' },
      { type: 'attack', value: 25, description: '霸王终斩 25' },
      { type: 'debuff', value: 3, description: '霸王之威 虚弱3' },
    ],
  },

  voidLord: {
    id: 'voidLord',
    name: '虚空领主',
    type: 'elite',
    hp: 140,
    patterns: [
      { type: 'attack', value: 20, description: '虚空撕裂 20' },
      { type: 'block', value: 22, description: '虚空壁障 22' },
      { type: 'debuff', value: 4, description: '虚空凝视 虚弱4' },
      { type: 'buff', value: 4, description: '虚空强化 力量4' },
      { type: 'attack', value: 30, description: '虚空终焉 30' },
    ],
  },

  // Boss (1种)
  finalBoss: {
    id: 'finalBoss',
    name: '墨境之主',
    type: 'boss',
    hp: 300,
    patterns: [
      { type: 'attack', value: 20, description: '墨境之怒 20' },
      { type: 'block', value: 25, description: '墨境之盾 25' },
      { type: 'buff', value: 3, description: '墨境之力 力量3' },
      { type: 'attack', value: 30, description: '墨境风暴 30' },
      { type: 'debuff', value: 3, description: '墨境凝视 虚弱3' },
      { type: 'attack', value: 40, description: '终极技：墨境崩坏 40' },
      { type: 'block', value: 30, description: '墨境之甲 30' },
      { type: 'attack', value: 50, description: '灭世之击 50' },
    ],
  },
};

/**
 * 创建敌人实例
 */
export function createEnemy(configId: string): Enemy {
  const config = EnemyDatabase[configId];
  if (!config) {
    throw new Error(`Enemy config not found: ${configId}`);
  }

  return new Enemy(config.id, config.name, config.hp, config.patterns);
}

/**
 * 获取指定章节的敌人池
 */
export function getEnemiesForChapter(chapter: number): string[] {
  const chapterEnemies: Record<number, string[]> = {
    1: ['inkBlob', 'bambooSpirit', 'inkFox', 'stoneGuardian', 'shadowWolf', 'inkMushroom'],
    2: ['inkFish', 'deepDweller', 'inkEel', 'coralSpirit', 'abyssalEye'],
    3: ['mountainSpirit', 'inkBird', 'stoneGolem', 'windDancer'],
    4: ['shadowSoldier', 'inkAssassin', 'darkMage', 'phantomKnight', 'inkEcho'],
    5: ['chaosInkBlob', 'voidTentacle', 'corruptedSpirit', 'inkGuardian'],
  };

  return chapterEnemies[chapter] || [];
}

/**
 * 根据节点类型和层级获取敌人（兼容旧接口）
 */
export function getEnemiesForNode(chapter: number, nodeType: string, nodeFloor: number): EnemyConfig[] {
  const difficultyMultiplier = 1 + (chapter - 1) * 0.3 + (nodeFloor - 1) * 0.05;
  
  if (nodeType === 'BOSS') {
    const bossId = getBossForChapter(chapter);
    const boss = EnemyDatabase[bossId];
    if (boss) {
      return [{ ...boss, hp: Math.floor(boss.hp * difficultyMultiplier) }];
    }
  }
  
  if (nodeType === 'ELITE') {
    const elites = getElitesForChapter(chapter);
    if (elites.length > 0) {
      const eliteId = elites[Math.floor(Math.random() * elites.length)];
      const elite = EnemyDatabase[eliteId];
      return [{ ...elite, hp: Math.floor(elite.hp * difficultyMultiplier) }];
    }
  }
  
  // 普通战斗
  const normals = getEnemiesForChapter(chapter);
  if (normals.length === 0) {
    // fallback
    return [{ ...EnemyDatabase.inkBlob, hp: Math.floor(EnemyDatabase.inkBlob.hp * difficultyMultiplier) }];
  }
  
  const enemyId = normals[Math.floor(Math.random() * normals.length)];
  const enemy = EnemyDatabase[enemyId];
  return [{ ...enemy, hp: Math.floor(enemy.hp * difficultyMultiplier) }];
}

/**
 * 获取指定章节的精英敌人池
 */
export function getElitesForChapter(chapter: number): string[] {
  const chapterElites: Record<number, string[]> = {
    1: ['forestGuardian', 'inkGeneral'],
    2: ['seaMonster', 'inkDragonYoung'],
    3: ['ancientGuardian', 'inkPhoenix'],
    4: ['shadowWarrior', 'inkMirror'],
    5: ['inkOverlord', 'voidLord'],
  };

  return chapterElites[chapter] || [];
}

/**
 * 获取指定章节的Boss
 */
export function getBossForChapter(chapter: number): string {
  const chapterBosses: Record<number, string> = {
    1: 'bambooDemon',
    2: 'abyssLord',
    3: 'mountainKing',
    4: 'shadowWarlord',
    5: 'finalBoss',
  };

  return chapterBosses[chapter] || 'finalBoss';
}
