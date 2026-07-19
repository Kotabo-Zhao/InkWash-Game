/**
 * RestScene.ts - 休息场景（水墨风）
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

    // 标题（书法体）
    this.add.text(width / 2, 120, '驿站', {
      fontSize: '32px',
      fontFamily: '"STKaiti", "KaiTi", serif',
      color: '#e8c5a5',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 150, '—— 暂歇片刻 ——', {
      fontSize: '11px',
      color: '#6a5a4a',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // 描述文字
    this.add.text(width / 2, 200, '你找到了一处僻静的休憩之所', {
      fontSize: '13px',
      color: '#a8a8a0',
    }).setOrigin(0.5);

    this.add.text(width / 2, 225, '篝火余温尚存，茶盏犹带余香', {
      fontSize: '12px',
      color: '#8a7a6a',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // 选项卡片
    const options = [
      {
        name: '休憩',
        desc: `恢复${Math.floor(this.playerState.maxHp * 0.3)}点生命`,
        detail: '闭目养神，调息回气',
        action: () => {
          const healAmount = Math.floor(this.playerState.maxHp * 0.3);
          this.playerState.hp = Math.min(this.playerState.maxHp, this.playerState.hp + healAmount);
          GameData.save(this.playerState);
          this.showResult(`恢复了 ${healAmount} 点生命`, '#6bff8a');
        },
      },
      {
        name: '冥想',
        desc: '升级一张卡牌',
        detail: '潜心领悟，精益求精',
        action: () => {
          this.scene.start('UpgradeScene', { playerState: this.playerState });
        },
      },
    ];

    const optionStartY = 320;
    const optionGap = 100;

    options.forEach((opt, idx) => {
      const y = optionStartY + idx * optionGap;

      // 选项卡片背景
      const cardBg = this.add.rectangle(width / 2, y, width - 60, 80, 0x1a1a15, 0.8);
      cardBg.setStrokeStyle(1, 0x4a3a2a);
      cardBg.setInteractive({ useHandCursor: true });

      // 选项名（书法体）
      this.add.text(width / 2, y - 22, opt.name, {
        fontSize: '18px',
        fontFamily: '"STKaiti", "KaiTi", serif',
        color: '#e8d5b5',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      // 描述
      this.add.text(width / 2, y + 2, opt.desc, {
        fontSize: '12px',
        color: '#a8a8a0',
      }).setOrigin(0.5);

      // 详情（小字）
      this.add.text(width / 2, y + 22, opt.detail, {
        fontSize: '10px',
        color: '#6a5a4a',
        fontStyle: 'italic',
      }).setOrigin(0.5);

      cardBg.on('pointerover', () => {
        cardBg.setFillStyle(0x2a2a20, 0.9);
        cardBg.setStrokeStyle(2, 0x6a5a4a);
      });
      cardBg.on('pointerout', () => {
        cardBg.setFillStyle(0x1a1a15, 0.8);
        cardBg.setStrokeStyle(1, 0x4a3a2a);
      });

      cardBg.on('pointerdown', () => {
        opt.action();
      });
    });

    // 离开按钮
    const leaveBg = this.add.rectangle(width / 2, 560, 120, 36, 0x1a1a15, 0.7);
    leaveBg.setStrokeStyle(1, 0x3a3a2a);
    leaveBg.setInteractive({ useHandCursor: true });

    this.add.text(width / 2, 560, '直接离开', {
      fontSize: '14px',
      color: '#6a5a4a',
    }).setOrigin(0.5);

    leaveBg.on('pointerover', () => leaveBg.setFillStyle(0x2a2a20, 0.8));
    leaveBg.on('pointerout', () => leaveBg.setFillStyle(0x1a1a15, 0.7));
    leaveBg.on('pointerdown', () => this.scene.start('MapScene'));
  }

  private showResult(msg: string, color: string): void {
    const { width, height } = this.cameras.main;

    const resultBg = this.add.rectangle(width / 2, height / 2, 300, 100, 0x1a1a15, 0.95);
    resultBg.setStrokeStyle(2, 0x4a3a2a);

    const resultText = this.add.text(width / 2, height / 2, msg, {
      fontSize: '16px',
      color: color,
    }).setOrigin(0.5);

    this.time.delayedCall(1500, () => {
      this.scene.start('MapScene');
    });
  }
}
