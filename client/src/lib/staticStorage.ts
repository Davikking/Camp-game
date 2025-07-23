import { GameSession } from "@shared/schema";

// Static storage for client-side game sessions
export class StaticStorage {
  private getStorageKey(sessionId: string): string {
    return `game-session-${sessionId}`;
  }

  getGameSession(sessionId: string): GameSession | null {
    try {
      const stored = localStorage.getItem(this.getStorageKey(sessionId));
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  createGameSession(sessionId: string): GameSession {
    const newSession: GameSession = {
      id: sessionId,
      currentLevel: 1,
      level1Completed: false,
      level2Completed: false,
      level3Completed: false,
      gameCompleted: false,
      outliersRemaining: 5,
    };
    
    localStorage.setItem(this.getStorageKey(sessionId), JSON.stringify(newSession));
    return newSession;
  }

  updateGameSession(sessionId: string, updates: Partial<GameSession>): GameSession {
    const existing = this.getGameSession(sessionId);
    if (!existing) {
      throw new Error("Game session not found");
    }
    
    const updated = { ...existing, ...updates };
    localStorage.setItem(this.getStorageKey(sessionId), JSON.stringify(updated));
    return updated;
  }

  validateLevel2Solution(solution: Record<string, { color: string; count: number }>): { correct: boolean; correctSolution: any } {
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

    return { correct: isCorrect, correctSolution };
  }
}

export const staticStorage = new StaticStorage();