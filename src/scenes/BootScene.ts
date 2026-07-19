/**
 * BootScene.ts - 加载场景
 */

import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload(): void {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    // 进度条背景
    const bgBar = this.add.rectangle(w / 2, h / 2, 300, 12, 0x1a1a2e);
    bgBar.setStrokeStyle(1, 0x2a2a3e);

    // 进度条
    const bar = this.add.rectangle(w / 2 - 148, h / 2 - 4, 0, 8, 0xc8b88a);
    bar.setOrigin(0, 0);

    this.load.on('progress', (val: number) => {
      bar.width = 296 * val;
    });

    this.load.on('complete', () => {
      bgBar.destroy();
      bar.destroy();
    });

    // 加载资源（占位符）
    this.load.image('logo', 'assets/logo.png');
    this.load.image('board_bg', 'assets/board_bg.png');
    this.load.image('card_back', 'assets/card_back.png');
  }

  create(): void {
    this.scene.start('MenuScene');
  }
}
