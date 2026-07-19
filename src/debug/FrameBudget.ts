export interface FrameBudgetReport {
  fps: number;
  used: number;
  budget: number;
  overage: number;
  warnings: string[];
}

export class FrameBudget {
  static readonly TARGET_FPS = 30;
  static readonly FRAME_BUDGET_MS = 1000 / FrameBudget.TARGET_FPS;
  static readonly WARN_THRESHOLD = 0.8;

  private history: number[] = [];
  private lastFrameTime = 0;

  beginFrame(): number {
    this.lastFrameTime = performance.now();
    return FrameBudget.FRAME_BUDGET_MS;
  }

  endFrame(): FrameBudgetReport {
    const elapsed = performance.now() - this.lastFrameTime;
    this.history.push(elapsed);
    if (this.history.length > 60) this.history.shift();

    const fps = this.calcFPS();
    const overage = Math.max(0, elapsed - FrameBudget.FRAME_BUDGET_MS);
    const usage = elapsed / FrameBudget.FRAME_BUDGET_MS;
    const warnings: string[] = [];
    if (usage > FrameBudget.WARN_THRESHOLD) {
      warnings.push(`帧预算使用率 ${(usage * 100).toFixed(0)}%`);
    }
    if (fps < 20) {
      warnings.push(`严重掉帧: ${fps.toFixed(1)} FPS`);
    }
    return { fps, used: elapsed, budget: FrameBudget.FRAME_BUDGET_MS, overage, warnings };
  }

  private calcFPS(): number {
    if (this.history.length < 2) return FrameBudget.TARGET_FPS;
    const avg = this.history.reduce((a, b) => a + b, 0) / this.history.length;
    return avg > 0 ? 1000 / avg : FrameBudget.TARGET_FPS;
  }

  static autoQualityScale(fps: number): number {
    if (fps >= 30) return 1.0;
    if (fps >= 25) return 0.75;
    if (fps >= 20) return 0.5;
    return 0.25;
  }
}
