/**
 * EventData.ts - 事件数据
 * 20+ 随机事件，覆盖5章主题
 */

import { PlayerState } from './GameData';

export interface EventOption {
  text: string;
  condition?: (state: PlayerState) => boolean;
  effect: (state: PlayerState) => void;
  result: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  background: string;
  /** 适用章节，空=所有章节 */
  chapters?: number[];
  options: EventOption[];
}

export const EVENTS: GameEvent[] = [
  // ==================== 通用事件 ====================
  {
    id: 'ancient_well',
    title: '古井',
    description: '你发现一口古井，井水清澈见底。',
    background: '井水泛着微光，似乎蕴含着某种力量。',
    options: [
      {
        text: '饮水 (+10 HP)',
        effect: (state) => { state.hp = Math.min(state.maxHp, state.hp + 10); },
        result: '你喝了井水，恢复了一些体力。',
      },
      {
        text: '投入金币 (-10💰, +5 最大HP)',
        condition: (state) => state.gold >= 10,
        effect: (state) => { state.gold -= 10; state.maxHp += 5; state.hp += 5; },
        result: '井水闪烁，你感到身体变得更强壮。',
      },
      {
        text: '离开',
        effect: () => {},
        result: '你继续前行。',
      },
    ],
  },
  {
    id: 'lost_traveler',
    title: '迷途旅人',
    description: '一个旅人向你求助，他说他的包袱被偷了。',
    background: '旅人看起来很疲惫，眼神中带着恳求。',
    options: [
      {
        text: '帮助 (+20💰)',
        effect: (state) => { state.gold += 20; },
        result: '旅人感激地给了你一些金币作为答谢。',
      },
      {
        text: '给予食物 (-10HP, +35💰)',
        condition: (state) => state.hp > 20,
        effect: (state) => { state.hp -= 10; state.gold += 35; },
        result: '旅人更加感激，给了你更多金币。',
      },
      {
        text: '离开',
        effect: () => {},
        result: '你继续前行。',
      },
    ],
  },
  {
    id: 'altar',
    title: '祭坛',
    description: '一座古老的祭坛散发着微光。',
    background: '祭坛上刻满了古老的符文，似乎在等待献祭。',
    options: [
      {
        text: '献祭 (-10HP, +15护甲)',
        condition: (state) => state.hp > 15,
        effect: (state) => { state.hp -= 10; state.startingArmor = (state.startingArmor || 0) + 15; },
        result: '你感到一阵虚弱，但身上笼罩了一层护盾。',
      },
      {
        text: '祈祷 (+5最大HP)',
        effect: (state) => { state.maxHp += 5; state.hp += 5; },
        result: '祭坛的光芒涌入你的身体，你感到更强壮了。',
      },
      {
        text: '离开',
        effect: () => {},
        result: '你离开了祭坛。',
      },
    ],
  },
  {
    id: 'treasure_chest',
    title: '宝箱',
    description: '你发现了一个宝箱，但上面有锁。',
    background: '宝箱看起来很古老，锁已经生锈。',
    options: [
      {
        text: '强行打开 (+40💰, -8HP)',
        effect: (state) => { state.gold += 40; state.hp -= 8; },
        result: '你用力撬开了宝箱，但被碎片划伤。',
      },
      {
        text: '小心打开 (+25💰)',
        effect: (state) => { state.gold += 25; },
        result: '你小心翼翼地打开了宝箱，获得了一些金币。',
      },
      {
        text: '离开',
        effect: () => {},
        result: '你决定不冒险，继续前行。',
      },
    ],
  },
  {
    id: 'mysterious_merchant',
    title: '神秘商人',
    description: '一个神秘的商人出现在你面前。',
    background: '商人戴着斗笠，看不清面容，但他的商品很吸引人。',
    options: [
      {
        text: '购买生命药水 (-30💰, +30HP)',
        condition: (state) => state.gold >= 30,
        effect: (state) => { state.gold -= 30; state.hp = Math.min(state.maxHp, state.hp + 30); },
        result: '你喝下药水，感觉好多了。',
      },
      {
        text: '购买力量符文 (-60💰, 下场攻击+5)',
        condition: (state) => state.gold >= 60,
        effect: (state) => { state.gold -= 60; state.tempDamageBonus = (state.tempDamageBonus || 0) + 5; },
        result: '你获得了力量符文，感到力量在增长。',
      },
      {
        text: '离开',
        effect: () => {},
        result: '商人消失了。',
      },
    ],
  },
  {
    id: 'ink_spring',
    title: '墨泉',
    description: '一汪墨色泉水从岩缝中涌出。',
    background: '泉水散发着淡淡的墨香，似乎能洗涤身心。',
    options: [
      {
        text: '饮用墨泉 (+20HP, +2墨压)',
        effect: (state) => {
          state.hp = Math.min(state.maxHp, state.hp + 20);
        },
        result: '墨水入喉，你感到精力充沛。',
      },
      {
        text: '装满墨瓶 (获得墨溅卡)',
        effect: (state) => { state.deckTemplateIds.push('inkSplash'); },
        result: '你将墨水装入瓶中，它似乎蕴含着一股力量。',
      },
      {
        text: '离开',
        effect: () => {},
        result: '你离开了墨泉。',
      },
    ],
  },
  {
    id: 'wandering_sage',
    title: '游方智者',
    description: '一位白发老者拦住你的去路。',
    background: '"年轻人，老夫有一物可助你一臂之力，但你需付出代价。"',
    options: [
      {
        text: '请教 (-40💰, +1最大AP)',
        condition: (state) => state.gold >= 40 && state.maxAp < 6,
        effect: (state) => { state.gold -= 40; state.maxAp += 1; state.ap += 1; },
        result: '老者传授了你一套心法，你的行动更加敏捷了。',
      },
      {
        text: '求助 (+15HP)',
        effect: (state) => { state.hp = Math.min(state.maxHp, state.hp + 15); },
        result: '老者为你疗伤，你的伤势好转了许多。',
      },
      {
        text: '谢绝',
        effect: () => {},
        result: '老者微微一笑，消失在雾气中。',
      },
    ],
  },
  {
    id: 'ambush',
    title: '伏击',
    description: '一群蒙面人突然从暗处窜出！',
    background: '他们手持利刃，目光凶狠。',
    options: [
      {
        text: '战斗 (-15HP, +50💰)',
        effect: (state) => { state.hp -= 15; state.gold += 50; },
        result: '你击退了伏击者，但也受了些伤。搜刮了他们身上的金币。',
      },
      {
        text: '交钱保命 (-30💰)',
        condition: (state) => state.gold >= 30,
        effect: (state) => { state.gold -= 30; },
        result: '你乖乖交出了金币，蒙面人扬长而去。',
      },
      {
        text: '逃跑 (-5HP)',
        effect: (state) => { state.hp -= 5; },
        result: '你拼命逃跑，摔了一跤，幸好没有大碍。',
      },
    ],
  },
  {
    id: 'abandoned_shrine',
    title: '荒废神龛',
    description: '路边有一座荒废的神龛，供奉着一尊不知名的神像。',
    background: '神像面容模糊，但手中的香炉还有余温。',
    options: [
      {
        text: '上香祈福 (随机+5~15HP)',
        effect: (state) => {
          const heal = 5 + Math.floor(Math.random() * 11);
          state.hp = Math.min(state.maxHp, state.hp + heal);
        },
        result: '香烟袅袅升起，你感到一股暖流涌入体内。',
      },
      {
        text: '捐功德 (-20💰, +8最大HP)',
        condition: (state) => state.gold >= 20,
        effect: (state) => { state.gold -= 20; state.maxHp += 8; state.hp += 8; },
        result: '功德箱中传来一声清脆的响声，你感到身体变得更加坚韧。',
      },
      {
        text: '离开',
        effect: () => {},
        result: '你转身离去。',
      },
    ],
  },
  {
    id: 'card_collector',
    title: '卡牌收藏家',
    description: '一位衣着考究的收藏家向你展示他的收藏。',
    background: '"我这里有几张珍贵的卡牌，想不想看看？"',
    options: [
      {
        text: '购买残卷 (-50💰, 随机卡牌)',
        condition: (state) => state.gold >= 50,
        effect: (state) => {
          state.gold -= 50;
          const pool = ['heavyStrike', 'cleave', 'ironSkin', 'doubleStrike', 'inkBlade', 'shadowStep'];
          state.deckTemplateIds.push(pool[Math.floor(Math.random() * pool.length)]);
        },
        result: '你获得了一张未曾见过的卡牌。',
      },
      {
        text: '以物易物 (移除一张基础打击, +稀有卡)',
        condition: (state) => state.deckTemplateIds.includes('strike'),
        effect: (state) => {
          const idx = state.deckTemplateIds.indexOf('strike');
          state.deckTemplateIds.splice(idx, 1);
          const rares = ['whirlwindSlash', 'decisiveBlow', 'inkStorm', 'fortress'];
          state.deckTemplateIds.push(rares[Math.floor(Math.random() * rares.length)]);
        },
        result: '收藏家用一张稀有卡牌换走了你的一张基础打击。',
      },
      {
        text: '离开',
        effect: () => {},
        result: '你谢绝了收藏家的好意。',
      },
    ],
  },
  {
    id: 'gambler',
    title: '赌徒',
    description: '路边一个赌徒向你招手。',
    background: '"来赌一把？赢了翻倍，输了归零！"',
    options: [
      {
        text: '赌20金币',
        condition: (state) => state.gold >= 20,
        effect: (state) => {
          if (Math.random() < 0.45) {
            state.gold += 20;
          } else {
            state.gold -= 20;
          }
        },
        result: Math.random() < 0.45 ? '手气不错，赢了！' : '运气不佳，输了。',
      },
      {
        text: '赌50金币',
        condition: (state) => state.gold >= 50,
        effect: (state) => {
          if (Math.random() < 0.45) {
            state.gold += 50;
          } else {
            state.gold -= 50;
          }
        },
        result: Math.random() < 0.45 ? '大获全胜！' : '血本无归...',
      },
      {
        text: '不赌',
        effect: () => {},
        result: '你转身离去，赌徒在身后叹气。',
      },
    ],
  },
  {
    id: 'training_ground',
    title: '练武场',
    description: '你路过一处练武场，几位武者正在切磋。',
    background: '他们的招式精妙，你看得入了神。',
    options: [
      {
        text: '观摩学习 (升级一张打击牌)',
        condition: (state) => state.deckTemplateIds.includes('strike'),
        effect: (state) => {
          const idx = state.deckTemplateIds.indexOf('strike');
          state.deckTemplateIds[idx] = 'strikeUpgraded';
        },
        result: '你领悟了新的招式，打击牌升级了！',
      },
      {
        text: '切磋 (-10HP, +30💰)',
        effect: (state) => { state.hp -= 10; state.gold += 30; },
        result: '你与武者切磋，虽败犹荣，获得了他们的赞赏。',
      },
      {
        text: '离开',
        effect: () => {},
        result: '你继续赶路。',
      },
    ],
  },
  {
    id: 'trap_room',
    title: '机关密室',
    description: '你误入一间布满机关的密室。',
    background: '地板上刻着奇怪的纹路，墙壁上似乎有暗门。',
    options: [
      {
        text: '强行突破 (-12HP, +60💰)',
        effect: (state) => { state.hp -= 12; state.gold += 60; },
        result: '你触发了数个暗箭，但最终找到了宝藏。',
      },
      {
        text: '小心拆解 (-5HP, +35💰)',
        effect: (state) => { state.hp -= 5; state.gold += 35; },
        result: '你小心翼翼地拆解了部分机关，获得了一些宝物。',
      },
      {
        text: '原路返回',
        effect: () => {},
        result: '你谨慎地退出了密室。',
      },
    ],
  },
  // ==================== 第1章：墨林迷踪 ====================
  {
    id: 'bamboo_grove',
    title: '竹林幽径',
    description: '翠竹摇曳，一条幽径延伸向远方。',
    background: '竹叶沙沙作响，仿佛有人在低语。',
    chapters: [1],
    options: [
      {
        text: '深入竹林 (+20💰, 获得竹叶卡)',
        effect: (state) => {
          state.gold += 20;
          state.deckTemplateIds.push('inkBlade');
        },
        result: '你在竹林深处发现了一片蕴含灵力的竹叶，化作一张卡牌。',
      },
      {
        text: '静坐悟道 (+8最大HP)',
        effect: (state) => { state.maxHp += 8; state.hp += 8; },
        result: '你在竹林中静坐，感悟自然之道，身心得到了滋养。',
      },
      {
        text: '匆匆而过',
        effect: () => {},
        result: '你没有停留，继续赶路。',
      },
    ],
  },
  // ==================== 第2章：墨池深渊 ====================
  {
    id: 'deep_pool',
    title: '深渊之畔',
    description: '你来到一处深不见底的水潭旁。',
    background: '潭水漆黑如墨，偶尔有气泡冒出。',
    chapters: [2],
    options: [
      {
        text: '探手取水 (-8HP, 获得墨池精华)',
        effect: (state) => {
          state.hp -= 8;
          state.maxHp += 10;
          state.hp += 10;
        },
        result: '潭水冰冷刺骨，但你感到一股力量涌入体内。',
      },
      {
        text: '投石问路',
        effect: (state) => { state.gold += 30; },
        result: '石头落入潭中，溅起一片金币——似乎有人此前落入。',
      },
      {
        text: '绕道而行',
        effect: () => {},
        result: '你觉得此处不宜久留，绕道而行。',
      },
    ],
  },
  // ==================== 第3章：墨山秘境 ====================
  {
    id: 'mountain_cave',
    title: '山洞密境',
    description: '山壁上有一个隐秘的洞口。',
    background: '洞口散发着微光，似乎内有乾坤。',
    chapters: [3],
    options: [
      {
        text: '进入探索 (-10HP, +45💰)',
        effect: (state) => { state.hp -= 10; state.gold += 45; },
        result: '洞中有机关陷阱，但你还是找到了宝藏。',
      },
      {
        text: '洞中修炼 (+15HP)',
        effect: (state) => { state.hp = Math.min(state.maxHp, state.hp + 15); },
        result: '洞中灵气充沛，你在此修炼，恢复了不少精力。',
      },
      {
        text: '不敢冒险',
        effect: () => {},
        result: '你看了看洞口，决定不冒险。',
      },
    ],
  },
  // ==================== 第4章：影武者殿堂 ====================
  {
    id: 'shadow_trial',
    title: '影之试炼',
    description: '一座暗影覆盖的殿堂出现在你面前。',
    background: '殿门上的铭文写道："唯有勇者，方可通过。"',
    chapters: [4],
    options: [
      {
        text: '接受试炼 (-20HP, +1最大AP)',
        condition: (state) => state.hp > 25 && state.maxAp < 6,
        effect: (state) => { state.hp -= 20; state.maxAp += 1; state.ap += 1; },
        result: '你经历了影之试炼，虽身受重伤，但突破了极限。',
      },
      {
        text: '供奉 (-40💰, 获得影步卡)',
        condition: (state) => state.gold >= 40,
        effect: (state) => { state.gold -= 40; state.deckTemplateIds.push('shadowStep'); },
        result: '你将金币放在殿门前，一道暗影化作卡牌飘入你手中。',
      },
      {
        text: '绕道',
        effect: () => {},
        result: '你决定不打扰此处安宁。',
      },
    ],
  },
  // ==================== 第5章：墨渊核心 ====================
  {
    id: 'void_rift',
    title: '虚空裂隙',
    description: '一道扭曲的裂隙悬浮在你面前。',
    background: '裂隙中传来低沉的嗡鸣声，似乎有什么东西在呼唤你。',
    chapters: [5],
    options: [
      {
        text: '伸手触碰 (-15HP, 获得虚空卡)',
        effect: (state) => {
          state.hp -= 15;
          state.deckTemplateIds.push('inkStorm');
        },
        result: '虚空之力涌入你的身体，你感到一股毁天灭地的力量。',
      },
      {
        text: '汲取能量 (+10HP, +20💰)',
        effect: (state) => { state.hp = Math.min(state.maxHp, state.hp + 10); state.gold += 20; },
        result: '你小心翼翼地汲取了裂隙的能量。',
      },
      {
        text: '快速离开',
        effect: () => {},
        result: '你感到此处危险，迅速离开。',
      },
    ],
  },
];

/**
 * 根据章节获取事件
 */
export function getRandomEvent(chapter: number = 0): GameEvent {
  const filtered = chapter > 0
    ? EVENTS.filter(e => !e.chapters || e.chapters.includes(chapter))
    : EVENTS;

  return filtered[Math.floor(Math.random() * filtered.length)];
}

/**
 * 获取事件总数
 */
export function getEventCount(): number {
  return EVENTS.length;
}
