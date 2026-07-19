/**
 * GameData.ts - 游戏数据管理（存档、玩家状态、关卡进度）
 */

export interface PlayerState {
  hp: number;
  maxHp: number;
  ap: number;
  maxAp: number;
  gold: number;
  deckTemplateIds: string[];
  currentChapter: number;
  currentNodeFloor: number;
  visitedNodes: number[];
  level: number;
  exp: number;
}

export interface GameSave {
  playerState: PlayerState;
  timestamp: number;
  version: string;
}

export class GameData {
  private static readonly SAVE_KEY = 'inkrealm_save';
  private static readonly VERSION = '0.1.0';

  /**
   * 创建初始玩家状态
   */
  static createInitialPlayerState(): PlayerState {
    return {
      hp: 60,
      maxHp: 60,
      ap: 3,
      maxAp: 3,
      gold: 100,
      deckTemplateIds: [
        'strike', 'strike', 'strike', 'strike', 'strike',
        'defend', 'defend', 'defend', 'defend',
        'quickSlash'
      ],
      currentChapter: 1,
      currentNodeFloor: 0,
      visitedNodes: [],
      level: 1,
      exp: 0,
    };
  }

  /**
   * 保存游戏
   */
  static save(state: PlayerState): boolean {
    try {
      const save: GameSave = {
        playerState: state,
        timestamp: Date.now(),
        version: GameData.VERSION,
      };
      localStorage.setItem(GameData.SAVE_KEY, JSON.stringify(save));
      return true;
    } catch (e) {
      console.error('保存失败:', e);
      return false;
    }
  }

  /**
   * 加载游戏
   */
  static load(): PlayerState | null {
    try {
      const raw = localStorage.getItem(GameData.SAVE_KEY);
      if (!raw) return null;
      const save: GameSave = JSON.parse(raw);
      if (save.version !== GameData.VERSION) {
        console.warn('存档版本不兼容');
        return null;
      }
      return save.playerState;
    } catch (e) {
      console.error('加载失败:', e);
      return null;
    }
  }

  /**
   * 删除存档
   */
  static deleteSave(): void {
    localStorage.removeItem(GameData.SAVE_KEY);
  }

  /**
   * 是否有存档
   */
  static hasSave(): boolean {
    return localStorage.getItem(GameData.SAVE_KEY) !== null;
  }

  /**
   * 章节升级（HP+10, AP+1）
   * @returns true 如果成功进入下一章，false 如果已到最终章（第5章）
   */
  static onChapterComplete(state: PlayerState): boolean {
    const MAX_CHAPTERS = 5;
    
    if (state.currentChapter >= MAX_CHAPTERS) {
      // 已通关最终章
      return false;
    }
    
    state.currentChapter++;
    state.currentNodeFloor = 0;
    state.maxHp += 10;
    state.hp = state.maxHp;
    if (state.maxAp < 5) {
      state.maxAp++;
    }
    state.ap = state.maxAp;
    return true;
  }
  
  /**
   * 检查是否已通关最终章
   */
  static isGameComplete(state: PlayerState): boolean {
    return state.currentChapter >= 5;
  }

  /**
   * 获得经验
   */
  static gainExp(state: PlayerState, amount: number): void {
    state.exp += amount;
    const expNeeded = state.level * 50;
    if (state.exp >= expNeeded) {
      state.level++;
      state.exp -= expNeeded;
    }
  }

  /**
   * 应用节点奖励（金币、HP等）
   */
  static applyNodeReward(state: PlayerState, reward: { gold?: number; hp?: number }): void {
    if (reward.gold) state.gold += reward.gold;
    if (reward.hp) state.hp = Math.min(state.maxHp, state.hp + reward.hp);
  }
}
