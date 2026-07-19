/**
 * TutorialScene.ts - 新手引导场景
 * 水墨风教学流程，介绍核心玩法
 */

import Phaser from 'phaser';
import { GameData } from '../data/GameData';

interface TutorialStep {
  title: string;
  description: string;
  image?: string;
  highlight?: { x: number; y: number; w: number; h: number };
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: '欢迎来到墨境棋局',
    description: '这是一款水墨风卡牌策略游戏\n你将通过落子棋盘来释放卡牌效果',
  },
  {
    title: '棋盘落子',
    description: '每张卡牌打出后需要在棋盘上落子\n位置决定效果加成',
    highlight: { x: 75, y: 140, w: 240, h: 240 },
  },
  {
    title: '位置加成',
    description: '天元（中心）：伤害翻倍\n角落：+3护甲\n边缘：+1抽牌\n内圈：标准效果',
  },
  {
    title: '阵型系统',
    description: '特定形状触发阵型效果：\n四角阵：+2力量\n十字阵：+2抽牌\n一线阵：伤害+50%\n墨环阵：+3墨压',
  },
  {
    title: '墨压系统',
    description: '每次落子增加墨压\n墨压满时可释放终极技\n「墨染乾坤」对全体敌人造成20点伤害',
  },
  {
    title: '卡牌类型',
    description: '攻击牌（红色）：造成伤害\n技能牌（绿色）：防御/辅助\n能力牌（紫色）：永久增益',
  },
  {
    title: '关卡地图',
    description: '每章10-12层关卡\n包含：战斗/精英/商店/休息/事件\n击败Boss进入下一章',
  },
  {
    title: '遗物系统',
    description: '商店和事件中可获得遗物\n遗物提供永久增益\n如：每回合+1AP、击杀回血等',
  },
  {
    title: '准备就绪',
    description: '记住：位置决定效果\n善用阵型和墨压\n祝你在墨境中好运！',
  },
];

export class TutorialScene extends Phaser.Scene {
  private currentStep: number = 0;
  private container!: Phaser.GameObjects.Container;

  constructor() { super({ key: 'TutorialScene' }); }

  create(): void {
    const { width, height } = this.cameras.main;

    // 水墨背景
    this.cameras.main.setBackgroundColor('#0f0a0a');
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1510, 0.3);

    // 墨迹装饰
    for (let i = 0; i < 10; i++) {
      const ink = this.add.circle(
        Phaser.Math.Between(30, width - 30),
        Phaser.Math.Between(30, height - 30),
        Phaser.Math.Between(15, 50),
        0x2a2520, Phaser.Math.FloatBetween(0.05, 0.15)
      );
      ink.setBlendMode(Phaser.BlendModes.ADD);
    }

    // 主容器（方便整体更新）
    this.container = this.add.container(0, 0);

    // 跳过按钮
    const skipBg = this.add.rectangle(width - 60, 30, 80, 30, 0x1a1a15, 0.8);
    skipBg.setStrokeStyle(1, 0x4a3a2a);
    skipBg.setInteractive({ useHandCursor: true });

    const skipText = this.add.text(width - 60, 30, '跳过', {
      fontSize: '13px',
      color: '#8a7a6a',
    }).setOrigin(0.5);

    skipBg.on('pointerdown', () => this.finishTutorial());

    this.container.add(skipBg);
    this.container.add(skipText);

    // 显示第一步
    this.showStep(0);
  }

  private showStep(stepIndex: number): void {
    const { width, height } = this.cameras.main;
    const step = TUTORIAL_STEPS[stepIndex];

    // 清除旧内容（保留跳过按钮）
    this.container.removeAll(true);

    // 重新添加跳过按钮
    const skipBg = this.add.rectangle(width - 60, 30, 80, 30, 0x1a1a15, 0.8);
    skipBg.setStrokeStyle(1, 0x4a3a2a);
    skipBg.setInteractive({ useHandCursor: true });
    const skipText = this.add.text(width - 60, 30, '跳过', {
      fontSize: '13px',
      color: '#8a7a6a',
    }).setOrigin(0.5);
    skipBg.on('pointerdown', () => this.finishTutorial());
    this.container.add(skipBg);
    this.container.add(skipText);

    // 步骤指示器
    const progressText = this.add.text(width / 2, 80, `${stepIndex + 1} / ${TUTORIAL_STEPS.length}`, {
      fontSize: '12px',
      color: '#6a5a4a',
    }).setOrigin(0.5);
    this.container.add(progressText);

    // 标题
    const titleText = this.add.text(width / 2, 150, step.title, {
      fontSize: '24px',
      fontFamily: '"STKaiti", "KaiTi", serif',
      color: '#e8c5a5',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.container.add(titleText);

    // 分隔线
    const sep = this.add.rectangle(width / 2, 180, 160, 1, 0x4a3a2a, 0.5);
    this.container.add(sep);

    // 描述文本
    const descText = this.add.text(width / 2, 280, step.description, {
      fontSize: '15px',
      fontFamily: '"STKaiti", "KaiTi", serif',
      color: '#a8a8a0',
      align: 'center',
      lineSpacing: 8,
      wordWrap: { width: width - 60 },
    }).setOrigin(0.5);
    this.container.add(descText);

    // 高亮区域（如果有）
    if (step.highlight) {
      const hl = step.highlight;
      const highlightBox = this.add.rectangle(hl.x + hl.w / 2, hl.y + hl.h / 2, hl.w, hl.h, 0x6bff8a, 0.1);
      highlightBox.setStrokeStyle(2, 0x6bff8a, 0.6);

      // 闪烁动画
      this.tweens.add({
        targets: highlightBox,
        alpha: 0.3,
        duration: 800,
        yoyo: true,
        repeat: -1,
      });

      this.container.add(highlightBox);
    }

    // 底部按钮
    const isLast = stepIndex === TUTORIAL_STEPS.length - 1;
    const btnText = isLast ? '开始游戏' : '下一步';

    const btnBg = this.add.rectangle(width / 2, height - 80, 140, 44, 0x2a2a20, 0.9);
    btnBg.setStrokeStyle(2, 0x6a5a4a);
    btnBg.setInteractive({ useHandCursor: true });

    const btn = this.add.text(width / 2, height - 80, btnText, {
      fontSize: '16px',
      fontFamily: '"STKaiti", "KaiTi", serif',
      color: '#c8a85a',
    }).setOrigin(0.5);

    btnBg.on('pointerover', () => btnBg.setFillStyle(0x3a3a2a, 0.95));
    btnBg.on('pointerout', () => btnBg.setFillStyle(0x2a2a20, 0.9));
    btnBg.on('pointerdown', () => {
      if (isLast) {
        this.finishTutorial();
      } else {
        this.showStep(stepIndex + 1);
      }
    });

    this.container.add(btnBg);
    this.container.add(btn);

    // 渐入动画
    this.container.setAlpha(0);
    this.tweens.add({
      targets: this.container,
      alpha: 1,
      duration: 400,
    });
  }

  private finishTutorial(): void {
    // 标记完成
    localStorage.setItem('tutorial_completed', 'true');
    
    // 进入地图
    this.scene.start('MapScene');
  }
}
