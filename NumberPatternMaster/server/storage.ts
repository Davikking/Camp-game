import { GameSession } from "@shared/schema";

export interface IStorage {
  getGameSession(id: string): Promise<GameSession | undefined>;
  updateGameSession(id: string, session: Partial<GameSession>): Promise<GameSession>;
  createGameSession(id: string): Promise<GameSession>;
}

export class MemStorage implements IStorage {
  private gameSessions: Map<string, GameSession>;

  constructor() {
    this.gameSessions = new Map();
  }

  async getGameSession(id: string): Promise<GameSession | undefined> {
    return this.gameSessions.get(id);
  }

  async updateGameSession(id: string, updates: Partial<GameSession>): Promise<GameSession> {
    const existing = this.gameSessions.get(id);
    if (!existing) {
      throw new Error("Game session not found");
    }
    
    const updated = { ...existing, ...updates };
    this.gameSessions.set(id, updated);
    return updated;
  }

  async createGameSession(id: string): Promise<GameSession> {
    const newSession: GameSession = {
      id,
      currentLevel: 1,
      level1Completed: false,
      level2Completed: false,
      level3Completed: false,
      gameCompleted: false,
      outliersRemaining: 5,
    };
    
    this.gameSessions.set(id, newSession);
    return newSession;
  }
}

export const storage = new MemStorage();
