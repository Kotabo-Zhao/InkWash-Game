/**
 * ChapterData.ts - 章节与关卡数据
 * 5 章，每章 10-12 层，支持素材复用
 */

export interface ChapterConfig {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  bossId: string;
  floors: number;
  difficulty: number;
  // 素材复用：共享背景/音效资源
  bgAsset: string;
  bgmAsset: string;
  palette: { primary: string; secondary: string; accent: string };
}

export const CHAPTERS: ChapterConfig[] = [
  {
    id: 1,
    name: '第一章：墨林迷踪',
    subtitle: '初入墨境',
    description: '你踏入了墨境，四周是无尽的墨色森林。竹影婆娑，墨雾弥漫。',
    bossId: 'bambooDemon',
    floors: 10,
    difficulty: 1,
    bgAsset: 'bg_forest_ink',
    bgmAsset: 'bgm_forest',
    palette: { primary: '#1a3a2a', secondary: '#2d5a3d', accent: '#4a8f6a' },
  },
  {
    id: 2,
    name: '第二章：墨池深渊',
    subtitle: '深渊凝视',
    description: '古老的墨池深处，暗流涌动。水中的墨族伺机而动。',
    bossId: 'abyssLord',
    floors: 10,
    difficulty: 2,
    bgAsset: 'bg_abyss_ink',
    bgmAsset: 'bgm_abyss',
    palette: { primary: '#0a1a3a', secondary: '#1a2d5a', accent: '#3a6f9f' },
  },
  {
    id: 3,
    name: '第三章：墨山秘境',
    subtitle: '山岳之上',
    description: '墨山之巅，风暴肆虐。远古的守护者在此长眠。',
    bossId: 'mountainKing',
    floors: 12,
    difficulty: 3,
    bgAsset: 'bg_mountain_ink',
    bgmAsset: 'bgm_mountain',
    palette: { primary: '#2a1a0a', secondary: '#5a3d1a', accent: '#8f6a3a' },
  },
  {
    id: 4,
    name: '第四章：影武者殿堂',
    subtitle: '影之试炼',
    description: '影武者的殿堂，每一道影子都是敌人。无光之地，唯墨永存。',
    bossId: 'shadowWarlord',
    floors: 12,
    difficulty: 4,
    bgAsset: 'bg_shadow_hall',
    bgmAsset: 'bgm_shadow',
    palette: { primary: '#0a0a1a', secondary: '#1a1a3a', accent: '#6a3a8f' },
  },
  {
    id: 5,
    name: '第五章：墨渊核心',
    subtitle: '终焉之战',
    description: '墨渊的最深处，墨境之主在此等待。一切墨的源头，一切的终点。',
    bossId: 'finalBoss',
    floors: 12,
    difficulty: 5,
    bgAsset: 'bg_core_ink',
    bgmAsset: 'bgm_final',
    palette: { primary: '#000000', secondary: '#1a0a2a', accent: '#ff3a3a' },
  },
];

/**
 * 获取章节配置
 */
export function getChapter(id: number): ChapterConfig | undefined {
  return CHAPTERS[id - 1];
}

/**
 * 获取所有章节
 */
export function getAllChapters(): ChapterConfig[] {
  return CHAPTERS;
}
