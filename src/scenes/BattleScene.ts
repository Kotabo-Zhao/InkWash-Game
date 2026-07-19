/**
 * BattleScene.ts - 战斗场景
 */

import Phaser from 'phaser';
import { Player } from '../core/Player';
import { Enemy } from '../core/Enemy';
import { DeckManager } from '../core/DeckManager';
import { BattleEngine, BattleEvent } from '../combat/BattleEngine';
import { Card } from '../cards/CardSystem';
import { CardDatabase } from '../cards/CardDatabase';
import { getEnemiesForNode } from '../data/ChapterData';
import { GameData } from '../data/GameData';

interface BattleInitData {
  nodeType: string;
  nodeFloor: number;
}

export class BattleScene extends Phaser.Scene {
  private player!: Player;
  private enemies: Enemy[] = [];
  private deck!: DeckManager;
  private engine!: BattleEngine;

  private hpText!: Phaser.GameObjects.Text;
  private apText!: Phaser.GameObjects.Text;
  private armorText!: Phaser.GameObjects.Text;
  private handContainer!: Phaser.GameObjects.Container;
  private enemyContainers: Phaser.GameObjects.Container[] = [];
  private logText!: Phaser.GameObjects.Text;
  private endTurnBtn!: Phaser.GameObjects.Text;
  private logLines: string[] = [];
  private playerState!: any;

  constructor() { super({ key: 'BattleScene' }); }

  init(data: BattleInitData): void {
    this.playerState = GameData.load() || GameData.createInitialPlayerState();

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
    this.add.rectangle(195, 422, 390, 844, 0x0f0f1a);

    this.createHUD();
    this.createEnemyUI();
    this.createHandUI();
    this.createLogUI();
    this.createEndTurnButton();

    this.engine.startBattle(5);
    this.updateUI();
    this.addLog('战斗开始！');
  }

  private createHUD(): void {
    this.hpText = this.add.text(10, 10, '', { fontSize: '16px', color: '#6bff8a' });
    this.apText = this.add.text(10, 32, '', { fontSize: '16px', color: '#6bb5ff' });
    this.armorText = this.add.text(10, 54, '', { fontSize: '16px', color: '#ffd76b' });
  }

  private createEnemyUI(): void {
    this.enemyContainers = [];
    const enemyY = 160;
    const spacing = 390 / (this.enemies.length + 1);

    this.enemies.forEach((enemy, idx) => {
      const x = spacing * (idx + 1);
      const container = this.add.container(x, enemyY);

      const body = this.add.rectangle(0, 0, 60, 80, 0x3a2040);
      body.setStrokeStyle(2, 0x6a4060);

      const name = this.add.text(0, -50, enemy.name, {
        fontSize: '12px', color: '#e8d5b5',
      }).setOrigin(0.5);

      const hpBar = this.add.rectangle(0, 48, 60, 6, 0x333);
      const hpFill = this.add.rectangle(-30, 48, 60, 6, 0xff3333);
      hpFill.setOrigin(0, 0);

      const hpText = this.add.text(0, 60, `${enemy.hp}/${enemy.maxHp}`, {
        fontSize: '10px', color: '#ff6b7a',
      }).setOrigin(0.5);

      const intentText = this.add.text(0, 75, enemy.intent.description, {
        fontSize: '10px', color: '#ffa500',
      }).setOrigin(0.5);

      container.add([body, name, hpBar, hpFill, hpText, intentText]);
      container.setInteractive({ useHandCursor: true });
      container.on('pointerdown', () => this.onEnemyClick(idx));

      this.enemyContainers.push(container);
    });
  }

  private createHandUI(): void {
    this.handContainer = this.add.container(0, 0);
  }

  private createLogUI(): void {
    this.logText = this.add.text(10, 560, '', {
      fontSize: '11px',
      color: '#888',
      wordWrap: { width: 370 },
    });
  }

  private createEndTurnButton(): void {
    this.endTurnBtn = this.add.text(300, 520, '[ 结束回合 ]', {
      fontSize: '16px',
      color: '#ffd76b',
      backgroundColor: '#2a2a3e',
      padding: { x: 10, y: 6 },
    });
    this.endTurnBtn.setInteractive({ useHandCursor: true });
    this.endTurnBtn.on('pointerdown', () => this.endTurn());
  }

  private onEnemyClick(idx: number): void {
    console.log('Target enemy:', idx);
  }

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

