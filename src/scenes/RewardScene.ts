/**
 * RewardScene.ts - 战斗奖励场景（水墨风）
 */

import Phaser from 'phaser';
import { CardTemplate, Rarity } from '../cards/CardSystem';
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
    const { width, height } = this.cameras.main;

    // 水墨背景
    this.cameras.main.setBackgroundColor('#0f0a0a');
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1510, 0.3);

    // 墨迹装饰
    for (let i = 0; i < 6; i++) {
      const ink = this.add.circle(
        Phaser.Math.Between(30, width - 30),
        Phaser.Math.Between(30, height - 30),
        Phaser.Math.Between(15, 50),
        0x2a2520, Phaser.Math.FloatBetween(0.05, 0.15)
      );
      ink.setBlendMode(Phaser.BlendModes.ADD);
    }

    // 胜利横幅
    const bannerBg = this.add.rectangle(width / 2, 55, 280, 40, 0x2a1a1a, 0.8);
    bannerBg.setStrokeStyle(1, 0x6a3a2a);
    this.add.text(width / 2, 55, '战斗胜利', {
      fontSize: '22px',
      fontFamily: '"STKaiti", "KaiTi", serif',
      color: '#e8c5a5',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // 提示
    this.add.text(width / 2, 95, '—— 选择一张卡牌纳入牌组 ——', {
      fontSize: '12px',
      color: '#6a5a4a',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // 生成奖励卡牌
    const rewardIds = generateCardRewards(this.playerState.currentChapter);
    const rewards = rewardIds.map(id => CardDatabase[id]).filter(t => t);

    const cardW = 110;
    const cardH = 160;
    const gap = 15;
    const totalW = rewards.length * cardW + (rewards.length - 1) * gap;
    const startX = (width - totalW) / 2 + cardW / 2;
    const cardY = 280;

    rewards.forEach((tmpl, idx) => {
      const x = startX + idx * (cardW + gap);
      const rarityColor = this.getRarityColor(tmpl.rarity);
      const rarityName = this.getRarityName(tmpl.rarity);
      const typeName = tmpl.type === 'ATTACK' ? '攻击' : tmpl.type === 'SKILL' ? '技能' : '能力';

      // 卡牌背景（宣纸色）
      const cardBg = this.add.rectangle(x, cardY, cardW, cardH, 0x1a1a15, 0.9);
      cardBg.setStrokeStyle(2, rarityColor);
      cardBg.setInteractive({ useHandCursor: true });

      // 费用印章（左上角）
      const costSeal = this.add.circle(x - 42, cardY - 65, 14, 0x2a1a1a, 0.9);
      costSeal.setStrokeStyle(2, 0x5a8ac8);

      const cost = this.add.text(x - 42, cardY - 65, `${tmpl.cost}`, {
        fontSize: '14px',
        color: '#8ac8ff',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      // 卡名（书法体）
      const name = this.add.text(x, cardY - 45, tmpl.name, {
        fontSize: '16px',
        fontFamily: '"STKaiti", "KaiTi", serif',
        color: '#e8d5b5',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      // 分隔线
      this.add.rectangle(x, cardY - 25, cardW - 20, 1, 0x4a3a2a, 0.5);

      // 效果描述
      const desc = this.add.text(x, cardY + 5, tmpl.description, {
        fontSize: '11px',
        color: '#a8a8a0',
        wordWrap: { width: cardW - 16 },
        align: 'center',
        lineSpacing: 2,
      }).setOrigin(0.5);

      // 类型标签
      const typeColor = tmpl.type === 'ATTACK' ? '#c85a5a' : tmpl.type === 'SKILL' ? '#5ac85a' : '#9a5ac8';
      const typeTag = this.add.text(x, cardY + 45, `【${typeName}】`, {
        fontSize: '10px',
        color: typeColor,
      }).setOrigin(0.5);

      // 稀有度
      const rarityLabel = this.add.text(x, cardY + 65, rarityName, {
        fontSize: '9px',
        color: `#${rarityColor.toString(16).padStart(6, '0')}`,
      }).setOrigin(0.5);

      // 交互
      cardBg.on('pointerover', () => {
        cardBg.setFillStyle(0x2a2a20, 0.95);
        cardBg.setScale(1.05);
      });
      cardBg.on('pointerout', () => {
        cardBg.setFillStyle(0x1a1a15, 0.9);
        cardBg.setScale(1.0);
      });

      cardBg.on('pointerdown', () => {
        this.playerState.deckTemplateIds.push(tmpl.id);
        GameData.save(this.playerState);

        // 选择动画
        cardBg.setStrokeStyle(3, 0x6bff8a);
        const selectedText = this.add.text(width / 2, cardY + 110, `纳入牌组: ${tmpl.name}`, {
          fontSize: '14px',
          color: '#6bff8a',
        }).setOrigin(0.5);

        this.time.delayedCall(800, () => this.scene.start('MapScene'));
      });
    });

    // 跳过按钮
    const skipBg = this.add.rectangle(width / 2, 550, 120, 36, 0x1a1a15, 0.7);
    skipBg.setStrokeStyle(1, 0x3a3a2a);
    skipBg.setInteractive({ useHandCursor: true });
    const skipText = this.add.text(width / 2, 550, '跳过', {
      fontSize: '14px',
      color: '#6a5a4a',
    }).setOrigin(0.5);

    skipBg.on('pointerover', () => skipBg.setFillStyle(0x2a2a20, 0.8));
    skipBg.on('pointerout', () => skipBg.setFillStyle(0x1a1a15, 0.7));
    skipBg.on('pointerdown', () => this.scene.start('MapScene'));
  }

  private getRarityColor(rarity: Rarity): number {
    switch (rarity) {
      case Rarity.COMMON: return 0x6a6a5a;
      case Rarity.RARE: return 0x4a6ac8;
      case Rarity.EPIC: return 0x8a4ac8;
      case Rarity.LEGENDARY: return 0xc89a3a;
    }
  }

  private getRarityName(rarity: Rarity): string {
    switch (rarity) {
      case Rarity.COMMON: return '凡品';
      case Rarity.RARE: return '良品';
      case Rarity.EPIC: return '极品';
      case Rarity.LEGENDARY: return '传说';
    }
  }
}
