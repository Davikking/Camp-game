import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { gameSessionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get or create game session
  app.get("/api/game/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      let session = await storage.getGameSession(sessionId);
      
      if (!session) {
        session = await storage.createGameSession(sessionId);
      }
      
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to get game session" });
    }
  });

  // Update game session
  app.patch("/api/game/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const updates = gameSessionSchema.partial().parse(req.body);
      
      const session = await storage.updateGameSession(sessionId, updates);
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid game session data" });
      } else {
        res.status(500).json({ message: "Failed to update game session" });
      }
    }
  });

  // Validate Level 2 solution
  app.post("/api/game/:sessionId/validate-level2", async (req, res) => {
    try {
      const solution = req.body;
      
      // Correct solution based on the logic puzzle
      const correctSolution = {
        triangle: { color: "purple", count: 4 },
        circle: { color: "green", count: 7 },
        square: { color: "yellow", count: 5 },
        hexagon: { color: "brown", count: 6 },
        octagon: { color: "red", count: 3 }
      };

      const isCorrect = Object.keys(correctSolution).every(shape => {
        const correct = correctSolution[shape as keyof typeof correctSolution];
        const provided = solution[shape];
        return provided && provided.color === correct.color && provided.count === correct.count;
      });

      res.json({ correct: isCorrect, correctSolution });
    } catch (error) {
      res.status(500).json({ message: "Failed to validate solution" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
