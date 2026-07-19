/**
 * MapNode.ts - 地图节点系统
 * 类似杀戮尖塔的节点地图：战斗/事件/商店/休息/BOSS
 */

export enum NodeType {
  BATTLE = 'BATTLE',
  ELITE = 'ELITE',
  EVENT = 'EVENT',
  SHOP = 'SHOP',
  REST = 'REST',
  BOSS = 'BOSS',
}

export interface MapNode {
  id: number;
  type: NodeType;
  floor: number;
  col: number;
  connections: number[];
  x: number;
  y: number;
}

/**
 * 节点地图生成器
 */
export class MapGenerator {
  static readonly FLOORS = 15;
  static readonly COLS = 5;
  static readonly NODE_W = 70;
  static readonly NODE_H = 80;
  static readonly PADDING_X = 30;
  static readonly PADDING_Y = 60;

  nodes: MapNode[] = [];
  currentFloor = 0;
  visitedNodes: Set<number> = new Set();

  generate(): MapNode[] {
    this.nodes = [];
    let id = 0;

    // 逐层生成
    for (let floor = 0; floor < MapGenerator.FLOORS; floor++) {
      const nodesInFloor = this.getNodesForFloor(floor);

      for (let i = 0; i < nodesInFloor; i++) {
        const node: MapNode = {
          id: id++,
          type: this.getNodeType(floor),
          floor,
          col: i,
          connections: [],
          x: MapGenerator.PADDING_X + i * MapGenerator.NODE_W,
          y: MapGenerator.PADDING_Y + (MapGenerator.FLOORS - 1 - floor) * MapGenerator.NODE_H,
        };
        this.nodes.push(node);
      }

      // 建立连接：本层节点连到下层节点
      const thisFloorNodes = this.nodes.filter(n => n.floor === floor);
      const prevFloorNodes = this.nodes.filter(n => n.floor === floor - 1);

      if (floor === 0) continue;

      for (const prev of prevFloorNodes) {
        // 至少连一个本层节点
        const target = thisFloorNodes[prev.col % thisFloorNodes.length];
        prev.connections.push(target.id);

        // 50% 概率连相邻节点
        if (Math.random() > 0.5) {
          const altIdx = (prev.col + 1) % thisFloorNodes.length;
          if (altIdx !== prev.col % thisFloorNodes.length) {
            prev.connections.push(thisFloorNodes[altIdx].id);
          }
        }
      }
    }

    return this.nodes;
  }

  private getNodesForFloor(floor: number): number {
    if (floor === 0) return 2;
    if (floor === MapGenerator.FLOORS - 1) return 1; // BOSS
    if (floor === MapGenerator.FLOORS - 2) return 2; // BOSS 前
    return 3 + Math.floor(Math.random() * 2); // 3-4 个
  }

  private getNodeType(floor: number): NodeType {
    if (floor === 0) return NodeType.BATTLE;
    if (floor === MapGenerator.FLOORS - 1) return NodeType.BOSS;
    if (floor === MapGenerator.FLOORS - 2) return NodeType.REST;

    const r = Math.random();
    if (r < 0.55) return NodeType.BATTLE;
    if (r < 0.7) return NodeType.ELITE;
    if (r < 0.85) return NodeType.EVENT;
    if (r < 0.95) return NodeType.SHOP;
    return NodeType.REST;
  }

  getNode(id: number): MapNode | undefined {
    return this.nodes.find(n => n.id === id);
  }

  getCurrentFloorNodes(): MapNode[] {
    return this.nodes.filter(n => n.floor === this.currentFloor);
  }

  visitNode(id: number): boolean {
    const node = this.getNode(id);
    if (!node) return false;

    // 检查是否从上一层的已访问节点连过来
    if (this.currentFloor > 0) {
      const prevVisited = this.nodes.filter(
        n => n.floor === this.currentFloor - 1 && this.visitedNodes.has(n.id)
      );
      const validConnection = prevVisited.some(
        p => p.connections.includes(id)
      );
      if (!validConnection) return false;
    }

    this.visitedNodes.add(id);
    this.currentFloor = node.floor + 1;
    return true;
  }
}
