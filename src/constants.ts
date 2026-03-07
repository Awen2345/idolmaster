import { Card } from './types';

export const ALL_CARDS: Card[] = [
  { id: 1, name: "SHIBUYA RIN", img: "https://picsum.photos/seed/rin_ssr/400/600", atk: 18000, def: 15000, cost: 24, rarity: 'SSR', passiveSkill: { type: 'exp_boost', value: 20, description: 'Increases EXP gained from work by 20%' } },
  { id: 2, name: "SHIMAMURA UZUKI", img: "https://picsum.photos/seed/uzuki_ssr/400/600", atk: 17500, def: 16000, cost: 24, rarity: 'SSR', passiveSkill: { type: 'fan_boost', value: 25, description: 'Increases Fans gained from work by 25%' } },
  { id: 3, name: "HONDA MIO", img: "https://picsum.photos/seed/mio_ssr/400/600", atk: 19000, def: 14000, cost: 24, rarity: 'SSR', passiveSkill: { type: 'money_boost', value: 30, description: 'Increases Money gained from work by 30%' } },
  { id: 10, name: "RIN SHIBUYA", img: "https://picsum.photos/seed/rin1/400/600", atk: 13000, def: 10500, cost: 18, rarity: 'SR', passiveSkill: { type: 'stamina_reduction', value: 10, description: 'Reduces stamina cost of work by 10%' } },
  { id: 11, name: "UZUKI SHIMAMURA", img: "https://picsum.photos/seed/uzuki1/400/600", atk: 12000, def: 11500, cost: 17, rarity: 'SR', passiveSkill: { type: 'fan_boost', value: 15, description: 'Increases Fans gained from work by 15%' } },
  { id: 12, name: "MIO HONDA", img: "https://picsum.photos/seed/mio1/400/600", atk: 14000, def: 9500, cost: 19, rarity: 'SR', passiveSkill: { type: 'money_boost', value: 15, description: 'Increases Money gained from work by 15%' } },
  { id: 13, name: "KAEDE TAKAGAKI", img: "https://picsum.photos/seed/kaede1/400/600", atk: 15000, def: 12000, cost: 21, rarity: 'SR', passiveSkill: { type: 'exp_boost', value: 15, description: 'Increases EXP gained from work by 15%' } },
  { id: 14, name: "MIKA JOUGASAKI", img: "https://picsum.photos/seed/mika1/400/600", atk: 13500, def: 10000, cost: 18, rarity: 'SR', passiveSkill: { type: 'stamina_reduction', value: 15, description: 'Reduces stamina cost of work by 15%' } },
  { id: 15, name: "RIKA JOUGASAKI", img: "https://picsum.photos/seed/rika1/400/600", atk: 11000, def: 9000, cost: 15, rarity: 'SR', passiveSkill: { type: 'money_boost', value: 10, description: 'Increases Money gained from work by 10%' } },
  { id: 20, name: "NORMAL IDOL A", img: "https://picsum.photos/seed/normal1/400/600", atk: 5000, def: 4000, cost: 10, rarity: 'R' },
  { id: 21, name: "NORMAL IDOL B", img: "https://picsum.photos/seed/normal2/400/600", atk: 4500, def: 4500, cost: 10, rarity: 'R' },
  { id: 22, name: "NORMAL IDOL C", img: "https://picsum.photos/seed/normal3/400/600", atk: 5500, def: 3500, cost: 10, rarity: 'R' },
];
