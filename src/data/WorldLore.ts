/**
 * WorldLore.ts - 世界观与角色设定
 */

export const WORLD_LORE = `
在遥远的东方，有一片被称为"墨境"的神秘领域。这里并非人间，也非地狱，而是由古老的墨灵创造的世界——一个由笔墨纸砚构成的维度。

千年前，墨境的守护者"墨龙"陷入了沉睡，墨境开始崩坏。原本平和的墨灵变成了凶猛的墨兽，四处游荡。曾经美丽的墨林变成了阴暗的迷阵，曾经庄严的殿堂被影武者占据，曾经清澈的墨渊变成了深不见底的黑暗。

你是被选中的"棋手"，肩负着重新唤醒墨龙的使命。你必须穿越墨林、击败影武者、深入墨渊，最终面对墨渊守护者——那个导致墨龙沉睡的元凶。

你的武器是"卡牌"，每一张都蕴含着墨境的力量。斩击、防御、法术——这些卡牌将在战斗中助你一臂之力。但记住，墨境的力量是双刃剑，使用不当也会反噬自身。

墨境的未来，就在你的手中。
`;

export interface CharacterProfile {
  id: string;
  name: string;
  role: string;
  description: string;
  motivation: string;
}

export const CHARACTERS: CharacterProfile[] = [
  {
    id: 'protagonist',
    name: '棋手',
    role: '主角',
    description: '被选中的勇者，肩负唤醒墨龙的使命。性格坚毅，智慧过人。',
    motivation: '拯救墨境，唤醒墨龙，恢复世界的和平。',
  },
  {
    id: 'ink_spirit',
    name: '墨灵',
    role: '引导NPC',
    description: '墨境的原住民，形态如流动的墨水。在旅途中给予棋手指引和帮助。',
    motivation: '帮助棋手完成使命，恢复墨境的和平。',
  },
  {
    id: 'shadow_warrior',
    name: '影武者',
    role: '敌对NPC',
    description: '曾经是高贵的墨境守护者，如今被黑暗侵蚀，成为棋手的强敌。',
    motivation: '阻止棋手前进，维护自己扭曲的"秩序"。',
  },
  {
    id: 'merchant',
    name: '行商',
    role: '商店NPC',
    description: '在墨境中旅行的神秘商人，贩卖各种奇珍异宝。无人知晓他的真实身份。',
    motivation: '在墨境的混乱中谋利，同时也帮助棋手。',
  },
  {
    id: 'ink_dragon',
    name: '墨龙王',
    role: '最终BOSS',
    description: '墨境的创造者与守护者，拥有无穷的力量。如今陷入沉睡，等待被唤醒。',
    motivation: '沉睡中等待棋手的到来，测试棋手是否配得上唤醒自己。',
  },
];

export interface SceneLore {
  chapter: number;
  name: string;
  description: string;
  background: string;
}

export const SCENE_LORES: SceneLore[] = [
  {
    chapter: 1,
    name: '墨林迷踪',
    description: '墨境入口处的古老森林，充满了初级墨兽。',
    background: '树木由墨水构成，地面是湿润的宣纸，空气中弥漫着墨香。',
  },
  {
    chapter: 2,
    name: '影武者殿堂',
    description: '曾经的圣殿，如今被影武者占据。',
    background: '宏伟的建筑已显破败，墙壁上残留着古老的壁画，影武者在其中游荡。',
  },
  {
    chapter: 3,
    name: '墨渊深处',
    description: '墨境的最深处，墨龙王沉睡之地。',
    background: '黑暗的深渊，只有微弱的墨光指引方向，强大的墨元素在守护着最后的秘密。',
  },
];

export interface DialogLine {
  speaker: string;
  text: string;
}

export const DIALOGS: Record<string, DialogLine[]> = {
  event_intro: [
    { speaker: '墨灵', text: '欢迎，棋手。你终于来了。' },
    { speaker: '墨灵', text: '墨境正在崩坏，墨龙陷入沉睡。你是唯一能拯救我们的人。' },
    { speaker: '棋手', text: '我该怎么做？' },
    { speaker: '墨灵', text: '穿越这片墨林，击败影武者，深入墨渊，唤醒墨龙。' },
    { speaker: '墨灵', text: '这些卡牌将助你一臂之力。记住，每一张都蕴含着墨境的力量。' },
  ],
  shop_intro: [
    { speaker: '行商', text: '哟，棋手！难得在这里遇见你。' },
    { speaker: '行商', text: '我这儿有些好东西，要不要看看？' },
    { speaker: '棋手', text: '你都卖些什么？' },
    { speaker: '行商', text: '生命药水、力量符文、还有各种稀罕玩意儿。只要你付得起价钱。' },
  ],
  rest_intro: [
    { speaker: '墨灵', text: '你找到了一个安全的休息点。' },
    { speaker: '墨灵', text: '在这里好好恢复吧，接下来的路还很长。' },
    { speaker: '棋手', text: '正好，我需要在继续之前调整状态。' },
  ],
  boss_intro_1: [
    { speaker: '墨灵', text: '小心，前方就是墨龙王的领域。' },
    { speaker: '墨灵', text: '它是墨境的守护者，如今却被黑暗侵蚀。' },
    { speaker: '棋手', text: '我必须唤醒它，即使要战斗。' },
  ],
  boss_intro_2: [
    { speaker: '影武者', text: '你竟敢闯入这里？' },
    { speaker: '影武者', text: '墨龙王不能被唤醒，这是为了墨境的"秩序"。' },
    { speaker: '棋手', text: '你的"秩序"正在毁灭墨境！' },
    { speaker: '影武者', text: '那就让我看看，你有什么资格改变这一切！' },
  ],
  boss_intro_3: [
    { speaker: '墨灵', text: '你终于来了，棋手。' },
    { speaker: '墨灵', text: '墨龙王就在前方，但墨渊守护者不会让你轻易通过。' },
    { speaker: '棋手', text: '我已经准备好了。' },
    { speaker: '墨灵', text: '记住，墨龙王的力量是无穷的。你必须证明自己配得上唤醒它。' },
  ],
  victory: [
    { speaker: '墨龙', text: '你证明了自己，棋手。' },
    { speaker: '墨龙', text: '墨境因你而重生，感谢你。' },
    { speaker: '棋手', text: '这是我的使命。' },
    { speaker: '墨龙', text: '是的，你完成了它。现在，墨境将恢复和平。' },
  ],
};
