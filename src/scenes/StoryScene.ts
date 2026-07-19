/**
 * StoryScene.ts - 剧情/过场场景（水墨风）
 * 章节开头动画、Boss战前对话、通关结局
 */

import Phaser from 'phaser';
import { CHAPTERS } from '../data/ChapterData';

export interface StoryData {
  type: 'chapter_intro' | 'boss_intro' | 'ending';
  chapter: number;
}

interface StoryContent {
  title: string;
  subtitle: string;
  lines: string[];
  color?: number;
}

const CHAPTER_STORIES: Record<number, StoryContent> = {
  1: {
    title: '第一章',
    subtitle: '墨林迷踪',
    lines: [
      '你踏入了一片被墨色笼罩的竹林。',
      '竹影摇曳间，似乎有什么在暗处窥视。',
      '前方传来阵阵低吼——墨兽正在守护着什么。',
      '握紧手中的棋子，棋盘已备好，战斗不可避免。',
    ],
    color: 0x2a4a2e,
  },
  2: {
    title: '第二章',
    subtitle: '墨池深渊',
    lines: [
      '竹林尽头，一汪深不见底的墨池横亘眼前。',
      '池水漆黑如墨，气泡翻涌，散发着腐朽的气息。',
      '水底的生物感知到了你的存在，开始蠢蠢欲动。',
      '深渊在凝视你——你必须比它更强。',
    ],
    color: 0x1a3a5e,
  },
  3: {
    title: '第三章',
    subtitle: '墨山秘境',
    lines: [
      '翻过墨池，巍峨的墨山矗立在天地之间。',
      '山间云雾缭绕，古老的石碑上刻满了符文。',
      '山灵在此沉睡了千年，你的到来惊醒了它们。',
      '风在呼啸，石在震颤——试炼开始了。',
    ],
    color: 0x3a3a2e,
  },
  4: {
    title: '第四章',
    subtitle: '影武者殿堂',
    lines: [
      '墨山之巅，一座暗影覆盖的殿堂若隐若现。',
      '这里是影武者的领地，每一步都暗藏杀机。',
      '影子在墙壁上舞动，它们有自己的意志。',
      '将军在殿堂深处等待——最终的考验即将到来。',
    ],
    color: 0x2a1a3e,
  },
  5: {
    title: '第五章',
    subtitle: '墨渊核心',
    lines: [
      '殿堂崩塌，露出了通往墨渊的通道。',
      '这里是墨境的源头，一切力量的根源。',
      '混沌在翻涌，虚空在撕裂，现实在扭曲。',
      '墨境之主就在那里——最终的决战，无可回避。',
    ],
    color: 0x1a0a2e,
  },
};

export class StoryScene extends Phaser.Scene {
  constructor() { super({ key: 'StoryScene' }); }

  create(): void {
    const { width, height } = this.cameras.main;
    const data = this.scene.settings.data as StoryData || { type: 'chapter_intro', chapter: 1 };
    const story = CHAPTER_STORIES[data.chapter] || CHAPTER_STORIES[1];

    // 渐入背景
    const bgColor = story.color || 0x1a1a2e;
    this.cameras.main.setBackgroundColor('#000000');

    const bgOverlay = this.add.rectangle(width / 2, height / 2, width, height, bgColor, 0);
    this.tweens.add({
      targets: bgOverlay,
      alpha: 0.85,
      duration: 800,
    });

    // 水墨装饰粒子
    for (let i = 0; i < 15; i++) {
      const ink = this.add.circle(
        Phaser.Math.Between(20, width - 20),
        Phaser.Math.Between(20, height - 20),
        Phaser.Math.Between(10, 50),
        bgColor, 0
      );
      ink.setBlendMode(Phaser.BlendModes.ADD);
      this.tweens.add({
        targets: ink,
        alpha: Phaser.Math.FloatBetween(0.05, 0.2),
        duration: Phaser.Math.Between(600, 1500),
        delay: Phaser.Math.Between(0, 500),
      });
    }

    // 章节标题（大字，渐入）
    const titleText = this.add.text(width / 2, height * 0.2, story.title, {
      fontSize: '36px',
      fontFamily: '"STKaiti", "KaiTi", serif',
      color: '#e8c5a5',
      fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: titleText,
      alpha: 1,
      duration: 1000,
      delay: 400,
    });

    // 副标题
    const subtitleText = this.add.text(width / 2, height * 0.28, `—— ${story.subtitle} ——`, {
      fontSize: '18px',
      fontFamily: '"STKaiti", "KaiTi", serif',
      color: '#8a7a6a',
      fontStyle: 'italic',
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: subtitleText,
      alpha: 1,
      duration: 800,
      delay: 1200,
    });

    // 分隔线
    const sep = this.add.rectangle(width / 2, height * 0.33, 0, 1, 0x4a3a2a, 0.6);
    this.tweens.add({
      targets: sep,
      width: 200,
      duration: 600,
      delay: 1600,
    });

    // 剧情文字逐行显示
    const lineStartY = height * 0.40;
    const lineGap = 36;

    story.lines.forEach((line, idx) => {
      const lineText = this.add.text(width / 2, lineStartY + idx * lineGap, line, {
        fontSize: '14px',
        fontFamily: '"STKaiti", "KaiTi", serif',
        color: '#a8a8a0',
        wordWrap: { width: width - 60 },
        align: 'center',
        lineSpacing: 4,
      }).setOrigin(0.5).setAlpha(0);

      this.tweens.add({
        targets: lineText,
        alpha: 1,
        duration: 600,
        delay: 2000 + idx * 800,
      });
    });

    // 点击继续按钮（渐入）
    const totalDelay = 2000 + story.lines.length * 800 + 500;
    const continueBtn = this.add.rectangle(width / 2, height * 0.85, 140, 40, 0x1a1a15, 0).setStrokeStyle(1, 0x4a3a2a, 0).setInteractive({ useHandCursor: true });
    const continueText = this.add.text(width / 2, height * 0.85, '继续前行', {
      fontSize: '16px',
      fontFamily: '"STKaiti", "KaiTi", serif',
      color: '#c8a85a',
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: [continueBtn, continueText],
      alpha: 1,
      duration: 600,
      delay: totalDelay,
      onComplete: () => {
        continueBtn.setStrokeStyle(1, 0x4a3a2a, 1);
      },
    });

    continueBtn.on('pointerover', () => {
      continueBtn.setFillStyle(0x2a2a20, 0.9);
    });
    continueBtn.on('pointerout', () => {
      continueBtn.setFillStyle(0x1a1a15, 0.8);
    });
    continueBtn.on('pointerdown', () => {
      // 根据剧情类型决定跳转
      if (data.type === 'chapter_intro') {
        this.scene.start('MapScene');
      } else if (data.type === 'boss_intro') {
        this.scene.start('BattleScene', this.scene.settings.data);
      } else {
        this.scene.start('MenuScene');
      }
    });
  }
}
