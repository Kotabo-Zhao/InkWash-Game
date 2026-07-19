/**
 * ShopScene.ts - 商店场景
 */

import Phaser from 'phaser';
import { CardDatabase } from '../cards/CardDatabase';
import { GameData } from '../data/GameData';

interface ShopItem {
  name: string;
  desc: string;
  price: number;
  effect: (state: any) => void;
}

export class ShopScene extends Phaser.Scene {
  private playerState!: any;

  constructor() { super({ key: 'ShopScene' }); }

  init(): void {
    this.playerState = GameData.load() || GameData.createInitialPlayerState();
  }

  create(): void {
    this.add.rectangle(195, 422, 390, 844, 0x0f0f1a);

    this.add.text(195, 60, '商店', {
      fontSize: '24px', color: '#ffd76b',
    }).setOrigin(0.5);

    const goldText = this.add.text(10, 10, `金币: ${this.playerState.gold}`, {
      fontSize: '16px', color: '#ffd76b',
    });

    // 商品列表
    const items: ShopItem[] = [
      {
        name: '生命药水',
        desc: '恢复 20 HP',
        price: 50,
        effect: (state) => {
          state.hp = Math.min(state.maxHp, state.hp + 20);
        },
      },
      {
        name: '最大生命',
        desc: '+5 最大 HP',
        price: 75,
        effect: (state) => {
          state.maxHp += 5;
          state.hp += 5;
        },
      },
      {
        name: '随机卡牌',
        desc: '获得一张随机卡牌',
        price: 100,
        effect: (state) => {
          const cards = ['strike', 'defend', 'heavyStrike', 'cleave', 'ironSkin'];
          const randomCard = cards[Math.floor(Math.random() * cards.length)];
          state.deckTemplateIds.push(randomCard);
        },
      },
    ];

    items.forEach((item, idx) => {
      const y = 150 + idx * 100;

      const bg = this.add.rectangle(195, y, 340, 80, 0x1a2a3e);
      bg.setStrokeStyle(1, 0x4a6a8e);

      const name = this.add.text(20, y - 25, item.name, {
        fontSize: '16px', color: '#e8d5b5',
      });

      const desc = this.add.text(20, y - 5, item.desc, {
        fontSize: '12px', color: '#888',
      });

      const price = this.add.text(320, y - 15, `${item.price}G`, {
        fontSize: '14px', color: '#ffd76b',
      }).setOrigin(1, 0.5);

      const buyBtn = this.add.text(320, y + 10, '[ 购买 ]', {
        fontSize: '12px', color: '#6bff8a',
      }).setOrigin(1, 0.5);
      buyBtn.setInteractive({ useHandCursor: true });

      buyBtn.on('pointerdown', () => {
        if (this.playerState.gold >= item.price) {
          this.playerState.gold -= item.price;
          item.effect(this.playerState);
          GameData.save(this.playerState);

          goldText.setText(`金币: ${this.playerState.gold}`);

          this.add.text(195, 500, `购买了 ${item.name}`, {
            fontSize: '14px', color: '#6bff8a',
          }).setOrigin(0.5);

          this.time.delayedCall(1000, () => {
            this.children.list
              .filter(c => c instanceof Phaser.GameObjects.Text && (c as any).y === 500)
              .forEach(c => c.destroy());
          });
        } else {
          this.add.text(195, 500, '金币不足', {
            fontSize: '14px', color: '#ff6b7a',
          }).setOrigin(0.5);

          this.time.delayedCall(1000, () => {
            this.children.list
              .filter(c => c instanceof Phaser.GameObjects.Text && (c as any).y === 500)
              .forEach(c => c.destroy());
          });
        }
      });
    });

    // 离开按钮
    const leave = this.add.text(195, 700, '[ 离开商店 ]', {
      fontSize: '16px', color: '#888',
    }).setOrigin(0.5);
    leave.setInteractive({ useHandCursor: true });
    leave.on('pointerdown', () => this.scene.start('MapScene'));
  }
}
