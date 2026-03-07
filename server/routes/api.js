import express from "express";
import fs from "fs";
import path from "path";
import { setupDatabase } from "../db.js";

const router = express.Router();

router.get("/config", (req, res) => {
  const configPath = path.join(process.cwd(), "config.json");
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    res.json(config);
  } else {
    res.status(500).json({ error: "Config not found" });
  }
});

router.post("/login", async (req, res) => {
  const db = await setupDatabase();
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

router.get("/user/:id", async (req, res) => {
  const db = await setupDatabase();
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

router.post("/formation/:id", async (req, res) => {
  const db = await setupDatabase();
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

router.post("/gacha/:id", async (req, res) => {
  const db = await setupDatabase();
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

router.get("/inbox/:id", async (req, res) => {
  const db = await setupDatabase();
  const userId = req.params.id;
  const inbox = await db.all("SELECT * FROM inbox WHERE user_id = ? ORDER BY id DESC", [userId]);
  res.json(inbox);
});

router.post("/inbox/claim/:id", async (req, res) => {
  const db = await setupDatabase();
  const userId = req.params.id;
  const { rewardIds } = req.body; // Array of inbox IDs

  for (const id of rewardIds) {
    await db.run("UPDATE inbox SET claimed = 1 WHERE id = ? AND user_id = ?", [id, userId]);
  }
  res.json({ success: true });
});

export default router;
