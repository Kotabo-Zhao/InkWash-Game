/**
 * EventScene.ts - 随机事件场景（水墨风）
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
    const { width, height } = this.cameras.main;

    // 水墨背景
    this.cameras.main.setBackgroundColor('#0f0a0a');
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1510, 0.3);

    // 墨迹装饰
    for (let i = 0; i < 8; i++) {
      const ink = this.add.circle(
        Phaser.Math.Between(30, width - 30),
        Phaser.Math.Between(30, height - 30),
        Phaser.Math.Between(20, 60),
        0x2a2520, Phaser.Math.FloatBetween(0.05, 0.15)
      );
      ink.setBlendMode(Phaser.BlendModes.ADD);
    }

    // 顶部状态栏
    const hudBg = this.add.rectangle(width / 2, 40, width - 20, 32, 0x1a1a15, 0.7);
    hudBg.setStrokeStyle(1, 0x4a3a2a);

    this.add.text(15, 40, `♥ ${this.playerState.hp}/${this.playerState.maxHp}`, {
      fontSize: '13px', color: '#c85a5a',
    }).setOrigin(0, 0.5);

    this.add.text(150, 40, `💰 ${this.playerState.gold}`, {
      fontSize: '13px', color: '#c8a85a',
    }).setOrigin(0, 0.5);

    // 获取随机事件
    const event = getRandomEvent();

    // 事件标题（书法体）
    this.add.text(width / 2, 120, event.title, {
      fontSize: '24px',
      fontFamily: '"STKaiti", "KaiTi", serif',
      color: '#e8d5b5',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // 分隔线
    this.add.rectangle(width / 2, 145, 200, 1, 0x4a3a2a, 0.5);

    // 背景描述（小字）
    this.add.text(width / 2, 175, event.background, {
      fontSize: '11px',
      color: '#6a5a4a',
      fontStyle: 'italic',
      wordWrap: { width: width - 60 },
      align: 'center',
      lineSpacing: 3,
    }).setOrigin(0.5);

    // 事件描述
    this.add.text(width / 2, 230, event.description, {
      fontSize: '13px',
      color: '#a8a8a0',
      wordWrap: { width: width - 60 },
      align: 'center',
      lineSpacing: 4,
    }).setOrigin(0.5);

    // 选项按钮（水墨风）
    const options = event.options.filter(opt => !opt.condition || opt.condition(this.playerState));
    const btnStartY = 340;
    const btnGap = 70;

    options.forEach((opt, idx) => {
      const y = btnStartY + idx * btnGap;

      // 按钮背景
      const btnBg = this.add.rectangle(width / 2, y, width - 60, 50, 0x1a1a15, 0.8);
      btnBg.setStrokeStyle(1, 0x4a3a2a);
      btnBg.setInteractive({ useHandCursor: true });

      // 按钮文字
      const btnText = this.add.text(width / 2, y, opt.text, {
        fontSize: '13px',
        color: '#c8a85a',
        wordWrap: { width: width - 100 },
        align: 'center',
      }).setOrigin(0.5);

      btnBg.on('pointerover', () => {
        btnBg.setFillStyle(0x2a2a20, 0.9);
        btnBg.setStrokeStyle(2, 0x6a5a4a);
      });
      btnBg.on('pointerout', () => {
        btnBg.setFillStyle(0x1a1a15, 0.8);
        btnBg.setStrokeStyle(1, 0x4a3a2a);
      });

      btnBg.on('pointerdown', () => {
        // 应用效果
        opt.effect(this.playerState);
        GameData.save(this.playerState);

        // 显示结果
        const resultBg = this.add.rectangle(width / 2, height / 2, width - 40, 120, 0x1a1a15, 0.95);
        resultBg.setStrokeStyle(2, 0x4a3a2a);

        this.add.text(width / 2, height / 2 - 20, opt.result, {
          fontSize: '13px',
          color: '#a8a8a0',
          wordWrap: { width: width - 80 },
          align: 'center',
          lineSpacing: 3,
        }).setOrigin(0.5);

        // 继续按钮
        const continueBg = this.add.rectangle(width / 2, height / 2 + 40, 100, 32, 0x2a2a20, 0.9);
        continueBg.setStrokeStyle(1, 0x4a3a2a);
        continueBg.setInteractive({ useHandCursor: true });

        const continueText = this.add.text(width / 2, height / 2 + 40, '继续', {
          fontSize: '13px',
          color: '#c8a85a',
        }).setOrigin(0.5);

        continueBg.on('pointerdown', () => this.scene.start('MapScene'));
      });
    });

    // 离开按钮（底部）
    const leaveBg = this.add.rectangle(width / 2, height - 60, 100, 32, 0x1a1a15, 0.7);
    leaveBg.setStrokeStyle(1, 0x3a3a2a);
    leaveBg.setInteractive({ useHandCursor: true });

    const leaveText = this.add.text(width / 2, height - 60, '离开', {
      fontSize: '13px',
      color: '#6a5a4a',
    }).setOrigin(0.5);

    leaveBg.on('pointerover', () => leaveBg.setFillStyle(0x2a2a20, 0.8));
    leaveBg.on('pointerout', () => leaveBg.setFillStyle(0x1a1a15, 0.7));
    leaveBg.on('pointerdown', () => this.scene.start('MapScene'));
  }
}
