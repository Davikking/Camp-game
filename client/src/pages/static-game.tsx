import { useState, useEffect } from "react";
import { GameSession } from "@shared/schema";
import { staticStorage } from "@/lib/staticStorage";
import ProgressIndicator from "@/components/game/ProgressIndicator";
import Level1 from "@/components/game/Level1";
import Level2Static from "@/components/game/Level2Static";
import Level3 from "@/components/game/Level3";
import GameCompletion from "@/components/game/GameCompletion";

export default function StaticGame() {
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize game session
    let session = staticStorage.getGameSession(sessionId);
    if (!session) {
      session = staticStorage.createGameSession(sessionId);
    }
    setGameSession(session);
    setIsLoading(false);
  }, [sessionId]);

  const updateSession = (updates: Partial<GameSession>) => {
    if (!gameSession) return;
    
    const updated = staticStorage.updateGameSession(sessionId, updates);
    setGameSession(updated);
  };

  const handleLevelComplete = (level: number) => {
    const updates: Partial<GameSession> = {};
    
    if (level === 1) {
      updates.level1Completed = true;
    } else if (level === 2) {
      updates.level2Completed = true;
    } else if (level === 3) {
      updates.level3Completed = true;
    }

    if (level < 3) {
      updates.currentLevel = level + 1;
    } else {
      updates.gameCompleted = true;
    }

    updateSession(updates);
  };

  const handleRetry = () => {
    updateSession({
      currentLevel: 1,
      level1Completed: false,
      level2Completed: false,
      level3Completed: false,
      gameCompleted: false,
      outliersRemaining: 5,
    });
  };

  if (isLoading || !gameSession) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Pattern & Logic Challenge</h1>
          <p className="text-slate-600 text-lg">Test your pattern recognition and logical thinking skills!</p>
        </header>

        <ProgressIndicator gameSession={gameSession} />

        {gameSession.gameCompleted ? (
          <GameCompletion onPlayAgain={handleRetry} />
        ) : (
          <>
            {gameSession.currentLevel === 1 && (
              <Level1
                onComplete={() => handleLevelComplete(1)}
                onRetry={() => updateSession({ currentLevel: 1 })}
              />
            )}

            {gameSession.currentLevel === 2 && gameSession.level1Completed && (
              <Level2Static
                onComplete={() => handleLevelComplete(2)}
                onReset={() => updateSession({ level2Solution: undefined })}
              />
            )}

            {gameSession.currentLevel === 3 && gameSession.level2Completed && (
              <Level3
                sessionId={sessionId}
                gameSession={gameSession}
                onComplete={() => handleLevelComplete(3)}
                onReset={() => updateSession({ outliersRemaining: 5 })}
                onUpdateOutliers={(remaining: number) => 
                  updateSession({ outliersRemaining: remaining })
                }
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}