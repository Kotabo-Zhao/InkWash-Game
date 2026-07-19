/**
 * BattleScene.ts - 战斗场景（水墨风格 + 棋道系统）
 * 核心玩法：选择卡牌 → 在棋盘上落子 → 位置决定效果加成
 */

import Phaser from 'phaser';
import { Player } from '../core/Player';
import { Enemy } from '../core/Enemy';
import { DeckManager } from '../core/DeckManager';
import { BattleEngine, BattleEvent, CardPlayResult } from '../combat/BattleEngine';
import { Card, CardType } from '../cards/CardSystem';
import { CardDatabase } from '../cards/CardDatabase';
import { getEnemiesForNode } from '../core/EnemyDatabase';
import { GameData } from '../data/GameData';
import { BoardBattle, PositionType, InkStoneType } from '../core/BoardBattle';

interface BattleInitData {
  nodeType: string;
  nodeFloor: number;
}

export class BattleScene extends Phaser.Scene {
  private player!: Player;
  private enemies: Enemy[] = [];
  private deck!: DeckManager;
  private engine!: BattleEngine;

  // UI元素
  private hudContainer!: Phaser.GameObjects.Container;
  private boardContainer!: Phaser.GameObjects.Container;
  private handContainer!: Phaser.GameObjects.Container;
  private enemyContainer!: Phaser.GameObjects.Container;
  private logContainer!: Phaser.GameObjects.Container;
  private boardCells: Phaser.GameObjects.Rectangle[] = [];
  private boardStones: Phaser.GameObjects.Arc[] = [];
  private selectedCardIndex: number | null = null;
  private hoverCell: { x: number; y: number } | null = null;

  // 状态文本
  private hpText!: Phaser.GameObjects.Text;
  private apText!: Phaser.GameObjects.Text;
  private armorText!: Phaser.GameObjects.Text;
  private inkChargeBar!: Phaser.GameObjects.Rectangle;
  private inkChargeFill!: Phaser.GameObjects.Rectangle;
  private inkChargeText!: Phaser.GameObjects.Text;
  private positionHintText!: Phaser.GameObjects.Text;
  private logText!: Phaser.GameObjects.Text;
  private logLines: string[] = [];

  private playerState!: any;
  private nodeType: string = '';

  constructor() { super({ key: 'BattleScene' }); }

  init(data: BattleInitData): void {
    this.playerState = GameData.load() || GameData.createInitialPlayerState();
    this.nodeType = data.nodeType;

    // 初始化玩家
    this.player = new Player(this.playerState.hp, this.playerState.maxAp);
    this.player.hp = this.playerState.hp;
    this.player.maxHp = this.playerState.maxHp;

    // 初始化敌人
    const enemyConfigs = getEnemiesForNode(
      this.playerState.currentChapter,
      data.nodeType,
      data.nodeFloor
    );
    this.enemies = enemyConfigs.map((config, idx) => {
      const enemy = new Enemy(`e${idx}`, config.name, config.hp, config.patterns);
      return enemy;
    });

    // 初始化牌库
    this.deck = new DeckManager();
    const templates = this.playerState.deckTemplateIds
      .map((id: string) => CardDatabase[id])
      .filter((t: any) => t);
    const cards = templates.map((t: any) => new Card(t));
    this.deck.init(cards);

    // 初始化引擎
    this.engine = new BattleEngine(this.player, this.enemies, this.deck);
  }

  create(): void {
    // 水墨风背景
    const bg = this.add.rectangle(195, 422, 390, 844, 0x0f0f1a);
    this.add.rectangle(195, 422, 390, 844, 0x1a1a2e, 0.3);

    this.createHUD();
    this.createBoard();
    this.createEnemyUI();
    this.createHandUI();
    this.createLogUI();
    this.createPositionHint();
    this.createEndTurnButton();

    this.engine.startBattle(5);
    this.updateUI();
    this.addLog('战斗开始！选择卡牌后在棋盘上落子');
  }

