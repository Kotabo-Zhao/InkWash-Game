/**
 * ShopScene.ts - 商店场景（水墨风）
 */

import Phaser from 'phaser';
import { GameData } from '../data/GameData';

export class ShopScene extends Phaser.Scene {
  private playerState!: any;

  constructor() { super({ key: 'ShopScene' }); }

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

    // 顶部状态栏
    const hudBg = this.add.rectangle(width / 2, 40, width - 20, 32, 0x1a1a15, 0.7);
    hudBg.setStrokeStyle(1, 0x4a3a2a);

    const goldText = this.add.text(15, 40, `💰 ${this.playerState.gold}`, {
      fontSize: '14px',
      color: '#c8a85a',
    }).setOrigin(0, 0.5);

    // 商店标题（书法体）
    this.add.text(width / 2, 90, '行商', {
      fontSize: '28px',
      fontFamily: '"STKaiti", "KaiTi", serif',
      color: '#e8c5a5',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 118, '—— 奇货可居 ——', {
      fontSize: '11px',
      color: '#6a5a4a',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // 商品列表
    const items = [
      {
        name: '生命药水',
        desc: '恢复20点生命',
        detail: '瓶中药液散发着淡淡墨香',
        price: 50,
        effect: (state: any) => {
          state.hp = Math.min(state.maxHp, state.hp + 20);
        },
      },
      {
        name: '墨池精华',
        desc: '永久增加5点最大生命',
        detail: '凝练的墨汁蕴含深厚力量',
        price: 75,
        effect: (state: any) => {
          state.maxHp += 5;
          state.hp += 5;
        },
      },
      {
        name: '残卷',
        desc: '获得一张随机卡牌',
        detail: '不知其中记载何种武学',
        price: 100,
        effect: (state: any) => {
          const cards = ['strike', 'defend', 'heavyStrike', 'cleave', 'ironSkin', 'quickSlash', 'doubleStrike'];
          const randomCard = cards[Math.floor(Math.random() * cards.length)];
          state.deckTemplateIds.push(randomCard);
        },
      },
    ];

    const itemStartY = 160;
    const itemGap = 120;

    items.forEach((item, idx) => {
      const y = itemStartY + idx * itemGap;

      // 商品卡片背景
      const cardBg = this.add.rectangle(width / 2, y, width - 40, 100, 0x1a1a15, 0.8);
      cardBg.setStrokeStyle(1, 0x4a3a2a);

      // 商品名（书法体）
      this.add.text(25, y - 30, item.name, {
        fontSize: '16px',
        fontFamily: '"STKaiti", "KaiTi", serif',
        color: '#e8d5b5',
        fontStyle: 'bold',
      });

      // 描述
      this.add.text(25, y - 8, item.desc, {
        fontSize: '12px',
        color: '#a8a8a0',
      });

      // 详情（小字）
      this.add.text(25, y + 10, item.detail, {
        fontSize: '10px',
        color: '#6a5a4a',
        fontStyle: 'italic',
      });

      // 价格印章
      const priceSeal = this.add.rectangle(width - 80, y - 20, 60, 28, 0x2a1a1a, 0.9);
      priceSeal.setStrokeStyle(1, 0x6a3a2a);

      this.add.text(width - 80, y - 20, `${item.price}💰`, {
        fontSize: '11px',
        color: '#c8a85a',
      }).setOrigin(0.5);

      // 购买按钮
      const buyBg = this.add.rectangle(width - 80, y + 15, 60, 26, 0x2a2a20, 0.8);
      buyBg.setStrokeStyle(1, 0x4a4a3a);
      buyBg.setInteractive({ useHandCursor: true });

      const buyText = this.add.text(width - 80, y + 15, '购买', {
        fontSize: '11px',
        color: '#c8a85a',
      }).setOrigin(0.5);

      buyBg.on('pointerover', () => buyBg.setFillStyle(0x3a3a2a, 0.9));
      buyBg.on('pointerout', () => buyBg.setFillStyle(0x2a2a20, 0.8));

      buyBg.on('pointerdown', () => {
        if (this.playerState.gold >= item.price) {
          this.playerState.gold -= item.price;
          item.effect(this.playerState);
          GameData.save(this.playerState);

          goldText.setText(`💰 ${this.playerState.gold}`);

          // 购买成功提示
          const successText = this.add.text(width / 2, height - 100, `已购入: ${item.name}`, {
            fontSize: '14px',
            color: '#6bff8a',
          }).setOrigin(0.5);

          this.tweens.add({
            targets: successText,
            y: height - 130,
            alpha: 0,
            duration: 1000,
            onComplete: () => successText.destroy(),
          });
        } else {
          // 金币不足提示
          const failText = this.add.text(width / 2, height - 100, '囊中羞涩', {
            fontSize: '14px',
            color: '#ff6b7a',
          }).setOrigin(0.5);

          this.tweens.add({
            targets: failText,
            y: height - 130,
            alpha: 0,
            duration: 1000,
            onComplete: () => failText.destroy(),
          });
        }
      });
    });

    // 离开按钮
    const leaveBg = this.add.rectangle(width / 2, height - 60, 120, 36, 0x1a1a15, 0.7);
    leaveBg.setStrokeStyle(1, 0x3a3a2a);
    leaveBg.setInteractive({ useHandCursor: true });

    this.add.text(width / 2, height - 60, '离开商铺', {
      fontSize: '14px',
      color: '#6a5a4a',
    }).setOrigin(0.5);

    leaveBg.on('pointerover', () => leaveBg.setFillStyle(0x2a2a20, 0.8));
    leaveBg.on('pointerout', () => leaveBg.setFillStyle(0x1a1a15, 0.7));
    leaveBg.on('pointerdown', () => this.scene.start('MapScene'));
  }
}
