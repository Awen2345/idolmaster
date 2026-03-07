export type Rarity = 'N' | 'R' | 'SR' | 'SSR';

export type PassiveSkillType = 'exp_boost' | 'money_boost' | 'fan_boost' | 'stamina_reduction';

export type PassiveSkill = {
  type: PassiveSkillType;
  value: number;
  description: string;
};

export type Card = {
  id: number;
  name: string;
  img: string;
  atk: number;
  def: number;
  cost: number;
  rarity: Rarity;
  attribute?: string;
  passiveSkill?: PassiveSkill;
};

export type UserState = {
  starJewels: number;
  coins: number;
  stamina: number;
  maxStamina: number;
  staminaDrinks: number;
  inventory: Card[];
};
