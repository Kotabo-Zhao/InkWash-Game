/**
 * MapScene.ts - 地图场景（水墨风卷轴）
 * 设计：宣纸底 + 水墨节点 + 墨线连接 + 书法风格文字
 */

import Phaser from 'phaser';
import { MapGenerator, MapNode, NodeType } from '../map/MapNode';
import { GameData } from '../data/GameData';
import { CHAPTERS } from '../data/ChapterData';
import { generateChapterLevels, LevelConfig } from '../data/LevelData';

export class MapScene extends Phaser.Scene {
  private mapGen!: MapGenerator;
  private nodeCircles: Map<number, Phaser.GameObjects.GameObject[]> = new Map();
  private playerState!: any;
  private levelConfigs: LevelConfig[] = [];

  constructor() { super({ key: 'MapScene' }); }

  init(): void {
    this.playerState = GameData.load() || GameData.createInitialPlayerState();
    this.mapGen = new MapGenerator();
    this.mapGen.generate(this.playerState.currentChapter);
    this.levelConfigs = generateChapterLevels(this.playerState.currentChapter);
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // 宣纸底色背景
    this.cameras.main.setBackgroundColor('#1a1510');

    // 水墨装饰
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(20, width - 20);
      const y = Phaser.Math.Between(80, height - 50);
      const r = Phaser.Math.Between(20, 60);
      const ink = this.add.circle(x, y, r, 0x2a2520, Phaser.Math.FloatBetween(0.1, 0.25));
      ink.setBlendMode(Phaser.BlendModes.MULTIPLY);
    }

