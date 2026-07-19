/**
 * ShopScene.ts - 商店场景（水墨风）
 * 接入 ShopData：卡牌 + 消耗品 + 遗物 三类商品
 */

import Phaser from 'phaser';
import { GameData, PlayerState } from '../data/GameData';
import { generateShopItems, applyShopDiscount, CONSUMABLES, RELICS, ConsumableItem, RelicItem } from '../data/ShopData';
import { CardDatabase } from '../cards/CardDatabase';
import { Rarity } from '../cards/CardSystem';

export class ShopScene extends Phaser.Scene {
  private playerState!: PlayerState;
  private goldText!: Phaser.GameObjects.Text;
  private scrollY: number = 0;
  private contentContainer!: Phaser.GameObjects.Container;
  private shopItems!: ReturnType<typeof generateShopItems>;

  // 已购买标记（防止重复购买）
  private purchasedCards: Set<number> = new Set();
  private purchasedConsumables: Set<number> = new Set();
  private purchasedRelics: Set<number> = new Set();

  constructor() { super({ key: 'ShopScene' }); }

  init(): void {
    this.playerState = GameData.load() || GameData.createInitialPlayerState();
    this.shopItems = generateShopItems(
      this.playerState.currentChapter,
      this.playerState.relics || []
    );
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

    // 固定顶部状态栏
    const hudBg = this.add.rectangle(width / 2, 30, width - 20, 36, 0x1a1a15, 0.9);
    hudBg.setStrokeStyle(1, 0x4a3a2a);
    hudBg.setDepth(10);

    this.add.text(15, 30, `♥ ${this.playerState.hp}/${this.playerState.maxHp}`, {
      fontSize: '12px', color: '#c85a5a',
    }).setOrigin(0, 0.5).setDepth(10);

    this.goldText = this.add.text(140, 30, `💰 ${this.playerState.gold}`, {
      fontSize: '13px', color: '#c8a85a', fontStyle: 'bold',
    }).setOrigin(0, 0.5).setDepth(10);

    this.add.text(width - 15, 30, `第${this.playerState.currentChapter}章`, {
      fontSize: '12px', color: '#8a7a6a',
    }).setOrigin(1, 0.5).setDepth(10);

    // 标题
    this.add.text(width / 2, 72, '行 商', {
      fontSize: '26px',
      fontFamily: '"STKaiti", "KaiTi", serif',
      color: '#e8c5a5',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 96, '—— 奇货可居 ——', {
      fontSize: '10px',
      color: '#6a5a4a',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // 可滚动内容区
    this.contentContainer = this.add.container(0, 0);
    let yOffset = 120;

    // === 卡牌区 ===
    if (this.shopItems.cards.length > 0) {
      this.addSectionHeader(yOffset, '卡牌');
      yOffset += 24;

      this.shopItems.cards.forEach((cardItem, idx) => {
        const template = CardDatabase[cardItem.id];
        if (!template) return;

        const price = applyShopDiscount(cardItem.price, this.playerState.relics || []);
        const y = yOffset + idx * 90;
        this.renderCardItem(y, template, price, idx);
      });

      yOffset += this.shopItems.cards.length * 90 + 10;
    }

    // === 消耗品区 ===
    if (this.shopItems.consumables.length > 0) {
      this.addSectionHeader(yOffset, '消耗品');
      yOffset += 24;

      this.shopItems.consumables.forEach((item, idx) => {
        const price = applyShopDiscount(item.price, this.playerState.relics || []);
        const y = yOffset + idx * 80;
        this.renderConsumableItem(y, item, price, idx);
      });

      yOffset += this.shopItems.consumables.length * 80 + 10;
    }

    // === 遗物区 ===
    if (this.shopItems.relics.length > 0) {
      this.addSectionHeader(yOffset, '遗物');
      yOffset += 24;

      this.shopItems.relics.forEach((item, idx) => {
        const price = applyShopDiscount(item.price, this.playerState.relics || []);
        const y = yOffset + idx * 90;
        this.renderRelicItem(y, item, price, idx);
      });

      yOffset += this.shopItems.relics.length * 90;
    }

    // 固定底部按钮
    const leaveBg = this.add.rectangle(width / 2, height - 40, 140, 36, 0x1a1a15, 0.9);
    leaveBg.setStrokeStyle(1, 0x3a3a2a);
    leaveBg.setInteractive({ useHandCursor: true });
    leaveBg.setDepth(10);

    this.add.text(width / 2, height - 40, '离开商铺', {
      fontSize: '14px',
      color: '#6a5a4a',
    }).setOrigin(0.5).setDepth(10);

    leaveBg.on('pointerover', () => leaveBg.setFillStyle(0x2a2a20, 0.95));
    leaveBg.on('pointerout', () => leaveBg.setFillStyle(0x1a1a15, 0.9));
    leaveBg.on('pointerdown', () => this.scene.start('MapScene'));

    // 滚动支持
    this.input.on('wheel', (_pointer: any, _gameObjects: any, _dx: number, dy: number) => {
      this.scrollY -= dy * 0.5;
      this.scrollY = Math.min(0, this.scrollY);
      this.scrollY = Math.max(-(yOffset - 500), this.scrollY);
      this.contentContainer.y = this.scrollY;
    });
  }

  private addSectionHeader(y: number, title: string): void {
    const { width } = this.cameras.main;

    const line = this.add.rectangle(width / 2, y, width - 40, 1, 0x4a3a2a, 0.4);
    this.contentContainer.add(line);

    const label = this.add.text(width / 2, y, `【 ${title} 】`, {
      fontSize: '13px',
      fontFamily: '"STKaiti", "KaiTi", serif',
      color: '#c8a85a',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.contentContainer.add(label);

    // 背景遮盖线条
    const mask = this.add.rectangle(width / 2, y, 100, 14, 0x0f0a0a);
    this.contentContainer.add(mask);
    // 重新添加文字到mask上方
    label.setDepth(2);
  }

  private renderCardItem(y: number, template: any, price: number, idx: number): void {
    const { width } = this.cameras.main;
    const cardW = width - 40;
    const cardH = 80;

    const rarityColor = this.getRarityColor(template.rarity);

    const bg = this.add.rectangle(width / 2, y + cardH / 2, cardW, cardH, 0x1a1a15, 0.85);
    bg.setStrokeStyle(1, rarityColor);
    this.contentContainer.add(bg);

    // 卡牌名
    this.contentContainer.add(
      this.add.text(20, y + 10, template.name, {
        fontSize: '14px',
        fontFamily: '"STKaiti", "KaiTi", serif',
        color: '#e8d5b5',
        fontStyle: 'bold',
      })
    );

    // 费用
    this.contentContainer.add(
      this.add.text(20, y + 32, `费用: ${template.cost}`, {
        fontSize: '11px', color: '#8ac8ff',
      })
    );

    // 效果
    this.contentContainer.add(
      this.add.text(20, y + 50, template.description, {
        fontSize: '10px',
        color: '#a8a8a0',
        wordWrap: { width: cardW - 120 },
      })
    );

    // 类型标签
    const typeName = template.type === 'ATTACK' ? '攻击' : template.type === 'SKILL' ? '技能' : '能力';
    const typeColor = template.type === 'ATTACK' ? '#c85a5a' : template.type === 'SKILL' ? '#5ac85a' : '#9a5ac8';
    this.contentContainer.add(
      this.add.text(cardW - 80, y + 10, `【${typeName}】`, {
        fontSize: '10px', color: typeColor,
      })
    );

    // 价格
    this.contentContainer.add(
      this.add.text(cardW - 80, y + 30, `${price}💰`, {
        fontSize: '12px', color: '#c8a85a', fontStyle: 'bold',
      })
    );

    // 购买按钮
    const buyBg = this.add.rectangle(cardW - 55, y + 55, 50, 22, 0x2a2a20, 0.8);
    buyBg.setStrokeStyle(1, 0x4a4a3a);
    buyBg.setInteractive({ useHandCursor: true });
    this.contentContainer.add(buyBg);

    const buyText = this.add.text(cardW - 55, y + 55, '购入', {
      fontSize: '10px', color: '#c8a85a',
    }).setOrigin(0.5);
    this.contentContainer.add(buyText);

    buyBg.on('pointerdown', () => {
      if (this.purchasedCards.has(idx)) return;
      if (this.playerState.gold < price) {
        this.showFloatMsg('囊中羞涩', '#ff6b7a');
        return;
      }
      this.playerState.gold -= price;
      this.playerState.deckTemplateIds.push(template.id);
      GameData.save(this.playerState);
      this.goldText.setText(`💰 ${this.playerState.gold}`);
      this.purchasedCards.add(idx);

      buyBg.setFillStyle(0x1a2a1a);
      buyText.setText('已购').setColor('#5a8a5a');
      buyBg.disableInteractive();
      this.showFloatMsg(`获得: ${template.name}`, '#6bff8a');
    });
  }

  private renderConsumableItem(y: number, item: ConsumableItem, price: number, idx: number): void {
    const { width } = this.cameras.main;
    const cardW = width - 40;
    const cardH = 70;

    const bg = this.add.rectangle(width / 2, y + cardH / 2, cardW, cardH, 0x1a1a15, 0.85);
    bg.setStrokeStyle(1, 0x4a3a2a);
    this.contentContainer.add(bg);

    this.contentContainer.add(
      this.add.text(20, y + 12, item.name, {
        fontSize: '14px',
        fontFamily: '"STKaiti", "KaiTi", serif',
        color: '#e8d5b5',
        fontStyle: 'bold',
      })
    );

    this.contentContainer.add(
      this.add.text(20, y + 35, item.description, {
        fontSize: '11px', color: '#a8a8a0',
      })
    );

    this.contentContainer.add(
      this.add.text(cardW - 80, y + 15, `${price}💰`, {
        fontSize: '12px', color: '#c8a85a', fontStyle: 'bold',
      })
    );

    const buyBg = this.add.rectangle(cardW - 55, y + 42, 50, 22, 0x2a2a20, 0.8);
    buyBg.setStrokeStyle(1, 0x4a4a3a);
    buyBg.setInteractive({ useHandCursor: true });
    this.contentContainer.add(buyBg);

    const buyText = this.add.text(cardW - 55, y + 42, '购入', {
      fontSize: '10px', color: '#c8a85a',
    }).setOrigin(0.5);
    this.contentContainer.add(buyText);

    buyBg.on('pointerdown', () => {
      if (this.purchasedConsumables.has(idx)) return;
      if (this.playerState.gold < price) {
        this.showFloatMsg('囊中羞涩', '#ff6b7a');
        return;
      }
      this.playerState.gold -= price;
      item.effect(this.playerState);
      GameData.save(this.playerState);
      this.goldText.setText(`💰 ${this.playerState.gold}`);
      this.purchasedConsumables.add(idx);

      buyBg.setFillStyle(0x1a2a1a);
      buyText.setText('已购').setColor('#5a8a5a');
      buyBg.disableInteractive();
      this.showFloatMsg(`使用: ${item.name}`, '#6bff8a');
    });
  }

  private renderRelicItem(y: number, item: RelicItem, price: number, idx: number): void {
    const { width } = this.cameras.main;
    const cardW = width - 40;
    const cardH = 80;

    const bg = this.add.rectangle(width / 2, y + cardH / 2, cardW, cardH, 0x1a1a15, 0.85);
    bg.setStrokeStyle(2, 0x8a6a3a);
    this.contentContainer.add(bg);

    // 遗物标记
    const seal = this.add.rectangle(35, y + 25, 30, 30, 0x3a2a1a, 0.9);
    seal.setStrokeStyle(1, 0x8a6a3a);
    this.contentContainer.add(seal);

    this.contentContainer.add(
      this.add.text(35, y + 25, '宝', {
        fontSize: '14px',
        fontFamily: '"STKaiti", "KaiTi", serif',
        color: '#c8a85a',
        fontStyle: 'bold',
      }).setOrigin(0.5)
    );

    this.contentContainer.add(
      this.add.text(60, y + 12, item.name, {
        fontSize: '14px',
        fontFamily: '"STKaiti", "KaiTi", serif',
        color: '#e8d5b5',
        fontStyle: 'bold',
      })
    );

    this.contentContainer.add(
      this.add.text(60, y + 35, item.description, {
        fontSize: '11px', color: '#a8a8a0',
      })
    );

    this.contentContainer.add(
      this.add.text(60, y + 55, '永久生效', {
        fontSize: '9px', color: '#6a9a6a', fontStyle: 'italic',
      })
    );

    this.contentContainer.add(
      this.add.text(cardW - 80, y + 15, `${price}💰`, {
        fontSize: '12px', color: '#c8a85a', fontStyle: 'bold',
      })
    );

    const buyBg = this.add.rectangle(cardW - 55, y + 50, 50, 22, 0x2a2a20, 0.8);
    buyBg.setStrokeStyle(1, 0x6a5a3a);
    buyBg.setInteractive({ useHandCursor: true });
    this.contentContainer.add(buyBg);

    const buyText = this.add.text(cardW - 55, y + 50, '购入', {
      fontSize: '10px', color: '#c8a85a',
    }).setOrigin(0.5);
    this.contentContainer.add(buyText);

    buyBg.on('pointerdown', () => {
      if (this.purchasedRelics.has(idx)) return;
      if (this.playerState.gold < price) {
        this.showFloatMsg('囊中羞涩', '#ff6b7a');
        return;
      }
      this.playerState.gold -= price;
      if (!this.playerState.relics) this.playerState.relics = [];
      this.playerState.relics.push(item.id);
      GameData.save(this.playerState);
      this.goldText.setText(`💰 ${this.playerState.gold}`);
      this.purchasedRelics.add(idx);

      buyBg.setFillStyle(0x1a2a1a);
      buyText.setText('已购').setColor('#5a8a5a');
      buyBg.disableInteractive();
      this.showFloatMsg(`获得遗物: ${item.name}`, '#ffd76b');
    });
  }

  private showFloatMsg(msg: string, color: string): void {
    const { width, height } = this.cameras.main;
    const t = this.add.text(width / 2, height - 90, msg, {
      fontSize: '14px', color, fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(20);

    this.tweens.add({
      targets: t,
      y: height - 120,
      alpha: 0,
      duration: 1200,
      onComplete: () => t.destroy(),
    });
  }

  private getRarityColor(rarity: Rarity): number {
    switch (rarity) {
      case Rarity.COMMON: return 0x4a4a3a;
      case Rarity.RARE: return 0x4a6ac8;
      case Rarity.EPIC: return 0x8a4ac8;
      case Rarity.LEGENDARY: return 0xc89a3a;
    }
  }
}
