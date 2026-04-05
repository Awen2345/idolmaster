import { Server } from "socket.io";
import { setupDatabase } from "./db.js";

export function setupSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  // Simple matchmaking queue
  let waitingPlayer = null;

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("find_match", async (data) => {
      const { userId, formation, totalAtk, totalDef, mode } = data;
      
      if (mode === 'bot') {
        // Generate Bot
        const db = await setupDatabase();
        const randomCards = await db.all("SELECT * FROM cards ORDER BY RANDOM() LIMIT 5");
        
        const botNames = ["Rival Producer", "Idol Master", "Kuroi", "Takagi", "Rookie Prod"];
        const randomName = botNames[Math.floor(Math.random() * botNames.length)] + Math.floor(Math.random() * 1000);
        
        // Calculate bot stats (similar or slightly varied)
        const botAtk = Math.floor(totalAtk * (0.8 + Math.random() * 0.4));
        const botDef = Math.floor(totalDef * (0.8 + Math.random() * 0.4));

        const botOpponent = {
          id: 'bot_' + Math.random(),
          name: randomName,
          level: Math.floor(Math.random() * 20) + 10,
          atk: botAtk,
          def: botDef,
          formation: randomCards,
          quote: "I won't lose to you!",
          avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${randomName}&backgroundColor=ffdfbf`
        };

        // Send match found to the player
        setTimeout(() => {
          socket.emit("match_found", { opponent: botOpponent });
        }, 1500); // simulate searching delay
      } else {
        // Multiplayer Matchmaking
        if (waitingPlayer) {
          // Found a match
          const opponentSocket = waitingPlayer.socket;
          const opponentData = waitingPlayer.data;

          // Create match info
          const matchId = `match_${Date.now()}`;

          // Notify this player
          socket.emit("match_found", {
            matchId,
            opponent: {
              id: opponentData.userId,
              name: `Producer ${opponentData.userId}`,
              level: 20,
              atk: opponentData.totalAtk,
              def: opponentData.totalDef,
              formation: opponentData.formation,
              quote: "Let's have a good live!",
              avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=Prod${opponentData.userId}&backgroundColor=bfe6ff`
            }
          });

          // Notify waiting player
          opponentSocket.emit("match_found", {
            matchId,
            opponent: {
              id: userId,
              name: `Producer ${userId}`,
              level: 20,
              atk: totalAtk,
              def: totalDef,
              formation: formation,
              quote: "Let's have a good live!",
              avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=Prod${userId}&backgroundColor=ffdfbf`
            }
          });

          waitingPlayer = null;
        } else {
          // Wait in queue
          waitingPlayer = { socket, data };
        }
      }
    });

    socket.on("cancel_match", () => {
      if (waitingPlayer && waitingPlayer.socket.id === socket.id) {
        waitingPlayer = null;
      }
    });

    socket.on("disconnect", () => {
      if (waitingPlayer && waitingPlayer.socket.id === socket.id) {
        waitingPlayer = null;
      }
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}