  // ====== HUD（水墨风格）======
  private createHUD(): void {
    this.hudContainer = this.add.container(0, 0);

    // 半透明背景条
    const hudBg = this.add.rectangle(195, 25, 390, 50, 0x1a1a2e, 0.8);
    this.hudContainer.add(hudBg);

    // HP（朱砂红）
    this.hpText = this.add.text(15, 15, '', {
      fontSize: '14px',
      color: '#ff6b6b',
      fontStyle: 'bold',
    });
    this.hudContainer.add(this.hpText);

    // AP（靛蓝）
    this.apText = this.add.text(130, 15, '', {
      fontSize: '14px',
      color: '#6bb5ff',
      fontStyle: 'bold',
    });
    this.hudContainer.add(this.apText);

    // 护甲（金色）
    this.armorText = this.add.text(230, 15, '', {
      fontSize: '14px',
      color: '#ffd76b',
      fontStyle: 'bold',
    });
    this.hudContainer.add(this.armorText);

    // 墨压条（水墨渐变）
    this.inkChargeBar = this.add.rectangle(195, 55, 350, 8, 0x2a2a3e);
    this.inkChargeBar.setStrokeStyle(1, 0x4a4a5e);
    this.hudContainer.add(this.inkChargeBar);

    this.inkChargeFill = this.add.rectangle(20, 55, 0, 8, 0x4a6a8e);
    this.inkChargeFill.setOrigin(0, 0.5);
    this.hudContainer.add(this.inkChargeFill);

    this.inkChargeText = this.add.text(195, 55, '', {
      fontSize: '10px',
      color: '#e8d5b5',
    }).setOrigin(0.5);
    this.hudContainer.add(this.inkChargeText);
  }

