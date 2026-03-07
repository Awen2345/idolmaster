import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

async function setupDatabase() {
  const db = await open({
    filename: path.join(__dirname, "database.sqlite"),
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
      staminaDrinks INTEGER DEFAULT 10
    );

    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY,
      name TEXT,
      img TEXT,
      atk INTEGER,
      def INTEGER,
      cost INTEGER,
      rarity TEXT
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

  // Seed initial cards if empty
  const cardCount = await db.get("SELECT COUNT(*) as count FROM cards");
  if (cardCount.count === 0) {
    const ALL_CARDS = [
      { id: 1, name: "SHIBUYA RIN", img: "https://picsum.photos/seed/rin_ssr/400/600", atk: 18000, def: 15000, cost: 24, rarity: 'SSR' },
      { id: 2, name: "SHIMAMURA UZUKI", img: "https://picsum.photos/seed/uzuki_ssr/400/600", atk: 17500, def: 16000, cost: 24, rarity: 'SSR' },
      { id: 3, name: "HONDA MIO", img: "https://picsum.photos/seed/mio_ssr/400/600", atk: 19000, def: 14000, cost: 24, rarity: 'SSR' },
      { id: 10, name: "RIN SHIBUYA", img: "https://picsum.photos/seed/rin1/400/600", atk: 13000, def: 10500, cost: 18, rarity: 'SR' },
      { id: 11, name: "UZUKI SHIMAMURA", img: "https://picsum.photos/seed/uzuki1/400/600", atk: 12000, def: 11500, cost: 17, rarity: 'SR' },
      { id: 12, name: "MIO HONDA", img: "https://picsum.photos/seed/mio1/400/600", atk: 14000, def: 9500, cost: 19, rarity: 'SR' },
      { id: 13, name: "KAEDE TAKAGAKI", img: "https://picsum.photos/seed/kaede1/400/600", atk: 15000, def: 12000, cost: 21, rarity: 'SR' },
      { id: 14, name: "MIKA JOUGASAKI", img: "https://picsum.photos/seed/mika1/400/600", atk: 13500, def: 10000, cost: 18, rarity: 'SR' },
      { id: 15, name: "RIKA JOUGASAKI", img: "https://picsum.photos/seed/rika1/400/600", atk: 11000, def: 9000, cost: 15, rarity: 'SR' },
      { id: 20, name: "NORMAL IDOL A", img: "https://picsum.photos/seed/normal1/400/600", atk: 5000, def: 4000, cost: 10, rarity: 'R' },
      { id: 21, name: "NORMAL IDOL B", img: "https://picsum.photos/seed/normal2/400/600", atk: 4500, def: 4500, cost: 10, rarity: 'R' },
      { id: 22, name: "NORMAL IDOL C", img: "https://picsum.photos/seed/normal3/400/600", atk: 5500, def: 3500, cost: 10, rarity: 'R' },
    ];
    for (const card of ALL_CARDS) {
      await db.run("INSERT INTO cards (id, name, img, atk, def, cost, rarity) VALUES (?, ?, ?, ?, ?, ?, ?)", [card.id, card.name, card.img, card.atk, card.def, card.cost, card.rarity]);
    }
  }

  return db;
}

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const db = await setupDatabase();

  // API Routes
  app.get("/api/config", (req, res) => {
    const configPath = path.join(__dirname, "config.json");
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      res.json(config);
    } else {
      res.status(500).json({ error: "Config not found" });
    }
  });

  app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    let user = await db.get("SELECT * FROM users WHERE username = ?", [username]);
    
    if (!user) {
      // Auto-register for demo purposes
      const result = await db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password]);
      user = await db.get("SELECT * FROM users WHERE id = ?", [result.lastID]);
      
      // Give initial cards
      const initialCards = [10, 11, 12, 13, 14];
      for (let i = 0; i < initialCards.length; i++) {
        const invResult = await db.run("INSERT INTO user_inventory (user_id, card_id) VALUES (?, ?)", [user.id, initialCards[i]]);
        await db.run("INSERT INTO user_formation (user_id, slot_index, inventory_id) VALUES (?, ?, ?)", [user.id, i, invResult.lastID]);
      }

      // Give initial inbox rewards
      await db.run("INSERT INTO inbox (user_id, title, description, date, claimed) VALUES (?, ?, ?, ?, ?)", [user.id, "Welcome Bonus", "Received 5000 Star Jewels!", new Date().toISOString().split('T')[0], 0]);
    }

    res.json({ success: true, userId: user.id });
  });

  app.get("/api/user/:id", async (req, res) => {
    const userId = req.params.id;
    const user = await db.get("SELECT * FROM users WHERE id = ?", [userId]);
    if (!user) return res.status(404).json({ error: "User not found" });

    const inventoryRows = await db.all(`
      SELECT ui.id as inventory_id, c.* 
      FROM user_inventory ui 
      JOIN cards c ON ui.card_id = c.id 
      WHERE ui.user_id = ?
    `, [userId]);

    const formationRows = await db.all(`
      SELECT uf.slot_index, ui.id as inventory_id, c.* 
      FROM user_formation uf 
      JOIN user_inventory ui ON uf.inventory_id = ui.id 
      JOIN cards c ON ui.card_id = c.id 
      WHERE uf.user_id = ?
    `, [userId]);

    const formation = [null, null, null, null, null];
    for (const row of formationRows) {
      formation[row.slot_index] = { ...row, id: row.inventory_id, card_id: row.id };
    }

    res.json({
      starJewels: user.starJewels,
      coins: user.coins,
      stamina: user.stamina,
      maxStamina: user.maxStamina,
      staminaDrinks: user.staminaDrinks,
      inventory: inventoryRows.map(r => ({ ...r, id: r.inventory_id, card_id: r.id })),
      formation
    });
  });

  app.post("/api/formation/:id", async (req, res) => {
    const userId = req.params.id;
    const { formation } = req.body; // Array of inventory_ids or null

    await db.run("DELETE FROM user_formation WHERE user_id = ?", [userId]);
    
    for (let i = 0; i < formation.length; i++) {
      if (formation[i] !== null) {
        await db.run("INSERT INTO user_formation (user_id, slot_index, inventory_id) VALUES (?, ?, ?)", [userId, i, formation[i]]);
      }
    }
    
    res.json({ success: true });
  });

  app.post("/api/gacha/:id", async (req, res) => {
    const userId = req.params.id;
    const { count } = req.body;
    const cost = count * 250;

    const user = await db.get("SELECT starJewels FROM users WHERE id = ?", [userId]);
    if (user.starJewels < cost) {
      return res.status(400).json({ error: "Not enough Star Jewels" });
    }

    await db.run("UPDATE users SET starJewels = starJewels - ? WHERE id = ?", [cost, userId]);

    const allCards = await db.all("SELECT * FROM cards");
    const newCards = [];

    for (let i = 0; i < count; i++) {
      const rand = Math.random() * 100;
      let rarity = 'R';
      
      if (count === 10 && i === 9) {
        const hasHighRarity = newCards.some(c => c.rarity === 'SR' || c.rarity === 'SSR');
        if (!hasHighRarity) {
          rarity = Math.random() * 100 < 3 ? 'SSR' : 'SR';
        } else {
          if (rand < 3) rarity = 'SSR';
          else if (rand < 15) rarity = 'SR';
        }
      } else {
        if (rand < 3) rarity = 'SSR';
        else if (rand < 15) rarity = 'SR';
      }

      const possibleCards = allCards.filter(c => c.rarity === rarity);
      const selectedCard = possibleCards[Math.floor(Math.random() * possibleCards.length)];
      
      const result = await db.run("INSERT INTO user_inventory (user_id, card_id) VALUES (?, ?)", [userId, selectedCard.id]);
      newCards.push({ ...selectedCard, inventory_id: result.lastID });
    }

    res.json({ success: true, newCards });
  });

  app.get("/api/inbox/:id", async (req, res) => {
    const userId = req.params.id;
    const inbox = await db.all("SELECT * FROM inbox WHERE user_id = ? ORDER BY id DESC", [userId]);
    res.json(inbox);
  });

  app.post("/api/inbox/claim/:id", async (req, res) => {
    const userId = req.params.id;
    const { rewardIds } = req.body; // Array of inbox IDs

    for (const id of rewardIds) {
      await db.run("UPDATE inbox SET claimed = 1 WHERE id = ? AND user_id = ?", [id, userId]);
    }
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
