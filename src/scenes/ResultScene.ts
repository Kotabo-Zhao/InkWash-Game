/**
 * ResultScene.ts - 结算场景（水墨风）
 */

import Phaser from 'phaser';
import { GameData } from '../data/GameData';

export class ResultScene extends Phaser.Scene {
  constructor() { super({ key: 'ResultScene' }); }

  create(): void {
    const { width, height } = this.cameras.main;

    // 水墨背景
    this.cameras.main.setBackgroundColor('#0a0505');
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a0a0a, 0.3);

    // 墨迹装饰
    for (let i = 0; i < 8; i++) {
      const ink = this.add.circle(
        Phaser.Math.Between(30, width - 30),
        Phaser.Math.Between(30, height - 30),
        Phaser.Math.Between(20, 60),
        0x2a1515, Phaser.Math.FloatBetween(0.08, 0.2)
      );
      ink.setBlendMode(Phaser.BlendModes.ADD);
    }

    // 游戏结束标题（书法体）
    this.add.text(width / 2, height * 0.3, '墨散', {
      fontSize: '40px',
      fontFamily: '"STKaiti", "KaiTi", serif',
      color: '#e8c5a5',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // 副标题
    this.add.text(width / 2, height * 0.38, '—— 棋局已终 ——', {
      fontSize: '13px',
      color: '#6a5a4a',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // 结语
    this.add.text(width / 2, height * 0.48, '墨境的未来，仍悬而未决', {
      fontSize: '14px',
      color: '#a8a8a0',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // 返回按钮
    const btnBg = this.add.rectangle(width / 2, height * 0.62, 160, 44, 0x2a1a1a, 0.8);
    btnBg.setStrokeStyle(2, 0x4a2a2a);
    btnBg.setInteractive({ useHandCursor: true });

    const btnText = this.add.text(width / 2, height * 0.62, '归', {
      fontSize: '20px',
      fontFamily: '"STKaiti", "KaiTi", serif',
      color: '#e8c5a5',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    btnBg.on('pointerover', () => {
      btnBg.setFillStyle(0x3a2a2a, 0.9);
      btnBg.setStrokeStyle(2, 0x6a3a3a);
    });
    btnBg.on('pointerout', () => {
      btnBg.setFillStyle(0x2a1a1a, 0.8);
      btnBg.setStrokeStyle(2, 0x4a2a2a);
    });
    btnBg.on('pointerdown', () => {
      GameData.deleteSave();
      this.scene.start('MenuScene');
    });
  }
}
