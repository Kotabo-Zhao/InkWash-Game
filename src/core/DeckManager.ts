/**
 * DeckManager.ts - 牌库管理器
 */

import { Card } from '../cards/CardSystem';

export class DeckManager {
  public drawPile: Card[] = [];
  public hand: Card[] = [];
  public discardPile: Card[] = [];
  public exhaustPile: Card[] = [];

  /**
   * 初始化牌库
   */
  init(cards: Card[]): void {
    this.drawPile = [...cards];
    this.hand = [];
    this.discardPile = [];
    this.exhaustPile = [];
    this.shuffle();
  }

  /**
   * 洗牌
   */
  shuffle(): void {
    for (let i = this.drawPile.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.drawPile[i], this.drawPile[j]] = [this.drawPile[j], this.drawPile[i]];
    }
  }

  /**
   * 抽牌
   */
  draw(count = 1): Card[] {
    const drawn: Card[] = [];
    for (let i = 0; i < count; i++) {
      if (this.drawPile.length === 0) {
        this.recycle();
        if (this.drawPile.length === 0) break;
      }
      const card = this.drawPile.pop()!;
      this.hand.push(card);
      drawn.push(card);
    }
    return drawn;
  }

  /**
   * 从手牌打出
   */
  play(cardIndex: number): Card | null {
    if (cardIndex < 0 || cardIndex >= this.hand.length) return null;
    const card = this.hand.splice(cardIndex, 1)[0];
    this.discardPile.push(card);
    return card;
  }

  /**
   * 回收弃牌堆到抽牌堆
   */
  private recycle(): void {
    this.drawPile.push(...this.discardPile);
    this.discardPile = [];
    this.shuffle();
  }

  /**
   * 清空手牌
   */
  clearHand(): void {
    this.discardPile.push(...this.hand);
    this.hand = [];
  }

  /**
   * 获取统计
   */
  getStats() {
    return {
      draw: this.drawPile.length,
      hand: this.hand.length,
      discard: this.discardPile.length,
      exhaust: this.exhaustPile.length,
    };
  }
}
