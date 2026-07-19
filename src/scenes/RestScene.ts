/**
 * RestScene.ts - 休息场景
 */

import Phaser from 'phaser';
import { GameData } from '../data/GameData';

export class RestScene extends Phaser.Scene {
  private playerState!: any;

  constructor() { super({ key: 'RestScene' }); }

  init(): void {
    this.playerState = GameData.load() || GameData.createInitialPlayerState();
  }

  create(): void {
    this.add.rectangle(195, 422, 390, 844, 0x0f0f1a);

    this.add.text(195, 80, '篝火', {
      fontSize: '24px', color: '#ffd76b',
    }).setOrigin(0.5);

    this.add.text(195, 120, '你找到了一个安全的休息点', {
      fontSize: '14px', color: '#aaa',
    }).setOrigin(0.5);

    // 玩家状态
    this.add.text(10, 10, `HP: ${this.playerState.hp}/${this.playerState.maxHp}`, {
      fontSize: '14px', color: '#6bff8a',
    });

    // 选项
    const options = [
      {
        name: '休息',
        desc: `恢复 ${Math.floor(this.playerState.maxHp * 0.3)} HP`,
        action: () => {
          const healAmount = Math.floor(this.playerState.maxHp * 0.3);
          this.playerState.hp = Math.min(this.playerState.maxHp, this.playerState.hp + healAmount);
          GameData.save(this.playerState);
          this.showResult(`恢复了 ${healAmount} HP`);
        },
      },
      {
        name: '冥想',
        desc: '升级一张卡牌',
        action: () => {
          // 升级随机一张牌
          if (this.playerState.deckTemplateIds.length > 0) {
            const idx = Math.floor(Math.random() * this.playerState.deckTemplateIds.length);
            const cardId = this.playerState.deckTemplateIds[idx];
            if (!cardId.includes('+')) {
              this.playerState.deckTemplateIds[idx] = cardId + 'Upgraded';
              GameData.save(this.playerState);
              this.showResult(`升级了 ${cardId}`);
            } else {
              this.showResult('没有可升级的卡牌');
            }
          }
        },
      },
    ];

    options.forEach((opt, idx) => {
      const y = 200 + idx * 100;
      const bg = this.add.rectangle(195, y, 300, 80, 0x1a2a3e);
      bg.setStrokeStyle(1, 0x4a6a8e);
      bg.setInteractive({ useHandCursor: true });

      const name = this.add.text(195, y - 15, opt.name, {
        fontSize: '18px', color: '#e8d5b5',
      }).setOrigin(0.5);

      const desc = this.add.text(195, y + 10, opt.desc, {
        fontSize: '12px', color: '#888',
      }).setOrigin(0.5);

      bg.on('pointerover', () => bg.setFillStyle(0x2a3a5e));
      bg.on('pointerout', () => bg.setFillStyle(0x1a2a3e));

      bg.on('pointerdown', () => {
        opt.action();
      });
    });

    const leave = this.add.text(195, 500, '[ 直接离开 ]', {
      fontSize: '16px', color: '#888',
    }).setOrigin(0.5);
    leave.setInteractive({ useHandCursor: true });
    leave.on('pointerdown', () => this.scene.start('MapScene'));
  }

  private showResult(msg: string): void {
    const resultText = this.add.text(195, 400, msg, {
      fontSize: '16px', color: '#6bff8a',
    }).setOrigin(0.5);

    this.time.delayedCall(1500, () => {
      resultText.destroy();
      this.scene.start('MapScene');
    });
  }
}
