/**
 * PauseOverlay.ts - 暂停菜单（水墨风叠加层）
 */

import Phaser from 'phaser';
import { GameData } from '../data/GameData';

export class PauseOverlay extends Phaser.Scene {
  constructor() { super({ key: 'PauseOverlay' }); }

  create(): void {
    const { width, height } = this.cameras.main;

    // 半透明墨色背景
    const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85);
    bg.setInteractive();

    // 水墨装饰
    for (let i = 0; i < 5; i++) {
      const ink = this.add.circle(
        Phaser.Math.Between(30, width - 30),
        Phaser.Math.Between(30, height - 30),
        Phaser.Math.Between(15, 50),
        0x2a2520, Phaser.Math.FloatBetween(0.05, 0.15)
      );
      ink.setBlendMode(Phaser.BlendModes.ADD);
    }

    // 面板（宣纸底）
    const panel = this.add.rectangle(width / 2, height / 2, 280, 280, 0x1a1a15, 0.95);
    panel.setStrokeStyle(2, 0x4a3a2a);

    // 标题（书法体）
    this.add.text(width / 2, height / 2 - 100, '暂歇', {
      fontSize: '24px',
      fontFamily: '"STKaiti", "KaiTi", serif',
      color: '#e8c5a5',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // 分隔线
    this.add.rectangle(width / 2, height / 2 - 75, 200, 1, 0x4a3a2a, 0.5);

    // 按钮（水墨风）
    const buttons = [
      { text: '继续前行', y: height / 2 - 30, color: '#c8a85a', action: () => this.resumeGame() },
      { text: '放弃战斗', y: height / 2 + 30, color: '#c85a5a', action: () => this.abandonBattle() },
      { text: '返回主菜单', y: height / 2 + 90, color: '#8a7a6a', action: () => this.returnToMenu() },
    ];

    buttons.forEach(btn => {
      const btnBg = this.add.rectangle(width / 2, btn.y, 180, 40, 0x2a2a20, 0.8);
      btnBg.setStrokeStyle(1, 0x4a3a2a);
      btnBg.setInteractive({ useHandCursor: true });

      const btnText = this.add.text(width / 2, btn.y, btn.text, {
        fontSize: '15px',
        color: btn.color,
      }).setOrigin(0.5);

      btnBg.on('pointerover', () => {
        btnBg.setFillStyle(0x3a3a2a, 0.9);
        btnBg.setStrokeStyle(2, 0x6a5a4a);
      });
      btnBg.on('pointerout', () => {
        btnBg.setFillStyle(0x2a2a20, 0.8);
        btnBg.setStrokeStyle(1, 0x4a3a2a);
      });
      btnBg.on('pointerdown', btn.action);
    });
  }

  private resumeGame(): void {
    this.scene.stop();
  }

  private abandonBattle(): void {
    GameData.deleteSave();
    this.scene.stop('BattleScene');
    this.scene.stop();
    this.scene.start('MapScene');
  }

  private returnToMenu(): void {
    GameData.save({
      hp: 60,
      maxHp: 60,
      ap: 3,
      maxAp: 3,
      gold: 100,
      deckTemplateIds: ['strike', 'strike', 'strike', 'strike', 'strike', 'defend', 'defend', 'defend', 'defend', 'quickSlash'],
      currentChapter: 1,
      currentNodeFloor: 0,
      visitedNodes: [],
      level: 1,
      exp: 0,
    });
    this.scene.stop('BattleScene');
    this.scene.stop();
    this.scene.start('MenuScene');
  }
}
