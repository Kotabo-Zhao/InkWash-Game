/**
 * SettingsOverlay.ts - 设置界面（叠加层）
 */

import Phaser from 'phaser';

export class SettingsOverlay extends Phaser.Scene {
  constructor() { super({ key: 'SettingsOverlay' }); }

  create(): void {
    const { width, height } = this.cameras.main;

    // 半透明背景
    const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85);
    bg.setInteractive();

    // 设置面板
    const panel = this.add.rectangle(width / 2, height / 2, 340, 500, 0x1a1a2e);
    panel.setStrokeStyle(2, 0x2a2a3e);

    // 标题
    this.add.text(width / 2, height / 2 - 200, '设置', {
      fontSize: '24px',
      color: '#e8d5b5',
    }).setOrigin(0.5);

    // 音量设置
    this.add.text(width / 2 - 140, height / 2 - 130, '音量', {
      fontSize: '16px',
      color: '#e8d5b5',
    });

    const volumeSlider = this.createSlider(width / 2, height / 2 - 100, 0.7);

    // 难度设置
    this.add.text(width / 2 - 140, height / 2 - 40, '难度', {
      fontSize: '16px',
      color: '#e8d5b5',
    });

    const difficultyOptions = ['简单', '普通', '困难'];
    let selectedDifficulty = 1;

    const difficultyTexts: Phaser.GameObjects.Text[] = [];
    difficultyOptions.forEach((opt, idx) => {
      const x = width / 2 - 100 + idx * 100;
      const txt = this.add.text(x, height / 2 - 10, opt, {
        fontSize: '14px',
        color: idx === selectedDifficulty ? '#ffd76b' : '#888',
        backgroundColor: idx === selectedDifficulty ? '#2a2a3e' : undefined,
        padding: { x: 10, y: 5 },
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      txt.on('pointerdown', () => {
        selectedDifficulty = idx;
        difficultyTexts.forEach((t, i) => {
          t.setColor(i === idx ? '#ffd76b' : '#888');
          t.setBackgroundColor(i === idx ? '#2a2a3e' : '');
        });
      });

      difficultyTexts.push(txt);
    });

    // 控制方式
    this.add.text(width / 2 - 140, height / 2 + 50, '控制', {
      fontSize: '16px',
      color: '#e8d5b5',
    });

    const controlOptions = ['触屏', '鼠标'];
    let selectedControl = 0;

    const controlTexts: Phaser.GameObjects.Text[] = [];
    controlOptions.forEach((opt, idx) => {
      const x = width / 2 - 50 + idx * 100;
      const txt = this.add.text(x, height / 2 + 80, opt, {
        fontSize: '14px',
        color: idx === selectedControl ? '#ffd76b' : '#888',
        backgroundColor: idx === selectedControl ? '#2a2a3e' : undefined,
        padding: { x: 10, y: 5 },
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      txt.on('pointerdown', () => {
        selectedControl = idx;
        controlTexts.forEach((t, i) => {
          t.setColor(i === idx ? '#ffd76b' : '#888');
          t.setBackgroundColor(i === idx ? '#2a2a3e' : '');
        });
      });

      controlTexts.push(txt);
    });

    // 关闭按钮
    const closeBtn = this.add.text(width / 2, height / 2 + 180, '[ 关闭 ]', {
      fontSize: '16px',
      color: '#888',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    closeBtn.on('pointerdown', () => {
      this.scene.stop();
    });
  }

  private createSlider(x: number, y: number, initialValue: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    const track = this.add.rectangle(0, 0, 200, 8, 0x2a2a3e);
    const fill = this.add.rectangle(-100 + 200 * initialValue, 0, 200 * initialValue, 8, 0xffd76b);
    fill.setOrigin(0, 0.5);

    const handle = this.add.circle(-100 + 200 * initialValue, 0, 10, 0xffd76b);
    handle.setInteractive({ draggable: true });

    container.add([track, fill, handle]);

    this.input.on('drag', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject, dragX: number) => {
      if (gameObject === handle) {
        const minX = -100;
        const maxX = 100;
        const newX = Phaser.Math.Clamp(dragX, minX, maxX);
        handle.x = newX;
        fill.width = newX + 100;
      }
    });

    return container;
  }
}
