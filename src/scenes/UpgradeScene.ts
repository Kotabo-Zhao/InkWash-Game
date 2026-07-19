/**
 * UpgradeScene.ts - 卡牌升级场景（水墨风）
 */

import Phaser from 'phaser';
import { CardDatabase } from '../cards/CardDatabase';
import { GameData, PlayerState } from '../data/GameData';

export class UpgradeScene extends Phaser.Scene {
  private selectedCardIndex: number = -1;
  private playerState!: PlayerState;
  private previewContainer!: Phaser.GameObjects.Container;
  private previewText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'UpgradeScene' });
  }

  init(data: { playerState: PlayerState }) {
    this.playerState = data.playerState || GameData.load();
    if (!this.playerState) {
      this.playerState = GameData.createInitialPlayerState();
    }
  }

  create() {
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

    // 顶部标题（书法体）
    const titleBg = this.add.rectangle(width / 2, 35, 240, 36, 0x2a1a1a, 0.8);
    titleBg.setStrokeStyle(1, 0x6a3a2a);

    this.add.text(width / 2, 35, '冥想 · 淬炼', {
      fontSize: '18px',
      fontFamily: '"STKaiti", "KaiTi", serif',
      color: '#e8c5a5',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 62, '—— 选择一张卡牌升级 ——', {
      fontSize: '11px',
      color: '#6a5a4a',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // 显示卡牌
    const deck = this.playerState.deckTemplateIds;
    const cardsPerRow = 5;
    const cardWidth = 65;
    const cardHeight = 90;
    const startX = width / 2 - (cardsPerRow * (cardWidth + 8)) / 2 + cardWidth / 2;
    const startY = 110;

    deck.forEach((templateId, index) => {
      const template = CardDatabase[templateId];
      if (!template) return;

      const isUpgraded = templateId.includes('Upgraded') || templateId.endsWith('+');
      
      const row = Math.floor(index / cardsPerRow);
      const col = index % cardsPerRow;
      const x = startX + col * (cardWidth + 8);
      const y = startY + row * (cardHeight + 8);

      const cardContainer = this.add.container(x, y);

      // 宣纸底色卡牌背景
      const bgColor = isUpgraded ? 0x2a2a20 : 0x1a1a15;
      const borderColor = isUpgraded ? 0x6a6a4a : 0x4a3a2a;
      
      const bg = this.add.rectangle(0, 0, cardWidth, cardHeight, bgColor, 0.9);
      bg.setStrokeStyle(2, borderColor);
      cardContainer.add(bg);

      // 卡名（书法体）
      const nameText = this.add.text(0, -cardHeight / 2 + 12, template.name, {
        fontSize: '11px',
        fontFamily: '"STKaiti", "KaiTi", serif',
        color: isUpgraded ? '#a8a870' : '#e8d5b5',
        fontStyle: isUpgraded ? 'bold' : 'normal',
      }).setOrigin(0.5);
      cardContainer.add(nameText);

      // 费用印章
      const costSeal = this.add.circle(-cardWidth / 2 + 12, -cardHeight / 2 + 10, 9, 0x2a1a1a, 0.9);
      costSeal.setStrokeStyle(1, 0x5a8ac8);
      cardContainer.add(costSeal);

      const costText = this.add.text(-cardWidth / 2 + 12, -cardHeight / 2 + 10, `${template.cost}`, {
        fontSize: '10px',
        color: '#8ac8ff',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      cardContainer.add(costText);

      // 分隔线
      const separator = this.add.rectangle(0, -cardHeight / 2 + 24, cardWidth - 16, 1, 0x4a3a2a, 0.5);
      cardContainer.add(separator);

      // 效果描述
      const descText = this.add.text(0, 5, template.description, {
        fontSize: '9px',
        color: '#a8a8a0',
        wordWrap: { width: cardWidth - 10 },
        align: 'center',
      }).setOrigin(0.5);
      cardContainer.add(descText);

      // 类型标签
      const typeLabel = template.type === 'ATTACK' ? '攻击' : 
                        template.type === 'SKILL' ? '技能' : '能力';
      const typeColor = template.type === 'ATTACK' ? '#c85a5a' : 
                        template.type === 'SKILL' ? '#5ac85a' : '#9a5ac8';
      const typeText = this.add.text(0, cardHeight / 2 - 10, typeLabel, {
        fontSize: '9px',
        color: typeColor,
      }).setOrigin(0.5);
      cardContainer.add(typeText);

      // 交互
      if (!isUpgraded) {
        cardContainer.setSize(cardWidth, cardHeight);
        cardContainer.setInteractive({ useHandCursor: true });
        cardContainer.on('pointerover', () => {
          bg.setFillStyle(0x2a2a20, 0.95);
          bg.setStrokeStyle(3, 0xc8a85a);
        });
        cardContainer.on('pointerout', () => {
          bg.setFillStyle(bgColor, 0.9);
          bg.setStrokeStyle(2, borderColor);
        });
        cardContainer.on('pointerdown', () => this.selectCard(index));
      } else {
        // 已升级标记
        const badge = this.add.text(cardWidth / 2 - 5, -cardHeight / 2 + 5, '✓', {
          fontSize: '12px',
          color: '#6a9a6a',
        }).setOrigin(0.5);
        cardContainer.add(badge);
      }
    });

    // 预览区（水墨风）
    this.previewContainer = this.add.container(width / 2, height - 120);
    
    const previewBg = this.add.rectangle(0, 0, width - 40, 80, 0x1a1a15, 0.9);
    previewBg.setStrokeStyle(2, 0x4a3a2a);
    this.previewContainer.add(previewBg);

    this.previewText = this.add.text(0, 0, '点击卡牌查看升级效果', {
      fontSize: '13px',
      color: '#8a7a6a',
      align: 'center',
    }).setOrigin(0.5);
    this.previewContainer.add(this.previewText);

    // 底部按钮
    const buttonY = height - 50;
    
    const confirmBg = this.add.rectangle(width / 2 - 70, buttonY, 100, 32, 0x2a2a20, 0.8);
    confirmBg.setStrokeStyle(1, 0x4a4a3a);
    confirmBg.setInteractive({ useHandCursor: true });

    const confirmText = this.add.text(width / 2 - 70, buttonY, '确认升级', {
      fontSize: '13px',
      color: '#c8a85a',
    }).setOrigin(0.5);

    confirmBg.on('pointerover', () => confirmBg.setFillStyle(0x3a3a2a, 0.9));
    confirmBg.on('pointerout', () => confirmBg.setFillStyle(0x2a2a20, 0.8));
    confirmBg.on('pointerdown', () => this.confirmUpgrade());

    const cancelBg = this.add.rectangle(width / 2 + 70, buttonY, 100, 32, 0x1a1a15, 0.8);
    cancelBg.setStrokeStyle(1, 0x3a3a2a);
    cancelBg.setInteractive({ useHandCursor: true });

    const cancelText = this.add.text(width / 2 + 70, buttonY, '返回', {
      fontSize: '13px',
      color: '#8a7a6a',
    }).setOrigin(0.5);

    cancelBg.on('pointerover', () => cancelBg.setFillStyle(0x2a2a20, 0.9));
    cancelBg.on('pointerout', () => cancelBg.setFillStyle(0x1a1a15, 0.8));
    cancelBg.on('pointerdown', () => this.scene.start('RestScene'));
  }

  private selectCard(index: number) {
    this.selectedCardIndex = index;
    const templateId = this.playerState.deckTemplateIds[index];
    const template = CardDatabase[templateId];
    
    if (!template) return;

    const upgradedId = templateId + 'Upgraded';
    const upgradedTemplate = CardDatabase[upgradedId];

    this.previewContainer.removeAll(true);

    const previewBg = this.add.rectangle(0, 0, this.cameras.main.width - 40, 80, 0x1a1a15, 0.9);
    previewBg.setStrokeStyle(2, 0x6a5a4a);
    this.previewContainer.add(previewBg);

    if (upgradedTemplate) {
      const beforeText = this.add.text(-90, -15, `${template.name}\n${template.description}`, {
        fontSize: '11px',
        color: '#8a7a6a',
        align: 'center',
      }).setOrigin(0.5);
      this.previewContainer.add(beforeText);

      const arrowText = this.add.text(0, -15, '→', {
        fontSize: '18px',
        color: '#c8a85a',
      }).setOrigin(0.5);
      this.previewContainer.add(arrowText);

      const afterText = this.add.text(90, -15, `${upgradedTemplate.name}\n${upgradedTemplate.description}`, {
        fontSize: '11px',
        color: '#e8d5b5',
        align: 'center',
      }).setOrigin(0.5);
      this.previewContainer.add(afterText);

      this.previewText = this.add.text(0, 22, `升级: ${template.name} → ${upgradedTemplate.name}`, {
        fontSize: '11px',
        color: '#6a9a6a',
        align: 'center',
      }).setOrigin(0.5);
      this.previewContainer.add(this.previewText);
    } else {
      this.previewText = this.add.text(0, 0, '该卡牌无法升级', {
        fontSize: '13px',
        color: '#c85a5a',
        align: 'center',
      }).setOrigin(0.5);
      this.previewContainer.add(this.previewText);
      this.selectedCardIndex = -1;
    }
  }

  private confirmUpgrade() {
    if (this.selectedCardIndex < 0) {
      this.previewContainer.removeAll(true);
      const warnBg = this.add.rectangle(0, 0, this.cameras.main.width - 40, 80, 0x1a1a15, 0.9);
      warnBg.setStrokeStyle(2, 0x6a3a3a);
      this.previewContainer.add(warnBg);
      
      this.previewText = this.add.text(0, 0, '请先选择一张卡牌', {
        fontSize: '13px',
        color: '#c85a5a',
        align: 'center',
      }).setOrigin(0.5);
      this.previewContainer.add(this.previewText);
      return;
    }

    const templateId = this.playerState.deckTemplateIds[this.selectedCardIndex];
    const upgradedId = templateId + 'Upgraded';
    
    if (!CardDatabase[upgradedId]) {
      return;
    }

    // 升级
    this.playerState.deckTemplateIds[this.selectedCardIndex] = upgradedId;
    GameData.save(this.playerState);

    // 视觉反馈
    this.cameras.main.flash(400, 138, 168, 107);
    
    this.time.delayedCall(600, () => {
      this.scene.start('RestScene');
    });
  }
}
