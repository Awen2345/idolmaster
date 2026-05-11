import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import fs from "fs";

let dbInstance = null;

export async function setupDatabase() {
  if (dbInstance) return dbInstance;

  const db = await open({
    filename: path.join(process.cwd(), "database.sqlite"),
    driver: sqlite3.Database
  });

  // Create tables (Simulating MySQL structure)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      starJewels INTEGER DEFAULT 5000,
      coins INTEGER DEFAULT 150000,
      stamina INTEGER DEFAULT 50,
      maxStamina INTEGER DEFAULT 50,
      staminaDrinks INTEGER DEFAULT 10,
      gachaTickets INTEGER DEFAULT 5,
      upgradeItems INTEGER DEFAULT 0,
      expCards INTEGER DEFAULT 0,
      lastStaminaUpdate TEXT,
      exp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      fans INTEGER DEFAULT 0,
      banned_until TEXT,
      ban_reason TEXT
    );

    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY,
      name TEXT,
      img TEXT,
      icon_url TEXT,
      spread_url TEXT,
      atk INTEGER,
      def INTEGER,
      cost INTEGER,
      rarity TEXT,
      attribute TEXT,
      passiveSkill TEXT,
      liveSkill TEXT
    );

    CREATE TABLE IF NOT EXISTS user_inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      card_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(card_id) REFERENCES cards(id)
    );

    CREATE TABLE IF NOT EXISTS user_formation (
      user_id INTEGER,
      slot_index INTEGER,
      inventory_id INTEGER,
      PRIMARY KEY(user_id, slot_index),
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(inventory_id) REFERENCES user_inventory(id)
    );

    CREATE TABLE IF NOT EXISTS inbox (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT,
      description TEXT,
      date TEXT,
      claimed BOOLEAN DEFAULT 0,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS user_promocode_usage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      code TEXT,
      used_at TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      name TEXT,
      type TEXT,
      start_date TEXT,
      end_date TEXT,
      rewards TEXT,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS user_events (
      user_id INTEGER,
      event_id TEXT,
      progress INTEGER DEFAULT 0,
      points INTEGER DEFAULT 0,
      PRIMARY KEY(user_id, event_id),
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(event_id) REFERENCES events(id)
    );

    CREATE TABLE IF NOT EXISTS missions (
      id TEXT PRIMARY KEY,
      type TEXT,
      action TEXT,
      description TEXT,
      target_value INTEGER,
      reward_type TEXT,
      reward_amount INTEGER
    );

    CREATE TABLE IF NOT EXISTS user_missions (
      user_id INTEGER,
      mission_id TEXT,
      progress INTEGER DEFAULT 0,
      completed BOOLEAN DEFAULT 0,
      claimed BOOLEAN DEFAULT 0,
      updated_at TEXT,
      PRIMARY KEY(user_id, mission_id),
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(mission_id) REFERENCES missions(id)
    );

    CREATE TABLE IF NOT EXISTS user_logins (
      user_id INTEGER PRIMARY KEY,
      last_login_date TEXT,
      consecutive_days INTEGER DEFAULT 0,
      total_days INTEGER DEFAULT 0,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS commus (
      id TEXT PRIMARY KEY,
      title TEXT,
      type TEXT,
      unlock_condition TEXT,
      reward_type TEXT,
      reward_amount INTEGER,
      script TEXT
    );

    CREATE TABLE IF NOT EXISTS user_commus (
      user_id INTEGER,
      commu_id TEXT,
      is_read BOOLEAN DEFAULT 0,
      PRIMARY KEY(user_id, commu_id),
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(commu_id) REFERENCES commus(id)
    );
  `);

  // Add attribute column if it doesn't exist (for migration)
  try {
    await db.exec("ALTER TABLE cards ADD COLUMN attribute TEXT");
  } catch (e) {
    // Column likely already exists
  }

  try {
    await db.exec("ALTER TABLE cards ADD COLUMN passiveSkill TEXT");
  } catch (e) {}

  try {
    await db.exec("ALTER TABLE cards ADD COLUMN liveSkill TEXT");
  } catch (e) {}

  try {
    const tableInfo = await db.all("PRAGMA table_info(cards)");
    if (!tableInfo.some(c => c.name === 'icon_url')) {
      await db.exec("ALTER TABLE cards ADD COLUMN icon_url TEXT");
      await db.exec("ALTER TABLE cards ADD COLUMN spread_url TEXT");
      
      const ALL_CARDS = [
        { id: 1, cgss_id: 200045 },
        { id: 2, cgss_id: 100063 },
        { id: 3, cgss_id: 300043 },
        { id: 10, cgss_id: 200001 },
        { id: 11, cgss_id: 100001 },
        { id: 12, cgss_id: 300001 },
        { id: 13, cgss_id: 200003 },
        { id: 14, cgss_id: 300003 },
        { id: 15, cgss_id: 300005 },
        { id: 20, cgss_id: 100003 },
        { id: 21, cgss_id: 200005 },
        { id: 22, cgss_id: 300007 }
      ];
      for (const card of ALL_CARDS) {
        const icon_url = `https://hidamarirhodonite.kirara.ca/icon_card/${card.cgss_id}.png`;
        const spread_url = `https://hidamarirhodonite.kirara.ca/spread/${card.cgss_id}.png`;
        await db.run("UPDATE cards SET icon_url = ?, spread_url = ? WHERE id = ?", [icon_url, spread_url, card.id]);
      }
    }
  } catch (e) {}

  try {
    await db.exec("ALTER TABLE users ADD COLUMN exp INTEGER DEFAULT 0");
    await db.exec("ALTER TABLE users ADD COLUMN level INTEGER DEFAULT 1");
    await db.exec("ALTER TABLE users ADD COLUMN fans INTEGER DEFAULT 0");
  } catch (e) {}

  // Add ban columns if they don't exist
  try {
    await db.exec("ALTER TABLE users ADD COLUMN banned_until TEXT");
    await db.exec("ALTER TABLE users ADD COLUMN ban_reason TEXT");
  } catch (e) {
    // Columns likely already exist
  }

  // Add new item columns
  try {
    await db.exec("ALTER TABLE users ADD COLUMN gachaTickets INTEGER DEFAULT 5");
    await db.exec("ALTER TABLE users ADD COLUMN upgradeItems INTEGER DEFAULT 0");
    await db.exec("ALTER TABLE users ADD COLUMN expCards INTEGER DEFAULT 0");
    await db.exec("ALTER TABLE users ADD COLUMN lastStaminaUpdate TEXT");
  } catch (e) {
    // Columns likely already exist
  }

  // Add work_idol_id
  try {
    await db.exec("ALTER TABLE users ADD COLUMN work_idol_id INTEGER DEFAULT 1");
  } catch (e) {}

  // Seed initial cards if empty
  const cardCount = await db.get("SELECT COUNT(*) as count FROM cards");
  if (cardCount.count === 0) {
    const ALL_CARDS = [
      { id: 1, name: "SHIBUYA RIN", cgss_id: 200045, img: "https://picsum.photos/seed/rin_ssr/400/600", atk: 18000, def: 15000, cost: 24, rarity: 'SSR', attribute: 'Cool', passiveSkill: JSON.stringify({ type: 'exp_boost', value: 20, description: 'Increases EXP gained from work by 20%' }), liveSkill: JSON.stringify({ type: 'atk_boost', value: 30, description: 'Boosts Cool ATK by 30%' }) },
      { id: 2, name: "SHIMAMURA UZUKI", cgss_id: 100063, img: "https://picsum.photos/seed/uzuki_ssr/400/600", atk: 17500, def: 16000, cost: 24, rarity: 'SSR', attribute: 'Cute', passiveSkill: JSON.stringify({ type: 'fan_boost', value: 25, description: 'Increases Fans gained from work by 25%' }), liveSkill: JSON.stringify({ type: 'atk_def_boost', value: 20, description: 'Boosts Cute ATK/DEF by 20%' }) },
      { id: 3, name: "HONDA MIO", cgss_id: 300043, img: "https://picsum.photos/seed/mio_ssr/400/600", atk: 19000, def: 14000, cost: 24, rarity: 'SSR', attribute: 'Passion', passiveSkill: JSON.stringify({ type: 'money_boost', value: 30, description: 'Increases Money gained from work by 30%' }), liveSkill: JSON.stringify({ type: 'def_boost', value: 30, description: 'Boosts Passion DEF by 30%' }) },
      { id: 10, name: "RIN SHIBUYA", cgss_id: 200001, img: "https://picsum.photos/seed/rin1/400/600", atk: 13000, def: 10500, cost: 18, rarity: 'SR', attribute: 'Cool', passiveSkill: JSON.stringify({ type: 'stamina_reduction', value: 10, description: 'Reduces stamina cost of work by 10%' }), liveSkill: JSON.stringify({ type: 'atk_boost', value: 15, description: 'Boosts Cool ATK by 15%' }) },
      { id: 11, name: "UZUKI SHIMAMURA", cgss_id: 100001, img: "https://picsum.photos/seed/uzuki1/400/600", atk: 12000, def: 11500, cost: 17, rarity: 'SR', attribute: 'Cute', passiveSkill: JSON.stringify({ type: 'fan_boost', value: 15, description: 'Increases Fans gained from work by 15%' }), liveSkill: JSON.stringify({ type: 'atk_def_boost', value: 10, description: 'Boosts Cute ATK/DEF by 10%' }) },
      { id: 12, name: "MIO HONDA", cgss_id: 300001, img: "https://picsum.photos/seed/mio1/400/600", atk: 14000, def: 9500, cost: 19, rarity: 'SR', attribute: 'Passion', passiveSkill: JSON.stringify({ type: 'money_boost', value: 15, description: 'Increases Money gained from work by 15%' }), liveSkill: JSON.stringify({ type: 'def_boost', value: 15, description: 'Boosts Passion DEF by 15%' }) },
      { id: 13, name: "KAEDE TAKAGAKI", cgss_id: 200003, img: "https://picsum.photos/seed/kaede1/400/600", atk: 15000, def: 12000, cost: 21, rarity: 'SR', attribute: 'Cool', passiveSkill: JSON.stringify({ type: 'exp_boost', value: 15, description: 'Increases EXP gained from work by 15%' }), liveSkill: JSON.stringify({ type: 'atk_boost', value: 15, description: 'Boosts Cool ATK by 15%' }) },
      { id: 14, name: "MIKA JOUGASAKI", cgss_id: 300003, img: "https://picsum.photos/seed/mika1/400/600", atk: 13500, def: 10000, cost: 18, rarity: 'SR', attribute: 'Passion', passiveSkill: JSON.stringify({ type: 'stamina_reduction', value: 15, description: 'Reduces stamina cost of work by 15%' }), liveSkill: JSON.stringify({ type: 'def_boost', value: 15, description: 'Boosts Passion DEF by 15%' }) },
      { id: 15, name: "RIKA JOUGASAKI", cgss_id: 300005, img: "https://picsum.photos/seed/rika1/400/600", atk: 11000, def: 9000, cost: 15, rarity: 'SR', attribute: 'Passion', passiveSkill: JSON.stringify({ type: 'money_boost', value: 10, description: 'Increases Money gained from work by 10%' }), liveSkill: JSON.stringify({ type: 'atk_boost', value: 10, description: 'Boosts Passion ATK by 10%' }) },
      { id: 20, name: "NORMAL IDOL A", cgss_id: 100003, img: "https://picsum.photos/seed/normal1/400/600", atk: 5000, def: 4000, cost: 10, rarity: 'R', attribute: 'Cute', passiveSkill: null, liveSkill: null },
      { id: 21, name: "NORMAL IDOL B", cgss_id: 200005, img: "https://picsum.photos/seed/normal2/400/600", atk: 4500, def: 4500, cost: 10, rarity: 'R', attribute: 'Cool', passiveSkill: null, liveSkill: null },
      { id: 22, name: "NORMAL IDOL C", cgss_id: 300007, img: "https://picsum.photos/seed/normal3/400/600", atk: 5500, def: 3500, cost: 10, rarity: 'R', attribute: 'Passion', passiveSkill: null, liveSkill: null },
    ];
    for (const card of ALL_CARDS) {
      const icon_url = `https://hidamarirhodonite.kirara.ca/icon_card/${card.cgss_id}.png`;
      const spread_url = `https://hidamarirhodonite.kirara.ca/spread/${card.cgss_id}.png`;
      await db.run("INSERT INTO cards (id, name, img, icon_url, spread_url, atk, def, cost, rarity, attribute, passiveSkill, liveSkill) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [card.id, card.name, card.img, icon_url, spread_url, card.atk, card.def, card.cost, card.rarity, card.attribute, card.passiveSkill, card.liveSkill]);
    }
  }

  const eventCount = await db.get("SELECT COUNT(*) as count FROM events");
  if (eventCount.count === 0) {
    await db.run(`
      INSERT INTO events (id, name, type, start_date, end_date, rewards, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      "event001",
      "Production Match Festival",
      "tour",
      "2026-03-01T00:00:00Z",
      "2026-03-14T23:59:59Z",
      JSON.stringify({ sr_idol: "Uzuki", coins: 5000, card_id: 101 }),
      "Tour the area, battle rivals, and defeat the boss to earn rewards!"
    ]);
  }

  const missionCount = await db.get("SELECT COUNT(*) as count FROM missions");
  if (missionCount.count === 0) {
    const initialMissions = [
      { id: 'daily_work_1', type: 'daily', action: 'do_work', description: 'Do Work 3 times', target_value: 3, reward_type: 'coins', reward_amount: 1000 },
      { id: 'daily_live_1', type: 'daily', action: 'play_live', description: 'Play a Live 1 time', target_value: 1, reward_type: 'jewels', reward_amount: 50 },
      { id: 'weekly_work_1', type: 'weekly', action: 'do_work', description: 'Do Work 20 times', target_value: 20, reward_type: 'jewels', reward_amount: 250 },
      { id: 'normal_level_10', type: 'normal', action: 'reach_level', description: 'Reach Producer Level 10', target_value: 10, reward_type: 'jewels', reward_amount: 500 }
    ];
    for (const m of initialMissions) {
      await db.run(`INSERT INTO missions (id, type, action, description, target_value, reward_type, reward_amount) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [m.id, m.type, m.action, m.description, m.target_value, m.reward_type, m.reward_amount]);
    }
  }

  const commuCount = await db.get("SELECT COUNT(*) as count FROM commus");
  if (commuCount.count === 0) {
    const initialCommus = [
      {
        id: 'story_1',
        title: 'Prologue: A New Beginning',
        type: 'story',
        unlock_condition: 'none',
        reward_type: 'jewels',
        reward_amount: 50,
        script: JSON.stringify([
          { speaker: 'Producer', text: 'Today is my first day at the production agency...', sprite: null, position: 'center', expression: 'normal' },
          { speaker: 'Uzuki', text: 'Hello! Are you the new producer? I am Shimamura Uzuki! I will do my best!', sprite: 'https://api.dicebear.com/7.x/notionists/svg?seed=Uzuki&backgroundColor=ffdfbf', position: 'center', expression: 'smile' },
          { speaker: 'Producer', text: 'Nice to meet you, Uzuki. Let\'s work hard together.', sprite: null, position: 'center', expression: 'normal' },
          { speaker: 'Uzuki', text: 'Yes! I\'m looking forward to it!', sprite: 'https://api.dicebear.com/7.x/notionists/svg?seed=Uzuki&backgroundColor=ffdfbf', position: 'center', expression: 'happy' }
        ])
      },
      {
        id: 'idol_rin_1',
        title: 'Rin: First Encounter',
        type: 'idol',
        unlock_condition: 'card_1',
        reward_type: 'jewels',
        reward_amount: 25,
        script: JSON.stringify([
          { speaker: 'Rin', text: '...What? You want me to be an idol?', sprite: 'https://api.dicebear.com/7.x/notionists/svg?seed=Rin&backgroundColor=bfe6ff', position: 'center', expression: 'surprised' },
          { speaker: 'Rin', text: 'I don\'t know... I\'m just helping out at my parents\' flower shop.', sprite: 'https://api.dicebear.com/7.x/notionists/svg?seed=Rin&backgroundColor=bfe6ff', position: 'center', expression: 'normal' },
          { speaker: 'Producer', text: 'You have potential. Please, give it a try.', sprite: null, position: 'center', expression: 'normal' },
          { speaker: 'Rin', text: '...Fine. But don\'t expect too much.', sprite: 'https://api.dicebear.com/7.x/notionists/svg?seed=Rin&backgroundColor=bfe6ff', position: 'center', expression: 'blush' }
        ])
      }
    ];
    for (const c of initialCommus) {
      await db.run(`INSERT INTO commus (id, title, type, unlock_condition, reward_type, reward_amount, script) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [c.id, c.title, c.type, c.unlock_condition, c.reward_type, c.reward_amount, c.script]);
    }
  }

  // Remove old idol_icons logic

  // Export cards to JSON for voice lines
  const allCards = await db.all("SELECT id, name FROM cards");
  const voiceData = allCards.map(card => ({
    id: card.id,
    name: card.name,
    voice_lines: [
      { text: `Producer, let's do our best today. I am ${card.name}!`, file: "https://actions.google.com/sounds/v1/water/water_drop.ogg" },
      { text: `I'll show you what I can do.`, file: "https://actions.google.com/sounds/v1/water/water_drop.ogg" }
    ]
  }));
  
  const publicDataDir = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(publicDataDir)) {
    fs.mkdirSync(publicDataDir, { recursive: true });
  }
  fs.writeFileSync(path.join(publicDataDir, 'cards_voice.json'), JSON.stringify(voiceData, null, 2));

  // Create voice lines folder
  const voiceLinesDir = path.join(process.cwd(), 'public', 'voice_lines');
  if (!fs.existsSync(voiceLinesDir)) {
    fs.mkdirSync(voiceLinesDir, { recursive: true });
  }

  dbInstance = db;
  return db;
}
