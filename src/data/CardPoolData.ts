/**
 * CardPoolData.ts - 卡牌奖励池
 * 按章节和稀有度生成奖励选项
 */

import { CardDatabase } from '../cards/CardDatabase';
import { Rarity } from '../cards/CardSystem';

/**
 * 生成战斗奖励卡牌（3选1）
 * @param chapter 当前章节（影响稀有度概率）
 * @param nodeType 节点类型（BOSS奖励更好）
 */
export function generateCardRewards(chapter: number, nodeType: string = 'BATTLE'): string[] {
  const allCards = Object.values(CardDatabase);

  // 按稀有度加权
  const rarityWeight: Record<Rarity, number> = {
    [Rarity.COMMON]: 60,
    [Rarity.RARE]: 30,
    [Rarity.EPIC]: 8 + chapter * 2,
    [Rarity.LEGENDARY]: 2 + chapter,
  };

  // BOSS战提高稀有度
  if (nodeType === 'BOSS') {
    rarityWeight[Rarity.RARE] += 10;
    rarityWeight[Rarity.EPIC] += 5;
    rarityWeight[Rarity.LEGENDARY] += 3;
  } else if (nodeType === 'ELITE') {
    rarityWeight[Rarity.RARE] += 5;
    rarityWeight[Rarity.EPIC] += 3;
  }

  // 加权随机选3张
  const candidates: Array<{ id: string; weight: number }> = [];
  for (const card of allCards) {
    // 跳过基础卡
    if (card.id === 'strike' || card.id === 'defend' || card.id === 'quickSlash') continue;
    candidates.push({ id: card.id, weight: rarityWeight[card.rarity] || 10 });
  }

  const selected: string[] = [];
  for (let i = 0; i < 3 && candidates.length > 0; i++) {
    const totalWeight = candidates.reduce((sum, c) => sum + c.weight, 0);
    let roll = Math.random() * totalWeight;

    for (let j = 0; j < candidates.length; j++) {
      roll -= candidates[j].weight;
      if (roll <= 0) {
        selected.push(candidates[j].id);
        candidates.splice(j, 1);
        break;
      }
    }
  }

  return selected;
}
