import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { GameSession } from "@shared/schema";
import ProgressIndicator from "@/components/game/ProgressIndicator";
import Level1 from "@/components/game/Level1";
import Level2 from "@/components/game/Level2";
import Level3 from "@/components/game/Level3";
import GameCompletion from "@/components/game/GameCompletion";

export default function Game() {
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));
  const queryClient = useQueryClient();

  const { data: gameSession, isLoading } = useQuery<GameSession>({
    queryKey: ["/api/game", sessionId],
    refetchOnWindowFocus: false,
  });

  const updateSessionMutation = useMutation({
    mutationFn: async (updates: Partial<GameSession>) => {
      const response = await apiRequest("PATCH", `/api/game/${sessionId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/game", sessionId] });
    },
  });

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

    updateSessionMutation.mutate(updates);
  };

  const handleRetry = () => {
    updateSessionMutation.mutate({
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
                onRetry={() => updateSessionMutation.mutate({ currentLevel: 1 })}
              />
            )}

            {gameSession.currentLevel === 2 && gameSession.level1Completed && (
              <Level2
                sessionId={sessionId}
                onComplete={() => handleLevelComplete(2)}
                onReset={() => updateSessionMutation.mutate({ level2Solution: undefined })}
              />
            )}

            {gameSession.currentLevel === 3 && gameSession.level2Completed && (
              <Level3
                sessionId={sessionId}
                gameSession={gameSession}
                onComplete={() => handleLevelComplete(3)}
                onReset={() => updateSessionMutation.mutate({ outliersRemaining: 5 })}
                onUpdateOutliers={(remaining: number) => 
                  updateSessionMutation.mutate({ outliersRemaining: remaining })
                }
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
