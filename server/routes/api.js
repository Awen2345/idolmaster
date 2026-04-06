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

const BANNED_USERS_FILE = path.join(process.cwd(), "server", "data", "banned_users.json");

function getBannedUsers() {
  if (fs.existsSync(BANNED_USERS_FILE)) {
    return JSON.parse(fs.readFileSync(BANNED_USERS_FILE, "utf-8"));
  }
  return {};
}

function saveBannedUsers(data) {
  fs.writeFileSync(BANNED_USERS_FILE, JSON.stringify(data, null, 2));
}

router.post("/login", async (req, res) => {
  const db = await setupDatabase();
  const { username, password } = req.body;
  let user = await db.get("SELECT * FROM users WHERE username = ?", [username]);
  
  if (user) {
    // Check if banned via JSON config
    const bannedUsers = getBannedUsers();
    const banInfo = bannedUsers[user.id];
    
    if (banInfo) {
      const banEnd = new Date(banInfo.bannedUntil);
      if (banEnd > new Date()) {
        return res.json({ 
          success: false, 
          error: `Account banned until ${banEnd.toLocaleString()}. Reason: ${banInfo.reason || 'No reason provided'}` 
        });
      } else {
        // Ban expired, remove from JSON
        delete bannedUsers[user.id];
        saveBannedUsers(bannedUsers);
      }
    }
  }

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

router.post("/admin/ban", async (req, res) => {
  const { userId, durationMinutes, reason } = req.body;
  
  if (!userId || !durationMinutes) {
    return res.status(400).json({ error: "Missing userId or duration" });
  }

  const banEnd = new Date(Date.now() + durationMinutes * 60000).toISOString();
  
  const bannedUsers = getBannedUsers();
  bannedUsers[userId] = {
    bannedUntil: banEnd,
    reason: reason
  };
  saveBannedUsers(bannedUsers);
  
  res.json({ success: true, bannedUntil: banEnd });
});

router.post("/admin/unban", async (req, res) => {
  const { userId } = req.body;
  
  if (!userId) return res.status(400).json({ error: "Missing userId" });
  
  const bannedUsers = getBannedUsers();
  if (bannedUsers[userId]) {
    delete bannedUsers[userId];
    saveBannedUsers(bannedUsers);
  }
  
  res.json({ success: true });
});

router.get("/admin/users", async (req, res) => {
  const db = await setupDatabase();
  const users = await db.all("SELECT id, username FROM users");
  const bannedUsers = getBannedUsers();
  
  const usersWithStatus = users.map(u => {
    const banInfo = bannedUsers[u.id];
    return {
      ...u,
      banned_until: banInfo ? banInfo.bannedUntil : null,
      ban_reason: banInfo ? banInfo.reason : null
    };
  });
  
  res.json(usersWithStatus);
});

router.get("/user/:id", async (req, res) => {
  const db = await setupDatabase();
  const userId = req.params.id;
  const user = await db.get("SELECT * FROM users WHERE id = ?", [userId]);
  if (!user) return res.status(404).json({ error: "User not found" });

  // Stamina Regeneration Logic
  let currentStamina = user.stamina;
  let lastUpdate = user.lastStaminaUpdate ? new Date(user.lastStaminaUpdate) : new Date();
  const now = new Date();
  
  if (currentStamina < user.maxStamina) {
    const diffMs = now.getTime() - lastUpdate.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const staminaToRegen = Math.floor(diffMinutes / 5); // 1 stamina per 5 minutes
    
    if (staminaToRegen > 0) {
      currentStamina = Math.min(user.maxStamina, currentStamina + staminaToRegen);
      // Update lastUpdate to account for the remainder
      const remainderMs = diffMs % (5 * 60000);
      lastUpdate = new Date(now.getTime() - remainderMs);
      
      await db.run("UPDATE users SET stamina = ?, lastStaminaUpdate = ? WHERE id = ?", [currentStamina, lastUpdate.toISOString(), userId]);
    }
  } else {
    // If stamina is full or overfilled, just update the timestamp
    await db.run("UPDATE users SET lastStaminaUpdate = ? WHERE id = ?", [now.toISOString(), userId]);
    lastUpdate = now;
  }

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

  const parseSkills = (row) => {
    try { if (row.passiveSkill) row.passiveSkill = JSON.parse(row.passiveSkill); } catch (e) {}
    try { if (row.liveSkill) row.liveSkill = JSON.parse(row.liveSkill); } catch (e) {}
    return row;
  };

  const formation = [null, null, null, null, null];
  for (const row of formationRows) {
    formation[row.slot_index] = parseSkills({ ...row, id: row.inventory_id, card_id: row.id });
  }

  res.json({
    starJewels: user.starJewels,
    coins: user.coins,
    stamina: currentStamina,
    maxStamina: user.maxStamina,
    staminaDrinks: user.staminaDrinks,
    gachaTickets: user.gachaTickets || 0,
    upgradeItems: user.upgradeItems || 0,
    expCards: user.expCards || 0,
    lastStaminaUpdate: lastUpdate.toISOString(),
    exp: user.exp,
    level: user.level,
    fans: user.fans,
    inventory: inventoryRows.map(r => parseSkills({ ...r, id: r.inventory_id, card_id: r.id })),
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

router.get("/gacha/config", (req, res) => {
  const configPath = path.join(process.cwd(), "server", "data", "gacha.json");
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    res.json(config);
  } else {
    res.status(500).json({ error: "Gacha config not found" });
  }
});

router.get("/cards/available", async (req, res) => {
  const db = await setupDatabase();
  // Return all cards for the details page
  // In a real app, this might be filtered by the active banner's pool
  const cards = await db.all("SELECT * FROM cards ORDER BY rarity DESC, id DESC");
  
  const parseSkills = (row) => {
    try { if (row.passiveSkill) row.passiveSkill = JSON.parse(row.passiveSkill); } catch (e) {}
    try { if (row.liveSkill) row.liveSkill = JSON.parse(row.liveSkill); } catch (e) {}
    return row;
  };

  res.json(cards.map(parseSkills));
});

router.post("/gacha/:id", async (req, res) => {
  const db = await setupDatabase();
  const userId = req.params.id;
  const { count, bannerType } = req.body; // bannerType: 'limited' | 'permanent'
  const cost = count * 250;

  const user = await db.get("SELECT starJewels FROM users WHERE id = ?", [userId]);
  if (user.starJewels < cost) {
    return res.status(400).json({ error: "Not enough Star Jewels" });
  }

  // Load Gacha Config
  const configPath = path.join(process.cwd(), "server", "data", "gacha.json");
  let rates = { SSR: 3, SR: 12, R: 85 };
  let featured = [];

  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const banner = config[bannerType] || config['permanent'];
    if (banner && banner.rates) {
      rates = banner.rates;
    }
    if (banner && banner.featured) {
      featured = banner.featured;
    }
  }

  await db.run("UPDATE users SET starJewels = starJewels - ? WHERE id = ?", [cost, userId]);

  const allCards = await db.all("SELECT * FROM cards");
  const newCards = [];

  for (let i = 0; i < count; i++) {
    const rand = Math.random() * 100;
    let rarity = 'R';
    
    // Simple rate logic
    // SSR: 0 to rates.SSR
    // SR: rates.SSR to rates.SSR + rates.SR
    // R: else
    
    if (rand < rates.SSR) {
      rarity = 'SSR';
    } else if (rand < rates.SSR + rates.SR) {
      rarity = 'SR';
    } else {
      rarity = 'R';
    }
    
    // Guaranteed SR or higher for 10th pull (if count == 10)
    if (count === 10 && i === 9) {
       const currentHighest = newCards.reduce((acc, c) => {
         if (c.rarity === 'SSR') return 2;
         if (c.rarity === 'SR') return 1;
         return acc;
       }, 0);
       
       if (currentHighest === 0 && rarity === 'R') {
         rarity = 'SR'; // Force SR if no SR/SSR yet (simplified logic, usually 10th slot is fixed rate)
         // Or strictly: 10th pull has different rates (e.g. 97% SR, 3% SSR)
         // Let's just ensure it's at least SR
       }
    }

    let possibleCards = allCards.filter(c => c.rarity === rarity);
    
    // Rate up logic for featured cards
    if (featured.length > 0 && rarity === 'SSR') {
       // 50% chance to be featured if SSR (common gacha trope)
       if (Math.random() < 0.5) {
         const featuredCards = allCards.filter(c => featured.includes(c.id));
         if (featuredCards.length > 0) {
           possibleCards = featuredCards;
         }
       }
    }

    if (possibleCards.length === 0) {
      // Fallback if no cards of that rarity exist in DB
      possibleCards = allCards; 
    }

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
  
  const parseSkills = (row) => {
    try { if (row.passiveSkill) row.passiveSkill = JSON.parse(row.passiveSkill); } catch (e) {}
    try { if (row.liveSkill) row.liveSkill = JSON.parse(row.liveSkill); } catch (e) {}
    return row;
  };

  res.json(cards.map(parseSkills));
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

// NEW FEATURE: PROMOCODE SYSTEM
router.post("/promocode/redeem", async (req, res) => {
  const db = await setupDatabase();
  const { userId, code } = req.body;

  if (!userId || !code) {
    return res.status(400).json({ success: false, message: "Missing userId or code" });
  }

  try {
    // 1. Load Promocodes Config
    const promoConfigPath = path.join(process.cwd(), "config", "promocodes.json");
    if (!fs.existsSync(promoConfigPath)) {
      return res.status(500).json({ success: false, message: "Promo system unavailable" });
    }

    const promoCodes = JSON.parse(fs.readFileSync(promoConfigPath, "utf-8"));
    const promo = promoCodes[code];

    // 2. Validate Code Exists
    if (!promo) {
      return res.json({ success: false, message: "Invalid promo code" });
    }

    // 3. Check Expiration
    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return res.json({ success: false, message: "Promo code expired" });
    }

    // 4. Check Global Usage Limit
    if (promo.maxGlobalUse) {
      const globalUsage = await db.get("SELECT COUNT(*) as count FROM user_promocode_usage WHERE code = ?", [code]);
      if (globalUsage.count >= promo.maxGlobalUse) {
        return res.json({ success: false, message: "Promo code usage limit reached" });
      }
    }

    // 5. Check User Usage (Single Use)
    if (promo.usageType === "single") {
      const userUsage = await db.get("SELECT * FROM user_promocode_usage WHERE user_id = ? AND code = ?", [userId, code]);
      if (userUsage) {
        return res.json({ success: false, message: "You have already used this code" });
      }
    }

    // 6. Apply Rewards
    const { reward } = promo;
    if (reward.coins) {
      await db.run("UPDATE users SET coins = coins + ? WHERE id = ?", [reward.coins, userId]);
    }
    if (reward.jewels) {
      await db.run("UPDATE users SET starJewels = starJewels + ? WHERE id = ?", [reward.jewels, userId]);
    }

    // 7. Record Usage
    await db.run("INSERT INTO user_promocode_usage (user_id, code, used_at) VALUES (?, ?, ?)", [userId, code, new Date().toISOString()]);

    return res.json({ success: true, reward });

  } catch (error) {
    console.error("Promo code error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// NEW FEATURE: WORK SYSTEM
router.post("/work/:id", async (req, res) => {
  const db = await setupDatabase();
  const userId = req.params.id;
  const { staminaCost, expReward, moneyReward, fansReward } = req.body;

  const user = await db.get("SELECT * FROM users WHERE id = ?", [userId]);
  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.stamina < staminaCost) {
    return res.status(400).json({ error: "Not enough stamina" });
  }

  let newStamina = user.stamina - staminaCost;
  let newExp = user.exp + expReward;
  let newCoins = user.coins + moneyReward;
  let newFans = user.fans + fansReward;
  let newLevel = user.level;
  let newMaxStamina = user.maxStamina;

  // Simple level up logic
  let nextLevelExp = user.level * 1000; // Simplified
  while (newExp >= nextLevelExp) {
    newLevel++;
    newExp -= nextLevelExp;
    nextLevelExp = newLevel * 1000;
    newMaxStamina += 5;
    newStamina = newMaxStamina; // Refill on level up
  }

  await db.run(`
    UPDATE users 
    SET stamina = ?, exp = ?, coins = ?, fans = ?, level = ?, maxStamina = ?
    WHERE id = ?
  `, [newStamina, newExp, newCoins, newFans, newLevel, newMaxStamina, userId]);

  res.json({
    success: true,
    stamina: newStamina,
    exp: newExp,
    coins: newCoins,
    fans: newFans,
    level: newLevel,
    maxStamina: newMaxStamina
  });
});

// NEW FEATURE: LIVE BATTLE SYSTEM
router.post("/live/:id", async (req, res) => {
  const db = await setupDatabase();
  const userId = req.params.id;
  const { isWin, fansGained, moneyGained } = req.body;

  const user = await db.get("SELECT * FROM users WHERE id = ?", [userId]);
  if (!user) return res.status(404).json({ error: "User not found" });

  let newCoins = user.coins + moneyGained;
  let newFans = user.fans + fansGained;

  await db.run(`
    UPDATE users 
    SET coins = ?, fans = ?
    WHERE id = ?
  `, [newCoins, newFans, userId]);

  res.json({
    success: true,
    coins: newCoins,
    fans: newFans
  });
});

// NEW FEATURE: EVENT SYSTEM
router.get("/events", async (req, res) => {
  const db = await setupDatabase();
  const events = await db.all("SELECT * FROM events");
  
  // Parse rewards JSON
  const parsedEvents = events.map(e => ({
    ...e,
    rewards: e.rewards ? JSON.parse(e.rewards) : null
  }));

  res.json(parsedEvents);
});

router.get("/events/:eventId/user/:userId", async (req, res) => {
  const db = await setupDatabase();
  const { eventId, userId } = req.params;

  let userEvent = await db.get("SELECT * FROM user_events WHERE user_id = ? AND event_id = ?", [userId, eventId]);
  
  if (!userEvent) {
    // Initialize if not exists
    await db.run("INSERT INTO user_events (user_id, event_id, progress, points) VALUES (?, ?, 0, 0)", [userId, eventId]);
    userEvent = { user_id: userId, event_id: eventId, progress: 0, points: 0 };
  }

  res.json(userEvent);
});

router.post("/events/:eventId/user/:userId/progress", async (req, res) => {
  const db = await setupDatabase();
  const { eventId, userId } = req.params;
  const { progressAdd, pointsAdd } = req.body;

  let userEvent = await db.get("SELECT * FROM user_events WHERE user_id = ? AND event_id = ?", [userId, eventId]);
  
  if (!userEvent) {
    await db.run("INSERT INTO user_events (user_id, event_id, progress, points) VALUES (?, ?, ?, ?)", [userId, eventId, progressAdd, pointsAdd]);
    userEvent = { user_id: userId, event_id: eventId, progress: progressAdd, points: pointsAdd };
  } else {
    const newProgress = Math.min(100, userEvent.progress + progressAdd);
    const newPoints = userEvent.points + pointsAdd;
    
    await db.run("UPDATE user_events SET progress = ?, points = ? WHERE user_id = ? AND event_id = ?", [newProgress, newPoints, userId, eventId]);
    userEvent.progress = newProgress;
    userEvent.points = newPoints;
  }

  res.json(userEvent);
});

// NEW FEATURE: LOGIN BONUS
router.post("/login-bonus/:userId", async (req, res) => {
  const db = await setupDatabase();
  const { userId } = req.params;
  
  // Use current date in YYYY-MM-DD format based on server time
  const today = new Date().toISOString().split('T')[0];
  
  let loginRecord = await db.get("SELECT * FROM user_logins WHERE user_id = ?", [userId]);
  
  if (!loginRecord) {
    await db.run("INSERT INTO user_logins (user_id, last_login_date, consecutive_days, total_days) VALUES (?, ?, 1, 1)", [userId, today]);
    loginRecord = { user_id: userId, last_login_date: today, consecutive_days: 1, total_days: 1 };
  } else {
    if (loginRecord.last_login_date === today) {
      return res.json({ status: 'already_claimed', record: loginRecord });
    }
    
    const lastLogin = new Date(loginRecord.last_login_date);
    const currentDate = new Date(today);
    const diffTime = Math.abs(currentDate.getTime() - lastLogin.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let newConsecutive = loginRecord.consecutive_days;
    if (diffDays === 1) {
      newConsecutive += 1;
    } else {
      newConsecutive = 1;
    }
    
    await db.run("UPDATE user_logins SET last_login_date = ?, consecutive_days = ?, total_days = total_days + 1 WHERE user_id = ?", [today, newConsecutive, userId]);
    loginRecord.last_login_date = today;
    loginRecord.consecutive_days = newConsecutive;
    loginRecord.total_days += 1;
  }
  
  // Give reward (e.g., 50 jewels daily, 250 every 7 days)
  let rewardJewels = 50;
  if (loginRecord.consecutive_days % 7 === 0) {
    rewardJewels = 250;
  }
  
  await db.run("UPDATE users SET starJewels = starJewels + ? WHERE id = ?", [rewardJewels, userId]);
  
  res.json({ status: 'claimed', reward: { type: 'jewels', amount: rewardJewels }, record: loginRecord });
});

// NEW FEATURE: MISSIONS
router.get("/missions/:userId", async (req, res) => {
  const db = await setupDatabase();
  const { userId } = req.params;
  
  const today = new Date().toISOString().split('T')[0];
  
  // Get all missions
  const missions = await db.all("SELECT * FROM missions");
  
  // Get user progress
  const userMissions = await db.all("SELECT * FROM user_missions WHERE user_id = ?", [userId]);
  const userMissionMap = {};
  for (const um of userMissions) {
    userMissionMap[um.mission_id] = um;
  }
  
  const result = [];
  for (const mission of missions) {
    let progress = userMissionMap[mission.id];
    
    if (!progress) {
      progress = { mission_id: mission.id, progress: 0, completed: 0, claimed: 0, updated_at: today };
      await db.run("INSERT INTO user_missions (user_id, mission_id, progress, completed, claimed, updated_at) VALUES (?, ?, 0, 0, 0, ?)", [userId, mission.id, today]);
    } else {
      // Check for resets
      if (mission.type === 'daily' && progress.updated_at !== today) {
        progress.progress = 0;
        progress.completed = 0;
        progress.claimed = 0;
        progress.updated_at = today;
        await db.run("UPDATE user_missions SET progress = 0, completed = 0, claimed = 0, updated_at = ? WHERE user_id = ? AND mission_id = ?", [today, userId, mission.id]);
      }
      // Weekly reset logic could be added here (e.g., checking if it's a new week)
    }
    
    result.push({ ...mission, ...progress });
  }
  
  res.json(result);
});

router.post("/missions/:userId/progress", async (req, res) => {
  const db = await setupDatabase();
  const { userId } = req.params;
  const { action, amount } = req.body;
  const today = new Date().toISOString().split('T')[0];
  
  const missions = await db.all("SELECT * FROM missions WHERE action = ?", [action]);
  
  for (const mission of missions) {
    let progress = await db.get("SELECT * FROM user_missions WHERE user_id = ? AND mission_id = ?", [userId, mission.id]);
    
    if (!progress) {
      progress = { progress: 0, completed: 0, claimed: 0 };
      await db.run("INSERT INTO user_missions (user_id, mission_id, progress, completed, claimed, updated_at) VALUES (?, ?, 0, 0, 0, ?)", [userId, mission.id, today]);
    }
    
    if (!progress.completed) {
      const newProgress = progress.progress + (amount || 1);
      const completed = newProgress >= mission.target_value ? 1 : 0;
      await db.run("UPDATE user_missions SET progress = ?, completed = ?, updated_at = ? WHERE user_id = ? AND mission_id = ?", [newProgress, completed, today, userId, mission.id]);
    }
  }
  
  res.json({ success: true });
});

router.post("/missions/:userId/claim/:missionId", async (req, res) => {
  const db = await setupDatabase();
  const { userId, missionId } = req.params;
  
  const mission = await db.get("SELECT * FROM missions WHERE id = ?", [missionId]);
  const progress = await db.get("SELECT * FROM user_missions WHERE user_id = ? AND mission_id = ?", [userId, missionId]);
  
  if (!mission || !progress || !progress.completed || progress.claimed) {
    return res.status(400).json({ error: "Cannot claim this mission" });
  }
  
  await db.run("UPDATE user_missions SET claimed = 1 WHERE user_id = ? AND mission_id = ?", [userId, missionId]);
  
  if (mission.reward_type === 'coins') {
    await db.run("UPDATE users SET coins = coins + ? WHERE id = ?", [mission.reward_amount, userId]);
  } else if (mission.reward_type === 'jewels') {
    await db.run("UPDATE users SET starJewels = starJewels + ? WHERE id = ?", [mission.reward_amount, userId]);
  }
  
  res.json({ success: true, reward: { type: mission.reward_type, amount: mission.reward_amount } });
});

// NEW FEATURE: COMMU
router.get("/commus/:userId", async (req, res) => {
  const db = await setupDatabase();
  const { userId } = req.params;
  
  const commus = await db.all("SELECT * FROM commus");
  const userCommus = await db.all("SELECT * FROM user_commus WHERE user_id = ?", [userId]);
  const userInventory = await db.all("SELECT card_id FROM user_inventory WHERE user_id = ?", [userId]);
  
  const readMap = {};
  for (const uc of userCommus) {
    readMap[uc.commu_id] = uc.is_read;
  }
  
  const inventorySet = new Set(userInventory.map(i => i.card_id));
  
  const result = commus.map(c => {
    let isUnlocked = false;
    if (c.unlock_condition === 'none') {
      isUnlocked = true;
    } else if (c.unlock_condition.startsWith('card_')) {
      const cardId = parseInt(c.unlock_condition.split('_')[1]);
      isUnlocked = inventorySet.has(cardId);
    }
    
    return {
      ...c,
      script: JSON.parse(c.script),
      is_read: readMap[c.id] || 0,
      is_unlocked: isUnlocked
    };
  });
  
  res.json(result);
});

router.post("/commus/:userId/read/:commuId", async (req, res) => {
  const db = await setupDatabase();
  const { userId, commuId } = req.params;
  
  const commu = await db.get("SELECT * FROM commus WHERE id = ?", [commuId]);
  if (!commu) return res.status(404).json({ error: "Commu not found" });
  
  let userCommu = await db.get("SELECT * FROM user_commus WHERE user_id = ? AND commu_id = ?", [userId, commuId]);
  
  if (!userCommu) {
    await db.run("INSERT INTO user_commus (user_id, commu_id, is_read) VALUES (?, ?, 1)", [userId, commuId]);
    
    // Give reward for first time read
    if (commu.reward_type === 'jewels') {
      await db.run("UPDATE users SET starJewels = starJewels + ? WHERE id = ?", [commu.reward_amount, userId]);
    } else if (commu.reward_type === 'coins') {
      await db.run("UPDATE users SET coins = coins + ? WHERE id = ?", [commu.reward_amount, userId]);
    }
    
    res.json({ success: true, first_read: true, reward: { type: commu.reward_type, amount: commu.reward_amount } });
  } else {
    res.json({ success: true, first_read: false });
  }
});

// ITEM USAGE ENDPOINTS
router.post("/items/use/stamina/:id", async (req, res) => {
  const db = await setupDatabase();
  const userId = req.params.id;
  const { amount } = req.body; // Amount of drinks to use

  const user = await db.get("SELECT * FROM users WHERE id = ?", [userId]);
  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.staminaDrinks < amount) {
    return res.status(400).json({ error: "Not enough stamina drinks" });
  }

  // Each drink restores 50 stamina (or max stamina, depending on game logic. Let's say 50)
  const staminaRestored = 50 * amount;
  const newStamina = user.stamina + staminaRestored;
  const newDrinks = user.staminaDrinks - amount;

  await db.run("UPDATE users SET stamina = ?, staminaDrinks = ? WHERE id = ?", [newStamina, newDrinks, userId]);

  res.json({ success: true, stamina: newStamina, staminaDrinks: newDrinks });
});

router.post("/items/use/gacha/:id", async (req, res) => {
  const db = await setupDatabase();
  const userId = req.params.id;
  const { count } = req.body; // Number of tickets to use

  const user = await db.get("SELECT * FROM users WHERE id = ?", [userId]);
  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.gachaTickets < count) {
    return res.status(400).json({ error: "Not enough gacha tickets" });
  }

  // Deduct tickets
  await db.run("UPDATE users SET gachaTickets = gachaTickets - ? WHERE id = ?", [count, userId]);

  // Perform gacha logic (simplified version of the main gacha logic)
  const allCards = await db.all("SELECT * FROM cards");
  const newCards = [];
  const rates = { SSR: 3, SR: 12, R: 85 };

  for (let i = 0; i < count; i++) {
    const rand = Math.random() * 100;
    let rarity = 'R';
    if (rand < rates.SSR) rarity = 'SSR';
    else if (rand < rates.SSR + rates.SR) rarity = 'SR';
    
    let possibleCards = allCards.filter(c => c.rarity === rarity);
    if (possibleCards.length === 0) possibleCards = allCards;
    
    const selectedCard = possibleCards[Math.floor(Math.random() * possibleCards.length)];
    const result = await db.run("INSERT INTO user_inventory (user_id, card_id) VALUES (?, ?)", [userId, selectedCard.id]);
    newCards.push({ ...selectedCard, inventory_id: result.lastID });
  }

  res.json({ success: true, newCards, gachaTickets: user.gachaTickets - count });
});

router.post("/items/use/upgrade/:id", async (req, res) => {
  const db = await setupDatabase();
  const userId = req.params.id;
  const { inventoryId, amount } = req.body;

  const user = await db.get("SELECT * FROM users WHERE id = ?", [userId]);
  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.upgradeItems < amount) {
    return res.status(400).json({ error: "Not enough upgrade items" });
  }

  // Verify user owns the card
  const card = await db.get("SELECT * FROM user_inventory WHERE id = ? AND user_id = ?", [inventoryId, userId]);
  if (!card) return res.status(400).json({ error: "Card not found in inventory" });

  // Deduct items
  await db.run("UPDATE users SET upgradeItems = upgradeItems - ? WHERE id = ?", [amount, userId]);

  // In a real game, this would increase card level/stats. We'll just return success for now.
  // Assuming we might add a 'level' or 'bonus_stats' column to user_inventory later.
  res.json({ success: true, upgradeItems: user.upgradeItems - amount, message: "Card upgraded successfully" });
});

router.post("/items/use/exp/:id", async (req, res) => {
  const db = await setupDatabase();
  const userId = req.params.id;
  const { inventoryId, amount } = req.body;

  const user = await db.get("SELECT * FROM users WHERE id = ?", [userId]);
  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.expCards < amount) {
    return res.status(400).json({ error: "Not enough EXP cards" });
  }

  // Verify user owns the card
  const card = await db.get("SELECT * FROM user_inventory WHERE id = ? AND user_id = ?", [inventoryId, userId]);
  if (!card) return res.status(400).json({ error: "Card not found in inventory" });

  // Deduct items
  await db.run("UPDATE users SET expCards = expCards - ? WHERE id = ?", [amount, userId]);

  // In a real game, this would increase card EXP.
  res.json({ success: true, expCards: user.expCards - amount, message: "Card EXP increased successfully" });
});

export default router;
