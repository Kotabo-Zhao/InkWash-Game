/**
 * EventData.ts - 事件数据
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
  options: EventOption[];
}

export const EVENTS: GameEvent[] = [
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
        text: '投入金币 (-10 金币, +5 最大 HP)',
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
        text: '帮助 (+20 金币)',
        effect: (state) => { state.gold += 20; },
        result: '旅人感激地给了你一些金币作为答谢。',
      },
      {
        text: '给予食物 (-10 HP, +30 金币)',
        condition: (state) => state.hp > 20,
        effect: (state) => { state.hp -= 10; state.gold += 30; },
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
        text: '献祭 HP (-10 HP, +20 护甲)',
        condition: (state) => state.hp > 15,
        effect: (state) => { state.hp -= 10; },
        result: '你感到一阵虚弱，但身上笼罩了一层护盾。',
      },
      {
        text: '祈祷 (+5 最大 HP)',
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
        text: '强行打开 (+30 金币, -5 HP)',
        effect: (state) => { state.gold += 30; state.hp -= 5; },
        result: '你用力撬开了宝箱，但被碎片划伤。',
      },
      {
        text: '小心打开 (+20 金币)',
        effect: (state) => { state.gold += 20; },
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
        text: '购买生命药水 (-30 金币, +30 HP)',
        condition: (state) => state.gold >= 30,
        effect: (state) => { state.gold -= 30; state.hp = Math.min(state.maxHp, state.hp + 30); },
        result: '你喝下药水，感觉好多了。',
      },
      {
        text: '购买力量符文 (-50 金币, +1 力量)',
        condition: (state) => state.gold >= 50,
        effect: (state) => { state.gold -= 50; },
        result: '你获得了力量符文，感到力量在增长。',
      },
      {
        text: '离开',
        effect: () => {},
        result: '商人消失了。',
      },
    ],
  },
];

/**
 * 随机获取一个事件
 */
export function getRandomEvent(): GameEvent {
  return EVENTS[Math.floor(Math.random() * EVENTS.length)];
}
