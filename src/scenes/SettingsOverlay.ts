/**
 * SettingsOverlay.ts - 设置界面（水墨风叠加层）
 */

import Phaser from 'phaser';

export class SettingsOverlay extends Phaser.Scene {
  constructor() { super({ key: 'SettingsOverlay' }); }

  create(): void {
    const { width, height } = this.cameras.main;

    // 半透明墨色背景
    const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85);
    bg.setInteractive();

    // 水墨装饰
    for (let i = 0; i < 4; i++) {
      const ink = this.add.circle(
        Phaser.Math.Between(30, width - 30),
        Phaser.Math.Between(30, height - 30),
        Phaser.Math.Between(10, 40),
        0x2a2520, Phaser.Math.FloatBetween(0.05, 0.12)
      );
      ink.setBlendMode(Phaser.BlendModes.ADD);
    }

    // 面板（宣纸底）
    const panel = this.add.rectangle(width / 2, height / 2, 320, 420, 0x1a1a15, 0.95);
    panel.setStrokeStyle(2, 0x4a3a2a);

    // 标题（书法体）
    this.add.text(width / 2, height / 2 - 170, '设置', {
      fontSize: '22px',
      fontFamily: '"STKaiti", "KaiTi", serif',
      color: '#e8c5a5',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // 分隔线
    this.add.rectangle(width / 2, height / 2 - 145, 200, 1, 0x4a3a2a, 0.5);

    // 音量设置
    this.add.text(width / 2, height / 2 - 110, '音量', {
      fontSize: '14px',
      color: '#e8d5b5',
    }).setOrigin(0.5);

    const volumeSlider = this.createSlider(width / 2, height / 2 - 80, 0.7);

    // 难度设置
    this.add.text(width / 2, height / 2 - 30, '难度', {
      fontSize: '14px',
      color: '#e8d5b5',
    }).setOrigin(0.5);

    const difficultyOptions = ['简单', '普通', '困难'];
    let selectedDifficulty = 1;

    const difficultyTexts: Phaser.GameObjects.Text[] = [];
    difficultyOptions.forEach((opt, idx) => {
      const x = width / 2 - 90 + idx * 90;
      const y = height / 2 + 5;

      const optBg = this.add.rectangle(x, y, 70, 30, 0x2a2a20, idx === selectedDifficulty ? 0.9 : 0.6);
      optBg.setStrokeStyle(1, idx === selectedDifficulty ? 0x6a5a4a : 0x3a3a2a);
      optBg.setInteractive({ useHandCursor: true });

      const txt = this.add.text(x, y, opt, {
        fontSize: '12px',
        color: idx === selectedDifficulty ? '#c8a85a' : '#6a5a4a',
      }).setOrigin(0.5);

      optBg.on('pointerdown', () => {
        selectedDifficulty = idx;
        difficultyTexts.forEach((t, i) => {
          t.setColor(i === idx ? '#c8a85a' : '#6a5a4a');
        });
      });

      difficultyTexts.push(txt);
    });

    // 控制方式
    this.add.text(width / 2, height / 2 + 60, '控制方式', {
      fontSize: '14px',
      color: '#e8d5b5',
    }).setOrigin(0.5);

    const controlOptions = ['触屏', '鼠标'];
    let selectedControl = 0;

    const controlTexts: Phaser.GameObjects.Text[] = [];
    controlOptions.forEach((opt, idx) => {
      const x = width / 2 - 45 + idx * 90;
      const y = height / 2 + 95;

      const optBg = this.add.rectangle(x, y, 70, 30, 0x2a2a20, idx === selectedControl ? 0.9 : 0.6);
      optBg.setStrokeStyle(1, idx === selectedControl ? 0x6a5a4a : 0x3a3a2a);
      optBg.setInteractive({ useHandCursor: true });

      const txt = this.add.text(x, y, opt, {
        fontSize: '12px',
        color: idx === selectedControl ? '#c8a85a' : '#6a5a4a',
      }).setOrigin(0.5);

      optBg.on('pointerdown', () => {
        selectedControl = idx;
        controlTexts.forEach((t, i) => {
          t.setColor(i === idx ? '#c8a85a' : '#6a5a4a');
        });
      });

      controlTexts.push(txt);
    });

    // 关闭按钮
    const closeBg = this.add.rectangle(width / 2, height / 2 + 160, 120, 36, 0x2a2a20, 0.8);
    closeBg.setStrokeStyle(1, 0x4a3a2a);
    closeBg.setInteractive({ useHandCursor: true });

    const closeText = this.add.text(width / 2, height / 2 + 160, '关闭', {
      fontSize: '14px',
      color: '#8a7a6a',
    }).setOrigin(0.5);

    closeBg.on('pointerover', () => closeBg.setFillStyle(0x3a3a2a, 0.9));
    closeBg.on('pointerout', () => closeBg.setFillStyle(0x2a2a20, 0.8));
    closeBg.on('pointerdown', () => this.scene.stop());
  }

  private createSlider(x: number, y: number, initialValue: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    // 轨道（墨色）
    const track = this.add.rectangle(0, 0, 200, 6, 0x2a2a20);
    track.setStrokeStyle(1, 0x4a3a2a);

    // 填充（金色）
    const fill = this.add.rectangle(-100 + 200 * initialValue, 0, 200 * initialValue, 6, 0xc8a85a);
    fill.setOrigin(0, 0.5);

    // 手柄（印章风）
    const handle = this.add.circle(-100 + 200 * initialValue, 0, 10, 0xc8a85a);
    handle.setStrokeStyle(2, 0xe8c5a5);
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
