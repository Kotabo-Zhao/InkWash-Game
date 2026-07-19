/**
 * MenuScene.ts - 主菜单场景（水墨风格）
 */

import Phaser from 'phaser';
import { GameData } from '../data/GameData';

export class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); }

  create(): void {
    const { width, height } = this.cameras.main;

    // 水墨渐变背景
    const bgGrad = this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a14);
    this.add.rectangle(width / 2, height * 0.3, width, height * 0.6, 0x12121e, 0.5);

    // 水墨装饰粒子（模拟墨滴飞溅）
    for (let i = 0; i < 12; i++) {
      const x = Phaser.Math.Between(30, width - 30);
      const y = Phaser.Math.Between(30, height - 30);
      const r = Phaser.Math.Between(8, 40);
      const alpha = Phaser.Math.FloatBetween(0.03, 0.12);
      const ink = this.add.circle(x, y, r, 0x2a3a4e, alpha);
      ink.setBlendMode(Phaser.BlendModes.ADD);
    }

    // 横向墨痕装饰线
    for (let i = 0; i < 3; i++) {
      const y = Phaser.Math.Between(100, height - 100);
      const lineLen = Phaser.Math.Between(100, 300);
      const x = Phaser.Math.Between(0, width);
      const line = this.add.rectangle(x, y, lineLen, 1, 0x3a4a5e, 0.15);
      line.setBlendMode(Phaser.BlendModes.ADD);
    }

    // 顶部装饰印章
    const sealBg = this.add.rectangle(width / 2, 100, 60, 60, 0x4a1a1a, 0.7);
    sealBg.setStrokeStyle(2, 0x8a3a3a);
    this.add.text(width / 2, 100, '墨', {
      fontSize: '28px',
      color: '#e8d5b5',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // 标题（大字）
    this.add.text(width / 2, height * 0.28, '墨境碁局', {
      fontSize: '44px',
      fontFamily: '"STKaiti", "KaiTi", "Microsoft YaHei", serif',
      color: '#e8d5b5',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // 副标题
    this.add.text(width / 2, height * 0.35, '—— 以棋入墨，以墨入境 ——', {
      fontSize: '14px',
      color: '#6a7a8a',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // 版本号
    this.add.text(width / 2, height * 0.93, 'v0.2.0-alpha', {
      fontSize: '11px',
      color: '#3a3a4a',
    }).setOrigin(0.5);

    // 菜单按钮（水墨风）
    const buttons = [
      { text: '开始游戏', y: 0.50, action: () => this.startNewGame() },
      { text: '继续游戏', y: 0.60, action: () => this.continueGame() },
      { text: '设置', y: 0.70, action: () => this.openSettings() },
      { text: '关于', y: 0.80, action: () => this.showAbout() },
    ];

    buttons.forEach(btn => {
      // 按钮背景
      const btnBg = this.add.rectangle(width / 2, height * btn.y, 180, 44, 0x1a1a2e, 0.8);
      btnBg.setStrokeStyle(1, 0x3a4a5e);

      // 按钮文字
      const btnText = this.add.text(width / 2, height * btn.y, btn.text, {
        fontSize: '20px',
        fontFamily: '"STKaiti", "KaiTi", "Microsoft YaHei", serif',
        color: '#e8d5b5',
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btnBg.setInteractive({ useHandCursor: true });

      btnBg.on('pointerover', () => {
        btnBg.setFillStyle(0x2a3a4e, 0.9);
        btnText.setColor('#ffd76b');
      });
      btnBg.on('pointerout', () => {
        btnBg.setFillStyle(0x1a1a2e, 0.8);
        btnText.setColor('#e8d5b5');
      });
      btnBg.on('pointerdown', btn.action);

      // 禁用继续游戏（如果没有存档）
      if (btn.text === '继续游戏' && !GameData.hasSave()) {
        btnText.setColor('#3a3a4a');
        btnBg.setFillStyle(0x0f0f1a, 0.5);
        btnBg.disableInteractive();
        btnText.disableInteractive();
      }
    });

    // 玩法提示
    this.add.text(width / 2, height * 0.44, '棋道卡牌 · 落子成阵 · 墨压释放', {
      fontSize: '11px',
      color: '#4a5a6a',
    }).setOrigin(0.5);
  }

  private startNewGame(): void {
    GameData.deleteSave();
    const initialState = GameData.createInitialPlayerState();
    GameData.save(initialState);
    // 开始新游戏时先显示第一章剧情
    this.scene.start('StoryScene', { type: 'chapter_intro', chapter: 1 });
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
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85);
    overlay.setInteractive();

    // 面板
    const panel = this.add.rectangle(width / 2, height / 2, 320, 400, 0x1a1a2e, 0.95);
    panel.setStrokeStyle(2, 0x3a4a5e);

    const aboutText = this.add.text(width / 2, height / 2 - 100, [
      '墨境棋局',
      '',
      '水墨风棋道卡牌Roguelike',
      '',
      '核心玩法：',
      '• 落子棋盘 — 每张牌需要选择落子位置',
      '• 位置加成 — 天元双倍伤害、角落加护甲、边缘加抽牌',
      '• 阵型组合 — 四角阵/十字阵/一线阵/对角阵/墨环阵',
      '• 墨压系统 — 累积墨压释放终极技「墨染乾坤」',
      '',
      '点击任意处关闭',
    ].join('\n'), {
      fontSize: '12px',
      color: '#c8b5a5',
      align: 'center',
      lineSpacing: 4,
    }).setOrigin(0.5);

    overlay.on('pointerdown', () => {
      overlay.destroy();
      panel.destroy();
      aboutText.destroy();
    });
  }
}