  private playCard(idx: number): void {
    const card = this.deck.hand[idx];
    if (!card) return;
    if (!card.canPlay(this.player.ap)) {
      this.addLog(`AP 不足: 需要 ${card.cost}`);
      return;
    }

    let targetIdx = this.enemies.findIndex(e => e.isAlive());
    if (targetIdx < 0) return;

    const events = this.engine.playCard(idx, targetIdx);
    for (const e of events) {
      this.addLog(e.description);
    }

    this.updateUI();

    if (this.engine.isBattleOver()) {
      this.onBattleEnd();
    }
  }

  private updateUI(): void {
    this.hpText.setText(`HP: ${this.player.hp}/${this.player.maxHp}`);
    this.apText.setText(`AP: ${this.player.ap}/${this.player.maxAp}`);
    this.armorText.setText(`护甲: ${this.player.armor}`);

    this.enemies.forEach((enemy, idx) => {
      const container = this.enemyContainers[idx];
      if (!container) return;
      const intentLabel = container.getAt(5) as Phaser.GameObjects.Text;
      if (intentLabel) intentLabel.setText(enemy.intent.description);
      const hpLabel = container.getAt(4) as Phaser.GameObjects.Text;
      if (hpLabel) hpLabel.setText(`${enemy.hp}/${enemy.maxHp}`);
      const hpFill = container.getAt(3) as Phaser.GameObjects.Rectangle;
      if (hpFill) {
        const ratio = enemy.hp / enemy.maxHp;
        hpFill.width = 60 * ratio;
      }
      container.setVisible(enemy.isAlive());
    });

    this.handContainer.removeAll(true);
    const cardWidth = 65;
    const totalWidth = this.deck.hand.length * (cardWidth + 4);
    const startX = (390 - totalWidth) / 2 + cardWidth / 2;
    const cardY = 680;

    this.deck.hand.forEach((card, idx) => {
      const x = startX + idx * (cardWidth + 4);
      const canPlay = card.canPlay(this.player.ap);
      const bgColor = canPlay ? 0x1a2a3e : 0x1a1a2e;
      const borderColor = canPlay ? 0x4a6a8e : 0x2a2a3e;

      const bg = this.add.rectangle(x, cardY, cardWidth, 90, bgColor);
      bg.setStrokeStyle(1, borderColor);
      this.handContainer.add(bg);

      const name = this.add.text(x, cardY - 35, card.name, {
        fontSize: '11px', color: '#e8d5b5',
      }).setOrigin(0.5);
      this.handContainer.add(name);

      const cost = this.add.text(x - 25, cardY - 40, `${card.cost}`, {
        fontSize: '12px', color: '#6bb5ff',
      }).setOrigin(0.5);
      this.handContainer.add(cost);

      const desc = this.add.text(x, cardY + 5, card.description, {
        fontSize: '9px', color: '#aaa',
        wordWrap: { width: cardWidth - 6 },
        align: 'center',
      }).setOrigin(0.5);
      this.handContainer.add(desc);

      const typeLabel = card.type === 'ATTACK' ? '攻击' : card.type === 'SKILL' ? '技能' : '能力';
      const typeColor = card.type === 'ATTACK' ? '#ff6b7a' : card.type === 'SKILL' ? '#6bff8a' : '#c86bff';
      const type = this.add.text(x, cardY + 35, typeLabel, {
        fontSize: '9px', color: typeColor,
      }).setOrigin(0.5);
      this.handContainer.add(type);

      bg.setInteractive({ useHandCursor: true });
      bg.on('pointerdown', () => this.playCard(idx));
    });
  }

  private addLog(msg: string): void {
    this.logLines.push(msg);
    if (this.logLines.length > 6) this.logLines.shift();
    this.logText.setText(this.logLines.join('\n'));
  }

  private onBattleEnd(): void {
    const victory = this.engine.isVictory();
    const msg = victory ? '胜利！' : '战败...';
    this.add.text(195, 400, msg, {
      fontSize: '32px',
      color: victory ? '#ffd76b' : '#ff6b7a',
    }).setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      if (victory) {
        // 更新玩家状态
        this.playerState.hp = this.player.hp;
        this.playerState.maxHp = this.player.maxHp;
        GameData.save(this.playerState);
        this.scene.start('RewardScene', { nodeFloor: this.engine.turnNumber });
      } else {
        GameData.deleteSave();
        this.scene.start('MenuScene');
      }
    });
  }
}
