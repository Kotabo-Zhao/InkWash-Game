/**
 * ChapterData.ts - 章节与关卡数据
 */

export interface ChapterConfig {
  id: number;
  name: string;
  description: string;
  bossId: string;
  floors: number;
  difficulty: number;
}

export interface EnemyConfig {
  id: string;
  name: string;
  hp: number;
  damage: number;
  patterns: Array<{ type: 'attack' | 'block' | 'buff' | 'debuff'; value: number; description: string }>;
  exp: number;
  gold: number;
}

export const CHAPTERS: ChapterConfig[] = [
  {
    id: 1,
    name: '第一章：墨林迷踪',
    description: '你踏入了墨境，四周是无尽的墨色森林。',
    bossId: 'shadow_wolf',
    floors: 6,
    difficulty: 1,
  },
  {
    id: 2,
    name: '第二章：影武者殿堂',
    description: '古老的殿堂中，影武者的气息无处不在。',
    bossId: 'shadow_warrior',
    floors: 6,
    difficulty: 2,
  },
  {
    id: 3,
    name: '第三章：墨渊深处',
    description: '墨渊的最深处，墨龙王在此等待。',
    bossId: 'ink_dragon',
    floors: 6,
    difficulty: 3,
  },
];

export const ENEMIES: Record<string, EnemyConfig> = {
  // 第一章敌人
  ink_beast: {
    id: 'ink_beast',
    name: '墨兽',
    hp: 25,
    damage: 6,
    patterns: [
      { type: 'attack', value: 6, description: '墨爪 6' },
      { type: 'block', value: 4, description: '墨甲 4' },
    ],
    exp: 10,
    gold: 15,
  },
  ink_wolf: {
    id: 'ink_wolf',
    name: '墨狼',
    hp: 35,
    damage: 8,
    patterns: [
      { type: 'attack', value: 8, description: '撕咬 8' },
      { type: 'attack', value: 10, description: '狼嚎斩 10' },
      { type: 'block', value: 5, description: '蜷缩 5' },
    ],
    exp: 15,
    gold: 20,
  },
  shadow_wolf: {
    id: 'shadow_wolf',
    name: '墨龙王',
    hp: 80,
    damage: 12,
    patterns: [
      { type: 'attack', value: 12, description: '龙息 12' },
      { type: 'block', value: 10, description: '鳞甲 10' },
      { type: 'attack', value: 15, description: '龙爪 15' },
      { type: 'buff', value: 2, description: '蓄力 +2' },
    ],
    exp: 50,
    gold: 100,
  },

  // 第二章敌人
  shadow_assassin: {
    id: 'shadow_assassin',
    name: '影刺客',
    hp: 45,
    damage: 10,
    patterns: [
      { type: 'attack', value: 10, description: '暗刺 10' },
      { type: 'attack', value: 14, description: '背刺 14' },
      { type: 'debuff', value: 2, description: '致盲 -2' },
    ],
    exp: 20,
    gold: 30,
  },
  shadow_knight: {
    id: 'shadow_knight',
    name: '影武者',
    hp: 100,
    damage: 14,
    patterns: [
      { type: 'attack', value: 14, description: '影斩 14' },
      { type: 'block', value: 12, description: '影盾 12' },
      { type: 'attack', value: 18, description: '无影斩 18' },
      { type: 'buff', value: 3, description: '影之力 +3' },
    ],
    exp: 60,
    gold: 120,
  },

  // 第三章敌人
  ink_elemental: {
    id: 'ink_elemental',
    name: '墨元素',
    hp: 60,
    damage: 12,
    patterns: [
      { type: 'attack', value: 12, description: '墨弹 12' },
      { type: 'block', value: 8, description: '墨壁 8' },
      { type: 'attack', value: 16, description: '墨爆 16' },
    ],
    exp: 25,
    gold: 40,
  },
  ink_dragon: {
    id: 'ink_dragon',
    name: '墨渊守护者',
    hp: 120,
    damage: 18,
    patterns: [
      { type: 'attack', value: 18, description: '渊息 18' },
      { type: 'block', value: 15, description: '渊甲 15' },
      { type: 'attack', value: 22, description: '渊爪 22' },
      { type: 'buff', value: 4, description: '渊之力 +4' },
      { type: 'attack', value: 25, description: '墨渊吞噬 25' },
    ],
    exp: 100,
    gold: 200,
  },
};

/**
 * 根据章节和节点类型获取敌人
 */
export function getEnemiesForNode(
  chapter: number,
  nodeType: string,
  nodeFloor: number
): EnemyConfig[] {
  const diffMultiplier = 1 + (chapter - 1) * 0.3;

  if (nodeType === 'BOSS') {
    const chapterConfig = CHAPTERS[chapter - 1];
    if (!chapterConfig) return [ENEMIES.ink_beast];
    const boss = ENEMIES[chapterConfig.bossId];
    return [{ ...boss, hp: Math.floor(boss.hp * diffMultiplier) }];
  }

  if (nodeType === 'ELITE') {
    const elites = ['ink_wolf', 'shadow_assassin', 'ink_elemental'];
    const eliteId = elites[Math.min(chapter - 1, elites.length - 1)];
    const elite = ENEMIES[eliteId];
    return [{ ...elite, hp: Math.floor(elite.hp * diffMultiplier) }];
  }

  // 普通战斗
  const normalEnemies = ['ink_beast', 'ink_wolf', 'shadow_assassin', 'ink_elemental'];
  const enemyId = normalEnemies[Math.floor(Math.random() * normalEnemies.length)];
  const enemy = ENEMIES[enemyId];
  return [{ ...enemy, hp: Math.floor(enemy.hp * diffMultiplier) }];
}
