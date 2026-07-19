/**
 * PauseOverlay.ts - 暂停菜单（叠加层）
 */

import Phaser from 'phaser';
import { GameData } from '../data/GameData';

export class PauseOverlay extends Phaser.Scene {
  constructor() { super({ key: 'PauseOverlay' }); }

  create(): void {
    const { width, height } = this.cameras.main;

    // 半透明背景
    const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85);
    bg.setInteractive();

    // 面板
    const panel = this.add.rectangle(width / 2, height / 2, 300, 300, 0x1a1a2e);
    panel.setStrokeStyle(2, 0x2a2a3e);

    // 标题
    this.add.text(width / 2, height / 2 - 100, '游戏暂停', {
      fontSize: '24px',
      color: '#e8d5b5',
    }).setOrigin(0.5);

    // 按钮
    const buttons = [
      { text: '继续游戏', y: height / 2 - 30, action: () => this.resumeGame() },
      { text: '放弃战斗', y: height / 2 + 30, action: () => this.abandonBattle() },
      { text: '返回主菜单', y: height / 2 + 90, action: () => this.returnToMenu() },
    ];

    buttons.forEach(btn => {
      const btnText = this.add.text(width / 2, btn.y, btn.text, {
        fontSize: '18px',
        color: '#ffd76b',
        backgroundColor: '#2a2a3e',
        padding: { x: 16, y: 8 },
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btnText.on('pointerover', () => btnText.setColor('#ffffff'));
      btnText.on('pointerout', () => btnText.setColor('#ffd76b'));
      btnText.on('pointerdown', btn.action);
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
