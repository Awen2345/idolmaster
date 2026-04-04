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

  // Real-time request and response logging middleware
  app.use((req, res, next) => {
    // Only log API requests, ignore Vite's internal file requests
    if (!req.originalUrl.startsWith('/api')) {
      return next();
    }

    const start = Date.now();
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Body:`, req.body);
    
    // Intercept response to log it
    const originalSend = res.send;
    res.send = function (body) {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Duration: ${duration}ms`);
      // Optional: log response body for specific routes if needed, but usually too large
      return originalSend.apply(res, arguments);
    };
    
    next();
  });

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
