export type Rarity = 'N' | 'R' | 'SR' | 'SSR';

export type PassiveSkillType = 'exp_boost' | 'money_boost' | 'fan_boost' | 'stamina_reduction';

export type PassiveSkill = {
  type: PassiveSkillType;
  value: number;
  description: string;
};

export type LiveSkillType = 'atk_boost' | 'def_boost' | 'atk_def_boost';

export type LiveSkill = {
  type: LiveSkillType;
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
  liveSkill?: LiveSkill;
};

export type UserState = {
  starJewels: number;
  coins: number;
  stamina: number;
  maxStamina: number;
  staminaDrinks: number;
  gachaTickets?: number;
  upgradeItems?: number;
  expCards?: number;
  inventory: Card[];
  workIdol?: { id: number; name: string; icon_url: string; sprite_url: string } | null;
};