  // ====== 棋盘（5×5水墨风格）======
  private createBoard(): void {
    this.boardContainer = this.add.container(0, 0);

    // 棋盘背景（宣纸色）
    const boardBg = this.add.rectangle(195, 260, 240, 240, 0x2a2a3e, 0.6);
    boardBg.setStrokeStyle(2, 0x4a4a5e);
    this.boardContainer.add(boardBg);

    // 棋盘格线（水墨风）
    const cellSize = 40;
    const startX = 75;
    const startY = 140;

    this.boardCells = [];
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        const cx = startX + x * cellSize + cellSize / 2;
        const cy = startY + y * cellSize + cellSize / 2;

        // 格子背景
        const cell = this.add.rectangle(cx, cy, cellSize - 2, cellSize - 2, 0x1a1a2e, 0.4);
        cell.setStrokeStyle(1, 0x4a4a5e, 0.6);

        // 位置类型提示（中心/角落/边缘）
        const posType = this.engine.board.getPositionType(x, y);
        if (posType === PositionType.CENTER) {
          cell.setFillStyle(0x3a2a4e, 0.5); // 天元高亮
        } else if (posType === PositionType.CORNER) {
          cell.setFillStyle(0x2a3a4e, 0.4); // 角落
        }

        // 交互
        cell.setInteractive({ useHandCursor: true });
        cell.on('pointerdown', () => this.onBoardCellClick(x, y));
        cell.on('pointerover', () => this.onBoardCellHover(x, y));
        cell.on('pointerout', () => this.onBoardCellOut());

        this.boardContainer.add(cell);
        this.boardCells.push(cell);
      }
    }

    // 墨子层
    this.boardStones = [];
  }

  // ====== 敌人UI ======
  private createEnemyUI(): void {
    this.enemyContainer = this.add.container(0, 0);
    const enemyY = 420;
    const spacing = 390 / (this.enemies.length + 1);

    this.enemies.forEach((enemy, idx) => {
      const x = spacing * (idx + 1);

      // 敌人身体（水墨风矩形）
      const body = this.add.rectangle(x, enemyY, 70, 90, 0x2a1a2e, 0.8);
      body.setStrokeStyle(2, 0x6a4060);
      this.enemyContainer.add(body);

      // 名字（书法风）
      const name = this.add.text(x, enemyY - 55, enemy.name, {
        fontSize: '13px',
        color: '#e8d5b5',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      this.enemyContainer.add(name);

      // 血条背景
      const hpBarBg = this.add.rectangle(x, enemyY + 50, 70, 8, 0x1a1a2e);
      hpBarBg.setStrokeStyle(1, 0x3a3a4e);
      this.enemyContainer.add(hpBarBg);

      // 血条填充（朱砂红）
      const hpFill = this.add.rectangle(x - 35, enemyY + 50, 70, 8, 0xff3333);
      hpFill.setOrigin(0, 0.5);
      this.enemyContainer.add(hpFill);

      // HP文本
      const hpText = this.add.text(x, enemyY + 65, `${enemy.hp}/${enemy.maxHp}`, {
        fontSize: '10px',
        color: '#ff6b7a',
      }).setOrigin(0.5);
      this.enemyContainer.add(hpText);

      // 意图（敌人下一步行动）
      const intentText = this.add.text(x, enemyY + 80, enemy.intent.description, {
        fontSize: '10px',
        color: '#ffa500',
        fontStyle: 'italic',
      }).setOrigin(0.5);
      this.enemyContainer.add(intentText);

      // 护甲显示
      if (enemy.armor > 0) {
        const armorText = this.add.text(x + 30, enemyY - 40, `🛡${enemy.armor}`, {
          fontSize: '11px',
          color: '#ffd76b',
        }).setOrigin(0.5);
        this.enemyContainer.add(armorText);
      }

      // 点击选择目标
      body.setInteractive({ useHandCursor: true });
      body.on('pointerdown', () => this.onEnemyClick(idx));
    });
  }

  // ====== 手牌UI（水墨风卡牌）======
  private createHandUI(): void {
    this.handContainer = this.add.container(0, 0);
  }

  // ====== 战斗日志 ======
  private createLogUI(): void {
    const logBg = this.add.rectangle(195, 740, 380, 100, 0x1a1a2e, 0.6);
    this.logText = this.add.text(15, 700, '', {
      fontSize: '11px',
      color: '#8a8a9a',
      wordWrap: { width: 360 },
      lineSpacing: 2,
    });
  }

  // ====== 位置提示 ======
  private createPositionHint(): void {
    this.positionHintText = this.add.text(195, 490, '', {
      fontSize: '12px',
      color: '#6bff8a',
      fontStyle: 'italic',
    }).setOrigin(0.5);
  }

  // ====== 结束回合按钮（水墨风）======
  private createEndTurnButton(): void {
    const btnBg = this.add.rectangle(320, 510, 100, 36, 0x2a2a3e, 0.9);
    btnBg.setStrokeStyle(2, 0x4a6a8e);
    btnBg.setInteractive({ useHandCursor: true });

    const btnText = this.add.text(320, 510, '结束回合', {
      fontSize: '13px',
      color: '#ffd76b',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    btnBg.on('pointerdown', () => this.endTurn());
    btnBg.on('pointerover', () => {
      btnBg.setFillStyle(0x3a3a4e, 0.9);
    });
    btnBg.on('pointerout', () => {
      btnBg.setFillStyle(0x2a2a3e, 0.9);
    });
  }

  // ====== 棋盘格子点击 ======
  private onBoardCellClick(x: number, y: number): void {
    if (this.selectedCardIndex === null) {
      this.addLog('请先选择一张卡牌');
      return;
    }

    const card = this.deck.hand[this.selectedCardIndex];
    if (!card) return;

    // 检查位置是否可用
    if (!this.engine.board.isEmpty(x, y)) {
      this.addLog('该位置已被占据');
      return;
    }

    // 选择第一个存活敌人作为目标
    let targetIdx = this.enemies.findIndex(e => e.isAlive());
    if (targetIdx < 0) return;

    // 执行落子
    const result = this.engine.playCardAtPosition(this.selectedCardIndex, x, y, targetIdx);

    // 显示位置加成提示
    if (result.positionBonus && result.positionBonus.damageMultiplier > 1) {
      this.showPositionBonus(`位置加成: ${result.positionBonus.description}`, x, y);
    }

    // 显示阵型效果
    if (result.formations && result.formations.length > 0) {
      for (const f of result.formations) {
        this.addLog(`✨ 阵型: ${f.effect}`);
      }
    }

    for (const e of result.events) {
      this.addLog(e.description);
    }

    this.selectedCardIndex = null;
    this.updateUI();

    if (this.engine.isBattleOver()) {
      this.onBattleEnd();
    }
  }

  // ====== 棋盘格子悬停 ======
  private onBoardCellHover(x: number, y: number): void {
    if (this.selectedCardIndex === null) return;
    if (!this.engine.board.isEmpty(x, y)) return;

    this.hoverCell = { x, y };
    const posType = this.engine.board.getPositionType(x, y);
    const bonus = this.engine.board.getPositionBonus(x, y);

    let hint = '';
    if (posType === PositionType.CENTER) {
      hint = '天元 · 双倍伤害';
    } else if (posType === PositionType.CORNER) {
      hint = '角落 · +3护甲';
    } else if (posType === PositionType.EDGE) {
      hint = '边缘 · +1抽牌';
    } else {
      hint = '内圈 · 标准效果';
    }

    this.positionHintText.setText(hint);
  }

  private onBoardCellOut(): void {
    this.hoverCell = null;
    this.positionHintText.setText('');
  }

  // ====== 显示位置加成动画 ======
  private showPositionBonus(text: string, x: number, y: number): void {
    const startX = 75 + x * 40 + 20;
    const startY = 140 + y * 40 + 20;

    const bonusText = this.add.text(startX, startY, text, {
      fontSize: '11px',
      color: '#6bff8a',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: bonusText,
      y: startY - 30,
      alpha: 0,
      duration: 1000,
      onComplete: () => bonusText.destroy(),
    });
  }

  // ====== 敌人点击 ======
  private onEnemyClick(idx: number): void {
    if (!this.enemies[idx].isAlive()) return;
    this.addLog(`目标: ${this.enemies[idx].name}`);
  }

  // ====== 结束回合 ======
  private endTurn(): void {
    this.engine.endPlayerTurn();
    const events = this.engine.executeEnemyTurns();

    for (const e of events) {
      this.addLog(e.description);
    }

    if (this.engine.isBattleOver()) {
      this.onBattleEnd();
      return;
    }

    this.updateUI();
  }

  // ====== 手牌点击 ======
  private onCardClick(idx: number): void {
    const card = this.deck.hand[idx];
    if (!card) return;

    if (!card.canPlay(this.player.ap)) {
      this.addLog(`AP 不足: 需要 ${card.cost}`);
      return;
    }

    this.selectedCardIndex = idx;
    this.addLog(`选择 ${card.name}，请在棋盘上落子`);

    // 高亮选中的卡牌
    this.updateHandUI();
  }

  // ====== 更新UI ======
  private updateUI(): void {
    this.updateHUD();
    this.updateBoard();
    this.updateHandUI();
    this.updateEnemyUI();
  }

  private updateHUD(): void {
    this.hpText.setText(`♥ ${this.player.hp}/${this.player.maxHp}`);
    this.apText.setText(`◆ ${this.player.ap}/${this.player.maxAp}`);
    this.armorText.setText(`🛡 ${this.player.armor}`);

    // 墨压条
    const inkPercent = this.engine.board.getInkChargePercent();
    this.inkChargeFill.width = 350 * inkPercent;
    this.inkChargeText.setText(`墨压 ${this.engine.board.inkCharge}/${this.engine.board.maxInkCharge}`);

    // 墨压满时变色
    if (inkPercent >= 1) {
      this.inkChargeFill.setFillStyle(0xff6b6b);
    } else {
      this.inkChargeFill.setFillStyle(0x4a6a8e);
    }
  }

  private updateBoard(): void {
    // 清除旧的墨子
    for (const stone of this.boardStones) {
      stone.destroy();
    }
    this.boardStones = [];

    // 绘制墨子
    const cellSize = 40;
    const startX = 75;
    const startY = 140;

    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        const cell = this.engine.board.board[y][x];
        if (cell.type === InkStoneType.EMPTY) continue;

        const cx = startX + x * cellSize + cellSize / 2;
        const cy = startY + y * cellSize + cellSize / 2;

        // 玩家墨子（黑色）
        const color = cell.owner === 'player' ? 0x1a1a2e : 0xe8d5b5;
        const stone = this.add.circle(cx, cy, 12, color);
        stone.setStrokeStyle(2, cell.owner === 'player' ? 0x4a6a8e : 0x6a4060);

        this.boardContainer.add(stone);
        this.boardStones.push(stone);
      }
    }

    // 高亮可选位置（如果有选中的卡牌）
    if (this.selectedCardIndex !== null) {
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
          if (this.engine.board.isEmpty(x, y)) {
            const idx = y * 5 + x;
            const cell = this.boardCells[idx];
            if (cell) {
              cell.setFillStyle(0x3a4a5e, 0.6);
            }
          }
        }
      }
    } else {
      // 恢复默认颜色
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
          const idx = y * 5 + x;
          const cell = this.boardCells[idx];
          if (!cell) continue;

          const posType = this.engine.board.getPositionType(x, y);
          if (posType === PositionType.CENTER) {
            cell.setFillStyle(0x3a2a4e, 0.5);
          } else if (posType === PositionType.CORNER) {
            cell.setFillStyle(0x2a3a4e, 0.4);
          } else {
            cell.setFillStyle(0x1a1a2e, 0.4);
          }
        }
      }
    }
  }

  private updateHandUI(): void {
    this.handContainer.removeAll(true);

    const cardWidth = 65;
    const cardHeight = 95;
    const totalWidth = this.deck.hand.length * (cardWidth + 4);
    const startX = (390 - totalWidth) / 2 + cardWidth / 2;
    const cardY = 620;

    this.deck.hand.forEach((card, idx) => {
      const x = startX + idx * (cardWidth + 4);
      const canPlay = card.canPlay(this.player.ap);
      const isSelected = this.selectedCardIndex === idx;

      // 卡牌背景（水墨风）
      let bgColor = 0x1a2a3e;
      let borderColor = 0x4a6a8e;

      if (isSelected) {
        bgColor = 0x3a4a5e;
        borderColor = 0x6bff8a;
      } else if (!canPlay) {
        bgColor = 0x1a1a2e;
        borderColor = 0x2a2a3e;
      }

      // 卡牌类型颜色
      if (card.type === CardType.ATTACK) {
        bgColor = isSelected ? 0x4a2a2e : 0x2a1a1e;
        borderColor = isSelected ? 0xff6b7a : 0x6a3a3e;
      } else if (card.type === CardType.SKILL) {
        bgColor = isSelected ? 0x2a4a2e : 0x1a2a1e;
        borderColor = isSelected ? 0x6bff8a : 0x3a6a3e;
      } else if (card.type === CardType.POWER) {
        bgColor = isSelected ? 0x4a2a4e : 0x2a1a2e;
        borderColor = isSelected ? 0xc86bff : 0x6a3a6e;
      }

      const bg = this.add.rectangle(x, cardY, cardWidth, cardHeight, bgColor, 0.9);
      bg.setStrokeStyle(2, borderColor);
      this.handContainer.add(bg);

      // 费用（左上角）
      const costBg = this.add.circle(x - 25, cardY - 40, 10, 0x1a1a2e);
      costBg.setStrokeStyle(1, 0x6bb5ff);
      this.handContainer.add(costBg);

      const cost = this.add.text(x - 25, cardY - 40, `${card.cost}`, {
        fontSize: '12px',
        color: '#6bb5ff',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      this.handContainer.add(cost);

      // 卡名
      const name = this.add.text(x, cardY - 30, card.name, {
        fontSize: '11px',
        color: '#e8d5b5',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      this.handContainer.add(name);

      // 效果描述
      const desc = this.add.text(x, cardY + 5, card.description, {
        fontSize: '9px',
        color: '#aaa',
        wordWrap: { width: cardWidth - 6 },
        align: 'center',
      }).setOrigin(0.5);
      this.handContainer.add(desc);

      // 类型标签
      const typeLabel = card.type === CardType.ATTACK ? '攻击' : card.type === CardType.SKILL ? '技能' : '能力';
      const typeColor = card.type === CardType.ATTACK ? '#ff6b7a' : card.type === CardType.SKILL ? '#6bff8a' : '#c86bff';
      const type = this.add.text(x, cardY + 38, typeLabel, {
        fontSize: '9px',
        color: typeColor,
      }).setOrigin(0.5);
      this.handContainer.add(type);

      // 交互
      bg.setInteractive({ useHandCursor: true });
      bg.on('pointerdown', () => this.onCardClick(idx));
    });
  }

  private updateEnemyUI(): void {
    // 更新每个敌人的血条和意图
    const spacing = 390 / (this.enemies.length + 1);

    this.enemies.forEach((enemy, idx) => {
      const x = spacing * (idx + 1);
      const enemyY = 420;

      // 更新血条
      const hpFill = this.enemyContainer.getAt(idx * 5 + 3) as Phaser.GameObjects.Rectangle;
      if (hpFill) {
        const ratio = enemy.hp / enemy.maxHp;
        hpFill.width = 70 * ratio;
      }

      // 更新HP文本
      const hpText = this.enemyContainer.getAt(idx * 5 + 4) as Phaser.GameObjects.Text;
      if (hpText) {
        hpText.setText(`${enemy.hp}/${enemy.maxHp}`);
      }

      // 更新意图
      const intentText = this.enemyContainer.getAt(idx * 5 + 5) as Phaser.GameObjects.Text;
      if (intentText) {
        intentText.setText(enemy.intent.description);
      }

      // 隐藏死亡敌人
      const body = this.enemyContainer.getAt(idx * 5) as Phaser.GameObjects.Rectangle;
      if (body) {
        body.setVisible(enemy.isAlive());
      }
    });
  }

  // ====== 战斗日志 ======
  private addLog(msg: string): void {
    this.logLines.push(msg);
    if (this.logLines.length > 6) this.logLines.shift();
    this.logText.setText(this.logLines.join('\n'));
  }

  // ====== 战斗结束 ======
  private onBattleEnd(): void {
    const victory = this.engine.isVictory();
    const msg = victory ? '胜利！' : '战败...';

    const resultBg = this.add.rectangle(195, 422, 390, 844, 0x000000, 0.7);
    const resultText = this.add.text(195, 400, msg, {
      fontSize: '36px',
      color: victory ? '#ffd76b' : '#ff6b7a',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      if (victory) {
        // 更新玩家状态
        this.playerState.hp = this.player.hp;
        this.playerState.maxHp = this.player.maxHp;

        // 检查是否是BOSS战，如果是则进入下一章
        if (this.nodeType === 'BOSS') {
          GameData.onChapterComplete(this.playerState);
        }

        GameData.save(this.playerState);
        this.scene.start('RewardScene', { nodeFloor: this.engine.turnNumber });
      } else {
        GameData.deleteSave();
        this.scene.start('MenuScene');
      }
    });
  }
}
