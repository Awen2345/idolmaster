import express from "express";
import cors from "cors";
import apiRoutes from "./routes/api.js";
import { setupViteMiddleware } from "./middleware/vite.js";
import { setupDatabase } from "./db.js";

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Initialize database
  await setupDatabase();

  // API Routes
  app.use("/api", apiRoutes);

  // Vite middleware for development
  await setupViteMiddleware(app);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
