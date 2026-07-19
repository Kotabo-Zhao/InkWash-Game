/**
 * RewardScene.ts - 战斗奖励/卡牌选择场景
 */

import Phaser from 'phaser';
import { Card, CardTemplate, Rarity } from '../cards/CardSystem';
import { CardDatabase } from '../cards/CardDatabase';
import { generateCardRewards } from '../data/CardPoolData';
import { GameData } from '../data/GameData';

export class RewardScene extends Phaser.Scene {
  private playerState!: any;

  constructor() { super({ key: 'RewardScene' }); }

  init(): void {
    this.playerState = GameData.load() || GameData.createInitialPlayerState();
  }

  create(): void {
    this.add.rectangle(195, 422, 390, 844, 0x0f0f1a);

    this.add.text(195, 60, '战斗胜利！', { fontSize: '24px', color: '#ffd76b' }).setOrigin(0.5);
    this.add.text(195, 90, '选择一张卡牌加入牌组', { fontSize: '14px', color: '#888' }).setOrigin(0.5);

    // 生成奖励卡牌
    const rewardIds = generateCardRewards(this.playerState.currentChapter);
    const rewards = rewardIds.map(id => CardDatabase[id]).filter(t => t);

    const cardW = 100;
    const startX = 195 - (rewards.length * (cardW + 10)) / 2 + cardW / 2;

    rewards.forEach((tmpl, idx) => {
      const x = startX + idx * (cardW + 10);
      const y = 300;
      const rarityColor = this.getRarityColor(tmpl.rarity);

      const bg = this.add.rectangle(x, y, cardW, 140, 0x1a2a3e);
      bg.setStrokeStyle(2, rarityColor);
      bg.setInteractive({ useHandCursor: true });

      const name = this.add.text(x, y - 50, tmpl.name, {
        fontSize: '14px', color: '#e8d5b5',
      }).setOrigin(0.5);

      const cost = this.add.text(x - 35, y - 60, `${tmpl.cost}`, {
        fontSize: '12px', color: '#6bb5ff',
      }).setOrigin(0.5);

      const desc = this.add.text(x, y + 5, tmpl.description, {
        fontSize: '10px', color: '#aaa',
        wordWrap: { width: cardW - 10 },
        align: 'center',
      }).setOrigin(0.5);

      const rarityLabel = this.add.text(x, y + 50, tmpl.rarity, {
        fontSize: '10px', color: `#${rarityColor.toString(16).padStart(6, '0')}`,
      }).setOrigin(0.5);

      bg.on('pointerover', () => bg.setFillStyle(0x2a3a5e));
      bg.on('pointerout', () => bg.setFillStyle(0x1a2a3e));

      bg.on('pointerdown', () => {
        // 将卡牌加入牌组
        this.playerState.deckTemplateIds.push(tmpl.id);
        GameData.save(this.playerState);

        this.add.text(195, 500, `已选择: ${tmpl.name}`, {
          fontSize: '16px', color: '#6bff8a',
        }).setOrigin(0.5);

        this.time.delayedCall(1000, () => this.scene.start('MapScene'));
      });
    });

    // 跳过按钮
    const skip = this.add.text(195, 600, '[ 跳过 ]', {
      fontSize: '16px', color: '#888',
    }).setOrigin(0.5);
    skip.setInteractive({ useHandCursor: true });
    skip.on('pointerdown', () => this.scene.start('MapScene'));
  }

  private getRarityColor(rarity: Rarity): number {
    switch (rarity) {
      case Rarity.COMMON: return 0x888888;
      case Rarity.RARE: return 0x4488ff;
      case Rarity.EPIC: return 0xaa44ff;
      case Rarity.LEGENDARY: return 0xffaa00;
    }
  }
}
