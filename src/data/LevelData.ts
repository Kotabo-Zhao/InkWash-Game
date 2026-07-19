/**
 * LevelData.ts - 关卡数据
 * 每章 10-12 关，定义敌人组合和难度曲线
 */

import { CHAPTERS } from './ChapterData';
import { getEnemiesForChapter, getElitesForChapter, getBossForChapter } from '../core/EnemyDatabase';

export type NodeType = 'BATTLE' | 'ELITE' | 'BOSS' | 'REST' | 'SHOP' | 'EVENT' | 'TREASURE';

export interface LevelConfig {
  id: number;
  chapter: number;
  floor: number;
  type: NodeType;
  enemies: string[]; // enemy IDs
  rewardMultiplier: number;
}

/**
 * 生成章节关卡
 */
export function generateChapterLevels(chapter: number): LevelConfig[] {
  const config = CHAPTERS.find(c => c.id === chapter);
  if (!config) return [];

  const levels: LevelConfig[] = [];
  const floors = config.floors;
  const normalEnemies = getEnemiesForChapter(chapter);
  const eliteEnemies = getElitesForChapter(chapter);
  const bossId = getBossForChapter(chapter);

  // 关卡模板：普通-普通-精英-事件-普通-商店-普通-精英-休息-Boss
  const template: NodeType[] = [
    'BATTLE', 'BATTLE', 'ELITE', 'EVENT', 'BATTLE',
    'SHOP', 'BATTLE', 'ELITE', 'REST', 'BOSS'
  ];

  // 如果章节超过 10 层，扩展模板
  while (template.length < floors) {
    template.splice(template.length - 1, 0, 'BATTLE', 'TREASURE');
  }

  let levelId = (chapter - 1) * 100 + 1;

  for (let i = 0; i < floors; i++) {
    const floor = i + 1;
    const type = template[i] || 'BATTLE';

    let enemies: string[] = [];
    let rewardMultiplier = 1 + (floor - 1) * 0.1;

    switch (type) {
      case 'BATTLE':
        // 1-3 个普通敌人
        const battleCount = Math.min(3, 1 + Math.floor(floor / 3));
        enemies = [];
        for (let j = 0; j < battleCount; j++) {
          const idx = Math.floor(Math.random() * normalEnemies.length);
          enemies.push(normalEnemies[idx]);
        }
        break;

      case 'ELITE':
        // 1 个精英
        const eliteIdx = Math.floor(Math.random() * eliteEnemies.length);
        enemies = [eliteEnemies[eliteIdx]];
        rewardMultiplier *= 2;
        break;

      case 'BOSS':
        // Boss
        enemies = [bossId];
        rewardMultiplier *= 5;
        break;

      case 'REST':
      case 'SHOP':
      case 'EVENT':
      case 'TREASURE':
        // 这些节点没有战斗
        enemies = [];
        rewardMultiplier = 0;
        break;
    }

    levels.push({
      id: levelId++,
      chapter,
      floor,
      type,
      enemies,
      rewardMultiplier,
    });
  }

  return levels;
}

/**
 * 获取所有章节的关卡
 */
export function generateAllLevels(): LevelConfig[] {
  const allLevels: LevelConfig[] = [];
  for (let chapter = 1; chapter <= 5; chapter++) {
    allLevels.push(...generateChapterLevels(chapter));
  }
  return allLevels;
}

/**
 * 获取指定章节的关卡
 */
export function getLevelsForChapter(chapter: number): LevelConfig[] {
  return generateChapterLevels(chapter);
}

/**
 * 获取关卡难度系数
 */
export function getDifficultyMultiplier(chapter: number, floor: number): number {
  return 1 + (chapter - 1) * 0.3 + (floor - 1) * 0.05;
}
