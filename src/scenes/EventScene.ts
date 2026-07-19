/**
 * EventScene.ts - 随机事件场景
 */

import Phaser from 'phaser';
import { getRandomEvent, GameEvent } from '../data/EventData';
import { GameData } from '../data/GameData';

export class EventScene extends Phaser.Scene {
  private playerState!: any;

  constructor() { super({ key: 'EventScene' }); }

  init(): void {
    this.playerState = GameData.load() || GameData.createInitialPlayerState();
  }

  create(): void {
    this.add.rectangle(195, 422, 390, 844, 0x0f0f1a);

    const event = getRandomEvent();

    // 玩家状态
    this.add.text(10, 10, `HP: ${this.playerState.hp}/${this.playerState.maxHp}`, {
      fontSize: '14px', color: '#6bff8a',
    });
    this.add.text(10, 30, `金币: ${this.playerState.gold}`, {
      fontSize: '14px', color: '#ffd76b',
    });

    // 事件标题
    this.add.text(195, 80, event.title, {
      fontSize: '24px', color: '#e8d5b5',
    }).setOrigin(0.5);

    // 事件描述
    this.add.text(195, 140, event.description, {
      fontSize: '14px', color: '#aaa',
      wordWrap: { width: 340 },
      align: 'center',
    }).setOrigin(0.5);

    // 背景描述
    this.add.text(195, 180, event.background, {
      fontSize: '12px', color: '#666',
      wordWrap: { width: 340 },
      align: 'center',
    }).setOrigin(0.5);

    // 选项
    let validOptions = event.options.filter(opt => {
      if (opt.condition) {
        return opt.condition(this.playerState);
      }
      return true;
    });

    validOptions.forEach((opt, idx) => {
      const y = 260 + idx * 80;
      const bg = this.add.rectangle(195, y, 300, 60, 0x1a2a3e);
      bg.setStrokeStyle(1, 0x4a6a8e);
      bg.setInteractive({ useHandCursor: true });

      const text = this.add.text(195, y, opt.text, {
        fontSize: '14px', color: '#6bb5ff',
      }).setOrigin(0.5);

      bg.on('pointerover', () => bg.setFillStyle(0x2a3a5e));
      bg.on('pointerout', () => bg.setFillStyle(0x1a2a3e));

      bg.on('pointerdown', () => {
        // 应用效果
        opt.effect(this.playerState);
        GameData.save(this.playerState);

        // 清除选项
        this.children.list
          .filter(c => c instanceof Phaser.GameObjects.Rectangle || c instanceof Phaser.GameObjects.Text)
          .filter(c => (c as any).y > 200)
          .forEach(c => c.destroy());

        // 显示结果
        this.add.text(195, 300, opt.result, {
          fontSize: '14px', color: '#6bff8a',
          wordWrap: { width: 340 },
          align: 'center',
        }).setOrigin(0.5);

        // 返回按钮
        const returnBtn = this.add.text(195, 500, '[ 继续 ]', {
          fontSize: '16px', color: '#888',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        returnBtn.on('pointerdown', () => this.scene.start('MapScene'));
      });
    });
  }
}