    // 顶部章节横幅
    const chapter = CHAPTERS[this.playerState.currentChapter - 1] || CHAPTERS[0];
    const bannerBg = this.add.rectangle(width / 2, 28, width - 20, 36, 0x2a1a1a, 0.8);
    bannerBg.setStrokeStyle(1, 0x6a3a2a);
    this.add.text(width / 2, 28, chapter.name, {
      fontSize: '18px',
      fontFamily: '"STKaiti", "KaiTi", "Microsoft YaHei", serif',
      color: '#e8c5a5',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // 顶部状态栏（水墨风）
    const hudBg = this.add.rectangle(width / 2, 64, width - 20, 32, 0x1a1a15, 0.7);
    hudBg.setStrokeStyle(1, 0x4a3a2a);

    this.add.text(15, 64, `♥ ${this.playerState.hp}/${this.playerState.maxHp}`, {
      fontSize: '13px', color: '#c85a5a',
    }).setOrigin(0, 0.5);

    this.add.text(110, 64, `◆ ${this.playerState.ap}/${this.playerState.maxAp}`, {
      fontSize: '13px', color: '#5a8ac8',
    }).setOrigin(0, 0.5);

    this.add.text(210, 64, `💰 ${this.playerState.gold}`, {
      fontSize: '13px', color: '#c8a85a',
    }).setOrigin(0, 0.5);

    this.add.text(width - 15, 64, `层 ${this.mapGen.currentFloor}/${this.mapGen.getTotalFloors()}`, {
      fontSize: '13px', color: '#8a8a6a',
    }).setOrigin(1, 0.5);

    // 画连接线（水墨墨线）
    this.drawConnections();

    // 画节点（水墨印章风）
    this.drawNodes();

    // 底部说明
    this.add.text(width / 2, height - 55, '选择节点以推进 · 不同节点触发不同事件', {
      fontSize: '11px',
      color: '#6a5a4a',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // 暂停按钮（水墨风）
    const pauseBg = this.add.rectangle(width - 45, height - 25, 70, 30, 0x2a1a1a, 0.8);
    pauseBg.setStrokeStyle(1, 0x4a2a2a);
    pauseBg.setInteractive({ useHandCursor: true });
    const pauseText = this.add.text(width - 45, height - 25, '暂停', {
      fontSize: '13px',
      color: '#c8a85a',
    }).setOrigin(0.5);
    pauseBg.on('pointerdown', () => this.scene.launch('PauseOverlay'));
    pauseBg.on('pointerover', () => pauseBg.setFillStyle(0x3a2a2a, 0.9));
    pauseBg.on('pointerout', () => pauseBg.setFillStyle(0x2a1a1a, 0.8));
  }

  private drawConnections(): void {
    for (const node of this.mapGen.nodes) {
      for (const connId of node.connections) {
        const target = this.mapGen.getNode(connId);
        if (!target) continue;

        // 水墨连接线（深色墨线）
        const line = this.add.line(0, 0, node.x, node.y, target.x, target.y, 0x4a3a2a);
        line.setLineWidth(2);
        line.setAlpha(0.6);
      }
    }
  }

  private drawNodes(): void {
    for (const node of this.mapGen.nodes) {
      const objects: Phaser.GameObjects.GameObject[] = [];
      const label = this.getNodeLabel(node.type);
      const name = this.getNodeName(node.type);
      const color = this.getNodeColor(node.type);

      // 节点印章（圆形）
      const stamp = this.add.circle(node.x, node.y, 18, color, 0.9);
      stamp.setStrokeStyle(2, 0xe8c5a5);
      stamp.setInteractive({ useHandCursor: true });
      objects.push(stamp);

      // 节点标签
      const labelText = this.add.text(node.x, node.y, label, {
        fontSize: '14px',
        fontFamily: '"STKaiti", "KaiTi", serif',
        color: '#e8d5b5',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      objects.push(labelText);

      // 节点名称（下方小字）
      const nameText = this.add.text(node.x, node.y + 26, name, {
        fontSize: '10px',
        color: '#8a7a6a',
      }).setOrigin(0.5);
      objects.push(nameText);

      // 层号
      const floorText = this.add.text(node.x, node.y + 40, `F${node.floor}`, {
        fontSize: '9px',
        color: '#5a4a3a',
      }).setOrigin(0.5);
      objects.push(floorText);

      // 交互反馈
      stamp.on('pointerover', () => {
        stamp.setScale(1.15);
        stamp.setStrokeStyle(3, 0xffd76b);
      });
      stamp.on('pointerout', () => {
        stamp.setScale(1.0);
        stamp.setStrokeStyle(2, 0xe8c5a5);
      });

      // 点击事件
      stamp.on('pointerdown', () => this.onNodeClick(node));

      this.nodeCircles.set(node.id, objects);
    }
  }

  private onNodeClick(node: MapNode): void {
    const success = this.mapGen.visitNode(node.id);
    if (!success) {
      this.showTooltip('无法到达此节点，请选择相邻节点');
      return;
    }

    // 更新玩家状态
    this.playerState.currentNodeFloor = node.floor + 1;
    this.playerState.visitedNodes.push(node.id);
    GameData.save(this.playerState);

    // 获取当前楼层的关卡配置
    const levelConfig = this.levelConfigs[node.floor];

    // 根据节点类型进入不同场景
    switch (node.type) {
      case NodeType.BATTLE:
      case NodeType.ELITE:
      case NodeType.BOSS:
        this.scene.start('BattleScene', {
          nodeType: node.type,
          nodeFloor: node.floor,
          levelConfig: levelConfig
        });
        break;
      case NodeType.EVENT:
        this.scene.start('EventScene', { nodeFloor: node.floor });
        break;
      case NodeType.SHOP:
        this.scene.start('ShopScene', { nodeFloor: node.floor });
        break;
      case NodeType.REST:
        this.scene.start('RestScene', { nodeFloor: node.floor });
        break;
    }
  }

  private showTooltip(msg: string): void {
    const bg = this.add.rectangle(this.cameras.main.width / 2, 100, 280, 30, 0x3a1a1a, 0.9);
    bg.setStrokeStyle(1, 0x6a3a3a);
    const t = this.add.text(this.cameras.main.width / 2, 100, msg, {
      fontSize: '12px',
      color: '#ff9a7a',
    }).setOrigin(0.5);
    this.time.delayedCall(1500, () => { bg.destroy(); t.destroy(); });
  }

  private getNodeColor(type: NodeType): number {
    switch (type) {
      case NodeType.BATTLE: return 0x4a2020;   // 暗红
      case NodeType.ELITE: return 0x5a2040;   // 暗紫
      case NodeType.EVENT: return 0x204a50;   // 青蓝
      case NodeType.SHOP: return 0x5a4a20;    // 金黄
      case NodeType.REST: return 0x205030;    // 碧绿
      case NodeType.BOSS: return 0x7a1020;    // 血红
    }
  }

  private getNodeLabel(type: NodeType): string {
    switch (type) {
      case NodeType.BATTLE: return '战';
      case NodeType.ELITE: return '精';
      case NodeType.EVENT: return '缘';
      case NodeType.SHOP: return '商';
      case NodeType.REST: return '憩';
      case NodeType.BOSS: return '主';
    }
  }

  private getNodeName(type: NodeType): string {
    switch (type) {
      case NodeType.BATTLE: return '遭遇';
      case NodeType.ELITE: return '强敌';
      case NodeType.EVENT: return '奇遇';
      case NodeType.SHOP: return '行商';
      case NodeType.REST: return '驿站';
      case NodeType.BOSS: return '关主';
    }
  }
}
