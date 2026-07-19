export enum Rarity { COMMON = 'COMMON', RARE = 'RARE', EPIC = 'EPIC', LEGENDARY = 'LEGENDARY' }
export enum CardType { ATTACK = 'ATTACK', SKILL = 'SKILL', POWER = 'POWER', CURSE = 'CURSE' }
export enum School { SWORD = 'SWORD', SHIELD = 'SHIELD', SPELL = 'SPELL' }
export enum TargetType { SELF, SINGLE_ENEMY, ALL_ENEMIES, ADJACENT, LINE }

export interface CardEffect {
  type: 'damage' | 'block' | 'draw' | 'gain_ap' | 'aoe' | 'apply_status'
       | 'heal' | 'combo' | 'exhaust' | 'reduce_cost' | 'copy_card';
  base?: number;
  targetCardId?: string;
  statusId?: string;
  amount?: number;
  scaling?: number;
  count?: number;
  basePerCombo?: number;
  maxCombo?: number;
}

export interface CardTemplate {
  id: string;
  name: string;
  cost: number;
  type: CardType;
  school: School;
  rarity: Rarity;
  description: string;
  targetType: TargetType;
  effects: CardEffect[];
  upgradeEffects?: CardEffect[];
  weight: number;
}

export class Card {
  constructor(public template: CardTemplate, public upgraded = false) {}

  get id(): string { return this.template.id; }
  get name(): string { return this.template.name; }
  get cost(): number { return this.template.cost; }
  get type(): CardType { return this.template.type; }
  get effects(): CardEffect[] { return this.upgraded && this.template.upgradeEffects ? this.template.upgradeEffects : this.template.effects; }
  get description(): string { return this.template.description; }

  canPlay(ap: number): boolean {
    return ap >= this.template.cost;
  }
}
