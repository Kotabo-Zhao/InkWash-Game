/**
 * CardPoolData.ts - 奖励卡池数据
 */

export interface CardPoolEntry {
  templateId: string;
  weight: number;
  minChapter: number;
}

export const CHAPTER_CARD_POOLS: CardPoolEntry[][] = [
  // 第一章卡池
  [
    { templateId: 'strike', weight: 10, minChapter: 1 },
    { templateId: 'defend', weight: 10, minChapter: 1 },
    { templateId: 'quickSlash', weight: 8, minChapter: 1 },
    { templateId: 'heavyStrike', weight: 5, minChapter: 1 },
    { templateId: 'cleave', weight: 3, minChapter: 1 },
    { templateId: 'ironSkin', weight: 3, minChapter: 1 },
    { templateId: 'meditate', weight: 2, minChapter: 1 },
    { templateId: 'healingLight', weight: 2, minChapter: 1 },
  ],
  // 第二章卡池
  [
    { templateId: 'strike', weight: 8, minChapter: 1 },
    { templateId: 'defend', weight: 8, minChapter: 1 },
    { templateId: 'heavyStrike', weight: 6, minChapter: 1 },
    { templateId: 'cleave', weight: 4, minChapter: 1 },
    { templateId: 'ironSkin', weight: 4, minChapter: 1 },
    { templateId: 'meditate', weight: 3, minChapter: 1 },
    { templateId: 'healingLight', weight: 3, minChapter: 1 },
    { templateId: 'doubleStrike', weight: 2, minChapter: 2 },
    { templateId: 'exhaustStrike', weight: 1, minChapter: 2 },
  ],
  // 第三章卡池
  [
    { templateId: 'heavyStrike', weight: 8, minChapter: 1 },
    { templateId: 'cleave', weight: 6, minChapter: 1 },
    { templateId: 'ironSkin', weight: 6, minChapter: 1 },
    { templateId: 'meditate', weight: 4, minChapter: 1 },
    { templateId: 'healingLight', weight: 4, minChapter: 1 },
    { templateId: 'doubleStrike', weight: 3, minChapter: 2 },
    { templateId: 'exhaustStrike', weight: 2, minChapter: 2 },
  ],
];

/**
 * 根据章节生成奖励卡牌（3选1）
 */
export function generateCardRewards(chapter: number): string[] {
  const pool = CHAPTER_CARD_POOLS[Math.min(chapter - 1, CHAPTER_CARD_POOLS.length - 1)];
  const filtered = pool.filter(e => e.minChapter <= chapter);

  const totalWeight = filtered.reduce((sum, e) => sum + e.weight, 0);
  const rewards: string[] = [];

  while (rewards.length < 3 && filtered.length > 0) {
    let random = Math.random() * totalWeight;
    for (let i = 0; i < filtered.length; i++) {
      random -= filtered[i].weight;
      if (random <= 0) {
        rewards.push(filtered[i].templateId);
        filtered.splice(i, 1);
        break;
      }
    }
  }

  return rewards;
}
