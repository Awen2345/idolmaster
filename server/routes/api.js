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

router.get("/cards", async (req, res) => {
  const db = await setupDatabase();
  const { rarity, attribute } = req.query;
  
  let query = "SELECT * FROM cards";
  const params = [];
  
  if (rarity || attribute) {
    query += " WHERE";
    if (rarity) {
      query += " rarity = ?";
      params.push(rarity);
    }
    if (attribute) {
      if (rarity) query += " AND";
      query += " attribute = ?"; // Assuming we add attribute to schema later, but for now let's skip attribute as it's not in schema yet
    }
  }
  
  const cards = await db.all(query, params);
  res.json(cards);
});

router.post("/admin/fetch-cards", async (req, res) => {
  const db = await setupDatabase();
  try {
    console.log('Fetching card list...');
    const listRes = await fetch('https://starlight.kirara.ca/api/v1/list/card_t?limit=200');
    const listData = await listRes.json();
    const ids = listData.result.map(c => c.id);
    
    console.log(`Found ${ids.length} cards. Fetching details...`);
    
    const CHUNK_SIZE = 50;
    let count = 0;
    
    for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
      const chunk = ids.slice(i, i + CHUNK_SIZE);
      const url = `https://starlight.kirara.ca/api/v1/card_t/${chunk.join(',')}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      for (const card of data.result) {
        const rarityMap = {
          1: 'N', 2: 'N',
          3: 'R', 4: 'R',
          5: 'SR', 6: 'SR',
          7: 'SSR', 8: 'SSR'
        };
        
        const rarityVal = card.rarity ? card.rarity.rarity : 1;
        const rarity = rarityMap[rarityVal] || 'N';
        
        const costMap = { 'N': 5, 'R': 10, 'SR': 15, 'SSR': 20 };
        const cost = costMap[rarity] || 5;
        
        const atk = (card.vocal_max || 0) + (card.dance_max || 0);
        const def = (card.visual_max || 0);
        
        const name = card.title ? `[${card.title}] ${card.name_only || card.name}` : (card.name_only || card.name);
        const img = `https://hidamarirhodonite.kirara.ca/card/${card.id}.png`;
        
        const attribute = card.attribute ? card.attribute.charAt(0).toUpperCase() + card.attribute.slice(1) : 'Cute';

        await db.run(`
          INSERT OR REPLACE INTO cards (id, name, img, atk, def, cost, rarity, attribute)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [card.id, name, img, atk, def, cost, rarity, attribute]);
        count++;
      }
    }
    
    res.json({ success: true, message: `Imported ${count} cards` });
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
