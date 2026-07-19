/**
 * BootScene.ts - 加载场景（水墨风）
 */

import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload(): void {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    // 水墨风背景
    this.cameras.main.setBackgroundColor('#0a0a0f');

    // 墨滴装饰
    for (let i = 0; i < 6; i++) {
      const ink = this.add.circle(
        Phaser.Math.Between(20, w - 20),
        Phaser.Math.Between(20, h - 20),
        Phaser.Math.Between(10, 40),
        0x1a1a2e, Phaser.Math.FloatBetween(0.08, 0.2)
      );
      ink.setBlendMode(Phaser.BlendModes.ADD);
    }

    // 加载标题
    this.add.text(w / 2, h * 0.35, '墨境', {
      fontSize: '36px',
      fontFamily: '"STKaiti", "KaiTi", serif',
      color: '#e8d5b5',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(w / 2, h * 0.42, '棋局', {
      fontSize: '28px',
      fontFamily: '"STKaiti", "KaiTi", serif',
      color: '#8a7a6a',
    }).setOrigin(0.5);

    // 进度条背景（墨色轨道）
    const trackBg = this.add.rectangle(w / 2, h / 2 + 40, 280, 6, 0x1a1a2e, 0.8);
    trackBg.setStrokeStyle(1, 0x3a3a4e);

    // 进度条（墨色填充）
    const bar = this.add.rectangle(w / 2 - 138, h / 2 + 37, 0, 4, 0x4a6a8e);
    bar.setOrigin(0, 0);

    // 进度文字
    const progressText = this.add.text(w / 2, h / 2 + 60, '', {
      fontSize: '11px',
      color: '#6a7a8a',
    }).setOrigin(0.5);

    this.load.on('progress', (val: number) => {
      bar.width = 276 * val;
      progressText.setText(`研墨中... ${Math.floor(val * 100)}%`);
    });

    this.load.on('complete', () => {
      progressText.setText('就绪');
    });

    // 加载资源（占位符）
    this.load.image('logo', 'assets/logo.png');
    this.load.image('board_bg', 'assets/board_bg.png');
    this.load.image('card_back', 'assets/card_back.png');
  }

  create(): void {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.time.delayedCall(300, () => {
      this.scene.start('MenuScene');
    });
  }
}
