/**
 * StatusSystem.ts - 状态/Buff/Debuff 系统
 */

export interface Status {
  id: string;
  name: string;
  duration: number;     // 剩余回合，-1 = 永久
  stacks: number;       // 层数
  type: 'buff' | 'debuff';
  onApply?: (target: any) => void;
  onTurnStart?: (target: any) => void;
  onTurnEnd?: (target: any) => void;
  onRemove?: (target: any) => void;
}

// ====== 预制状态模板 ======

export function createVulnerable(turns = 2): Status {
  return {
    id: 'vulnerable',
    name: '易伤',
    duration: turns,
    stacks: 1,
    type: 'debuff',
  };
}

export function createWeak(turns = 2): Status {
  return {
    id: 'weak',
    name: '虚弱',
    duration: turns,
    stacks: 1,
    type: 'debuff',
  };
}

export function createStrength(turns = -1): Status {
  return {
    id: 'strength',
    name: '力量',
    duration: turns,
    stacks: 1,
    type: 'buff',
  };
}

export function createPoison(turns = -1): Status {
  return {
    id: 'poison',
    name: '中毒',
    duration: turns,
    stacks: 1,
    type: 'debuff',
  };
}

export function createRegen(turns = 3): Status {
  return {
    id: 'regen',
    name: '再生',
    duration: turns,
    stacks: 1,
    type: 'buff',
  };
}

// ====== 状态管理器 ======

export class StatusSystem {
  private statuses: Map<string, Status> = new Map();

  /**
   * 添加状态（可叠加）
   */
  add(status: Status): void {
    const existing = this.statuses.get(status.id);
    if (existing) {
      existing.stacks += status.stacks;
      if (status.duration > 0) {
        existing.duration = Math.max(existing.duration, status.duration);
      }
    } else {
      this.statuses.set(status.id, { ...status });
    }
  }

  /**
   * 移除状态
   */
  remove(id: string): boolean {
    return this.statuses.delete(id);
  }

  /**
   * 获取状态
   */
  get(id: string): Status | undefined {
    return this.statuses.get(id);
  }

  /**
   * 是否有某状态
   */
  has(id: string): boolean {
    return this.statuses.has(id);
  }

  /**
   * 获取所有状态
   */
  getAll(): Status[] {
    return Array.from(this.statuses.values());
  }

  /**
   * 获取某状态层数
   */
  getStacks(id: string): number {
    return this.statuses.get(id)?.stacks ?? 0;
  }

  /**
   * 回合开始处理（中毒、再生等）
   */
  processTurnStart(target: any): void {
    // 中毒：每回合受到等层数伤害
    const poison = this.statuses.get('poison');
    if (poison && poison.stacks > 0 && target.takeDamage) {
      target.takeDamage(poison.stacks);
    }

    // 再生：每回合恢复等层数 HP
    const regen = this.statuses.get('regen');
    if (regen && regen.stacks > 0 && target.heal) {
      target.heal(regen.stacks);
    }
  }

  /**
   * 回合结束处理（状态衰减）
   */
  processTurnEnd(_target: any): void {
    for (const [id, status] of this.statuses) {
      if (status.duration > 0) {
        status.duration -= 1;
        if (status.duration <= 0) {
          this.statuses.delete(id);
        }
      }
    }
  }

  /**
   * 清空所有状态
   */
  clear(): void {
    this.statuses.clear();
  }
}
