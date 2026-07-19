/**
 * ResultScene.ts - 结算场景
 */

import Phaser from 'phaser';
import { GameData } from '../data/GameData';

export class ResultScene extends Phaser.Scene {
  constructor() { super({ key: 'ResultScene' }); }

  create(): void {
    const { width, height } = this.cameras.main;

    this.cameras.main.setBackgroundColor('#0f0f1a');

    this.add.text(width / 2, height * 0.3, '游戏结束', {
      fontSize: '36px', color: '#e8d5b5',
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.4, '墨境的未来...仍悬而未决', {
      fontSize: '16px', color: '#888',
    }).setOrigin(0.5);

    const btn = this.add.text(width / 2, height * 0.6, '返回主菜单', {
      fontSize: '20px', color: '#ffd76b',
      backgroundColor: '#2a2a3e', padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setColor('#ffffff'));
    btn.on('pointerout', () => btn.setColor('#ffd76b'));
    btn.on('pointerdown', () => {
      GameData.deleteSave();
      this.scene.start('MenuScene');
    });
  }
}
