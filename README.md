# 墨境棋局 - 水墨风卡牌Roguelike

> **核心创新**：5×5棋盘落子策略 × 卡牌战斗，位置决定效果加成。

## 项目信息

- **版本**：v0.2.4-alpha
- **引擎**：Phaser 3.80.1
- **语言**：TypeScript 5.5
- **构建**：Rollup + Vitest
- **目标平台**：Web / 微信小游戏
- **仓库**：https://github.com/Kotabo-Zhao/InkWash-Game

## 游戏特色

- **棋盘+卡牌**：每张牌打出后需在5×5棋盘上选择落子位置
  - 天元（中心）：双倍伤害
  - 四角：+3护甲
  - 边缘：+1抽牌
- **5种阵型**：四角阵、十字阵、一线阵、对角阵、墨环阵
- **墨压系统**：落子累积墨压，满100释放终极技「墨染乾坤」
- **水墨风格UI**：宣纸底色、书法字体、印章风按钮、墨迹粒子
- **3章节剧情**：墨林迷踪 → 影武者殿堂 → 墨渊深处
- **Roguelike**：随机地图、事件、商店、休息点、卡牌奖励

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式（热重载）
npm run dev

# 类型检查 / 测试 / 构建
npm run typecheck
npm run test
npm run build

# 运行游戏
cd dist && python -m http.server 8080
```

## 项目结构

```
src/
├── core/                  # 核心系统
│   ├── Board.ts           # 棋盘数据结构
│   ├── BoardBattle.ts     # 棋盘战斗系统（位置加成、阵型、墨压）
│   ├── DeckManager.ts     # 牌库管理
│   ├── Enemy.ts           # 敌人逻辑
│   ├── GameStateMachine.ts # 游戏状态机
│   ├── Player.ts          # 玩家数据
│   └── StatusSystem.ts    # Buff/Debuff系统
├── cards/                 # 卡牌系统
│   ├── CardDatabase.ts    # 卡牌数据库
│   └── CardSystem.ts      # 卡牌逻辑
├── combat/
│   └── BattleEngine.ts    # 战斗引擎（整合棋盘+卡牌）
├── map/
│   └── MapNode.ts         # 地图节点
├── scenes/                # 13个游戏场景
│   ├── BattleScene.ts     # 战斗场景（棋盘交互）
│   ├── BootScene.ts       # 加载场景
│   ├── EventScene.ts      # 事件场景
│   ├── GameScene.ts       # 游戏主控场景
│   ├── MapScene.ts        # 地图场景
│   ├── MenuScene.ts       # 主菜单
│   ├── PauseOverlay.ts    # 暂停覆盖层
│   ├── RestScene.ts       # 休息场景
│   ├── ResultScene.ts     # 结果场景
│   ├── RewardScene.ts     # 奖励场景
│   ├── SettingsOverlay.ts # 设置覆盖层
│   ├── ShopScene.ts       # 商店场景
│   └── UpgradeScene.ts    # 升级场景
├── data/                  # 数据定义
│   ├── CardPoolData.ts    # 卡池数据
│   ├── ChapterData.ts     # 章节数据
│   ├── EventData.ts       # 事件数据
│   ├── GameData.ts        # 游戏全局数据
│   └── WorldLore.ts       # 世界观文本
├── debug/
│   └── FrameBudget.ts     # 帧预算调试
└── main.ts                # 入口文件

docs/                      # 文档体系
├── 00-开发流程.md          # 开发流水线规范
├── 01-项目概览.md          # 项目总览（单一事实来源）
├── 02-世界观设定.md        # 世界观、角色、剧情
├── 03-玩法设计.md          # 核心玩法详细说明
├── 04-美术规范.md          # 美术风格、素材规格、生成流程
├── 05-需求清单.md          # 待开发需求（按优先级）
└── 06-开发日志.md          # 变更历史

scripts/
└── art_pipeline.py        # ComfyUI美术资源自动化生成管线

tests/
├── board.test.ts          # 棋盘系统测试
└── state-machine.test.ts  # 状态机测试
```

## 开发进度

- ✅ 棋盘战斗系统（5×5落子、位置加成、阵型、墨压）
- ✅ 水墨风UI（13个场景全部重写）
- ✅ 完整文档体系（7个核心文档）
- ✅ 美术管线（ComfyUI + VNCCS POSE STUDIO）
- ✅ 卡牌系统（10种基础卡牌）
- ✅ 地图系统（随机生成）
- ✅ 状态系统（Buff/Debuff）
- ✅ 存档系统
- ✅ Git版本管理（已推送至GitHub）
- ⏳ 美术资源实际生成（管线已就绪，待ComfyUI测试）
- ⏳ 音效和背景音乐
- ⏳ 微信小游戏适配

## 相关文档

详细开发文档见 [docs/](./docs/) 目录。
