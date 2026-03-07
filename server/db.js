import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

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
      banned_until TEXT,
      ban_reason TEXT
    );

    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY,
      name TEXT,
      img TEXT,
      atk INTEGER,
      def INTEGER,
      cost INTEGER,
      rarity TEXT,
      attribute TEXT
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
  `);

  // Add attribute column if it doesn't exist (for migration)
  try {
    await db.exec("ALTER TABLE cards ADD COLUMN attribute TEXT");
  } catch (e) {
    // Column likely already exists
  }

  // Add ban columns if they don't exist
  try {
    await db.exec("ALTER TABLE users ADD COLUMN banned_until TEXT");
    await db.exec("ALTER TABLE users ADD COLUMN ban_reason TEXT");
  } catch (e) {
    // Columns likely already exist
  }

  // Seed initial cards if empty
  const cardCount = await db.get("SELECT COUNT(*) as count FROM cards");
  if (cardCount.count === 0) {
    const ALL_CARDS = [
      { id: 1, name: "SHIBUYA RIN", img: "https://picsum.photos/seed/rin_ssr/400/600", atk: 18000, def: 15000, cost: 24, rarity: 'SSR', attribute: 'Cool' },
      { id: 2, name: "SHIMAMURA UZUKI", img: "https://picsum.photos/seed/uzuki_ssr/400/600", atk: 17500, def: 16000, cost: 24, rarity: 'SSR', attribute: 'Cute' },
      { id: 3, name: "HONDA MIO", img: "https://picsum.photos/seed/mio_ssr/400/600", atk: 19000, def: 14000, cost: 24, rarity: 'SSR', attribute: 'Passion' },
      { id: 10, name: "RIN SHIBUYA", img: "https://picsum.photos/seed/rin1/400/600", atk: 13000, def: 10500, cost: 18, rarity: 'SR', attribute: 'Cool' },
      { id: 11, name: "UZUKI SHIMAMURA", img: "https://picsum.photos/seed/uzuki1/400/600", atk: 12000, def: 11500, cost: 17, rarity: 'SR', attribute: 'Cute' },
      { id: 12, name: "MIO HONDA", img: "https://picsum.photos/seed/mio1/400/600", atk: 14000, def: 9500, cost: 19, rarity: 'SR', attribute: 'Passion' },
      { id: 13, name: "KAEDE TAKAGAKI", img: "https://picsum.photos/seed/kaede1/400/600", atk: 15000, def: 12000, cost: 21, rarity: 'SR', attribute: 'Cool' },
      { id: 14, name: "MIKA JOUGASAKI", img: "https://picsum.photos/seed/mika1/400/600", atk: 13500, def: 10000, cost: 18, rarity: 'SR', attribute: 'Passion' },
      { id: 15, name: "RIKA JOUGASAKI", img: "https://picsum.photos/seed/rika1/400/600", atk: 11000, def: 9000, cost: 15, rarity: 'SR', attribute: 'Passion' },
      { id: 20, name: "NORMAL IDOL A", img: "https://picsum.photos/seed/normal1/400/600", atk: 5000, def: 4000, cost: 10, rarity: 'R', attribute: 'Cute' },
      { id: 21, name: "NORMAL IDOL B", img: "https://picsum.photos/seed/normal2/400/600", atk: 4500, def: 4500, cost: 10, rarity: 'R', attribute: 'Cool' },
      { id: 22, name: "NORMAL IDOL C", img: "https://picsum.photos/seed/normal3/400/600", atk: 5500, def: 3500, cost: 10, rarity: 'R', attribute: 'Passion' },
    ];
    for (const card of ALL_CARDS) {
      await db.run("INSERT INTO cards (id, name, img, atk, def, cost, rarity, attribute) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [card.id, card.name, card.img, card.atk, card.def, card.cost, card.rarity, card.attribute]);
    }
  }

  dbInstance = db;
  return db;
}
