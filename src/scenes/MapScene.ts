/**
 * MapScene.ts - 地图场景
 */

import Phaser from 'phaser';
import { MapGenerator, MapNode, NodeType } from '../map/MapNode';
import { GameData } from '../data/GameData';
import { CHAPTERS } from '../data/ChapterData';

export class MapScene extends Phaser.Scene {
  private mapGen!: MapGenerator;
  private nodeCircles: Map<number, Phaser.GameObjects.Arc> = new Map();
  private playerState!: any;

  constructor() { super({ key: 'MapScene' }); }

  init(): void {
    this.playerState = GameData.load() || GameData.createInitialPlayerState();
    this.mapGen = new MapGenerator();
    this.mapGen.generate();
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // 背景
    this.cameras.main.setBackgroundColor('#0f0f1a');

    // 章节标题
    const chapter = CHAPTERS[this.playerState.currentChapter - 1] || CHAPTERS[0];
    this.add.text(width / 2, 30, chapter.name, {
      fontSize: '20px',
      color: '#e8d5b5',
    }).setOrigin(0.5);

    // 玩家状态
    this.add.text(10, 10, `HP: ${this.playerState.hp}/${this.playerState.maxHp}`, {
      fontSize: '14px',
      color: '#6bff8a',
    });
    this.add.text(10, 30, `AP: ${this.playerState.ap}/${this.playerState.maxAp}`, {
      fontSize: '14px',
      color: '#6bb5ff',
    });
    this.add.text(10, 50, `金币: ${this.playerState.gold}`, {
      fontSize: '14px',
      color: '#ffd76b',
    });

    // 层级指示
    this.add.text(width - 10, 10, `层级: ${this.mapGen.currentFloor}/${MapGenerator.FLOORS}`, {
      fontSize: '14px',
      color: '#888',
    }).setOrigin(1, 0);

    // 画连接线
    this.drawConnections();

    // 画节点
    this.drawNodes();

    // 暂停按钮
    const pauseBtn = this.add.text(width - 10, height - 10, '[ 暂停 ]', {
      fontSize: '14px',
      color: '#888',
    }).setOrigin(1, 1).setInteractive({ useHandCursor: true });

    pauseBtn.on('pointerdown', () => {
      this.scene.launch('PauseOverlay');
    });
  }

  private drawConnections(): void {
    for (const node of this.mapGen.nodes) {
      for (const connId of node.connections) {
        const target = this.mapGen.getNode(connId);
        if (!target) continue;

        const line = this.add.line(0, 0, node.x, node.y, target.x, target.y, 0x2a2a3e);
        line.setLineWidth(2);
      }
    }
  }

  private drawNodes(): void {
    for (const node of this.mapGen.nodes) {
      const color = this.getNodeColor(node.type);
      const circle = this.add.circle(node.x, node.y, 20, color);
      circle.setStrokeStyle(2, 0x4a4a5e);
      circle.setInteractive({ useHandCursor: true });

      // 节点类型标签
      const label = this.getNodeLabel(node.type);
      this.add.text(node.x, node.y, label, {
        fontSize: '12px',
        color: '#fff',
      }).setOrigin(0.5);

      // 层号
      this.add.text(node.x, node.y + 26, `F${node.floor}`, {
        fontSize: '10px',
        color: '#666',
      }).setOrigin(0.5);

      // 点击事件
      circle.on('pointerdown', () => this.onNodeClick(node));

      this.nodeCircles.set(node.id, circle);
    }
  }

  private onNodeClick(node: MapNode): void {
    const success = this.mapGen.visitNode(node.id);
    if (!success) {
      this.showTooltip('无法到达此节点');
      return;
    }

    // 更新玩家状态
    this.playerState.currentNodeFloor = node.floor + 1;
    this.playerState.visitedNodes.push(node.id);
    GameData.save(this.playerState);

    // 根据节点类型进入不同场景
    switch (node.type) {
      case NodeType.BATTLE:
      case NodeType.ELITE:
      case NodeType.BOSS:
        this.scene.start('BattleScene', { nodeType: node.type, nodeFloor: node.floor });
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
    const t = this.add.text(this.cameras.main.width / 2, 100, msg, {
      fontSize: '14px',
      color: '#ff6b7a',
      backgroundColor: '#1a1a2e',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5, 0);
    this.time.delayedCall(1500, () => t.destroy());
  }

  private getNodeColor(type: NodeType): number {
    switch (type) {
      case NodeType.BATTLE: return 0x3a2020;
      case NodeType.ELITE: return 0x4a2040;
      case NodeType.EVENT: return 0x203a40;
      case NodeType.SHOP: return 0x3a3a20;
      case NodeType.REST: return 0x204030;
      case NodeType.BOSS: return 0x5a1020;
    }
  }

  private getNodeLabel(type: NodeType): string {
    switch (type) {
      case NodeType.BATTLE: return '战';
      case NodeType.ELITE: return '精';
      case NodeType.EVENT: return '事';
      case NodeType.SHOP: return '店';
      case NodeType.REST: return '休';
      case NodeType.BOSS: return 'B';
    }
  }
}
