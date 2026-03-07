export type Rarity = 'N' | 'R' | 'SR' | 'SSR';

export type Card = {
  id: number;
  name: string;
  img: string;
  atk: number;
  def: number;
  cost: number;
  rarity: Rarity;
  attribute?: string;
};

export type UserState = {
  starJewels: number;
  coins: number;
  stamina: number;
  maxStamina: number;
  staminaDrinks: number;
  inventory: Card[];
};
