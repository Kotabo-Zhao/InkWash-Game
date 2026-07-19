/**
 * MenuScene.ts - 主菜单场景
 */

import Phaser from 'phaser';
import { GameData } from '../data/GameData';

export class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); }

  create(): void {
    const { width, height } = this.cameras.main;

    // 背景
    this.cameras.main.setBackgroundColor('#0f0f1a');

    // 装饰性墨迹
    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(50, width - 50);
      const y = Phaser.Math.Between(50, height - 50);
      const circle = this.add.circle(x, y, Phaser.Math.Between(20, 60), 0x1a1a2e, 0.3);
      circle.setBlendMode(Phaser.BlendModes.ADD);
    }

    // 标题
    this.add.text(width / 2, height * 0.2, '墨境棋局', {
      fontSize: '48px',
      fontFamily: '"Microsoft YaHei", serif',
      color: '#e8d5b5',
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.28, 'Ink Realm', {
      fontSize: '16px', color: '#888',
    }).setOrigin(0.5);

    // 版本号
    this.add.text(width / 2, height * 0.95, 'v0.1.0-alpha', {
      fontSize: '12px', color: '#444',
    }).setOrigin(0.5);

    // 菜单按钮
    const buttons = [
      { text: '开始游戏', y: 0.45, action: () => this.startNewGame() },
      { text: '继续游戏', y: 0.55, action: () => this.continueGame() },
      { text: '设置', y: 0.65, action: () => this.openSettings() },
      { text: '关于', y: 0.75, action: () => this.showAbout() },
    ];

    buttons.forEach(btn => {
      const btnText = this.add.text(width / 2, height * btn.y, btn.text, {
        fontSize: '24px',
        color: '#ffd76b',
        backgroundColor: '#2a2a3e',
        padding: { x: 24, y: 12 },
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btnText.on('pointerover', () => btnText.setColor('#ffffff'));
      btnText.on('pointerout', () => btnText.setColor('#ffd76b'));
      btnText.on('pointerdown', btn.action);

      // 禁用继续游戏（如果没有存档）
      if (btn.text === '继续游戏' && !GameData.hasSave()) {
        btnText.setColor('#555');
        btnText.disableInteractive();
      }
    });
  }

  private startNewGame(): void {
    GameData.deleteSave();
    const initialState = GameData.createInitialPlayerState();
    GameData.save(initialState);
    this.scene.start('MapScene');
  }

  private continueGame(): void {
    const state = GameData.load();
    if (state) {
      this.scene.start('MapScene');
    }
  }

  private openSettings(): void {
    this.scene.launch('SettingsOverlay');
  }

  private showAbout(): void {
    const { width, height } = this.cameras.main;
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);
    overlay.setInteractive();

    const aboutText = this.add.text(width / 2, height / 2 - 50, [
      '墨境棋局 v0.1.0',
      '',
      '一款水墨风格的卡牌Roguelike游戏',
      '',
      '开发中...',
      '',
      '点击任意处关闭',
    ].join('\n'), {
      fontSize: '14px',
      color: '#e8d5b5',
      align: 'center',
      backgroundColor: '#1a1a2e',
      padding: { x: 20, y: 20 },
    }).setOrigin(0.5);

    overlay.on('pointerdown', () => {
      overlay.destroy();
      aboutText.destroy();
    });
  }
}
