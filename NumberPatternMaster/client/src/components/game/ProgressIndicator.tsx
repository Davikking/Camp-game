import { GameSession } from "@shared/schema";

interface ProgressIndicatorProps {
  gameSession: GameSession;
}

export default function ProgressIndicator({ gameSession }: ProgressIndicatorProps) {
  const getProgress = () => {
    if (gameSession.gameCompleted) return 100;
    if (gameSession.level3Completed || gameSession.currentLevel > 3) return 100;
    if (gameSession.level2Completed || gameSession.currentLevel === 3) return 67;
    if (gameSession.level1Completed || gameSession.currentLevel === 2) return 33;
    return 0;
  };

  const getLevelStatus = (level: number) => {
    if (level === 1) {
      return gameSession.level1Completed ? "completed" : gameSession.currentLevel === 1 ? "active" : "locked";
    }
    if (level === 2) {
      return gameSession.level2Completed ? "completed" : gameSession.currentLevel === 2 ? "active" : "locked";
    }
    if (level === 3) {
      return gameSession.level3Completed ? "completed" : gameSession.currentLevel === 3 ? "active" : "locked";
    }
    return "locked";
  };

  const progress = getProgress();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Progress</h2>
        <span className="text-sm text-slate-500">
          Level {gameSession.currentLevel} of 3
        </span>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Level 1 */}
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            getLevelStatus(1) === "completed" ? "bg-green-500 text-white" :
            getLevelStatus(1) === "active" ? "bg-blue-500 text-white" :
            "bg-slate-300 text-slate-600"
          }`}>
            {getLevelStatus(1) === "completed" ? "✓" : "1"}
          </div>
          <span className={`ml-2 text-sm font-medium ${
            getLevelStatus(1) === "active" ? "text-blue-500" :
            getLevelStatus(1) === "completed" ? "text-green-500" :
            "text-slate-500"
          }`}>
            Patterns
          </span>
        </div>
        
        <div className="flex-1 h-2 bg-slate-200 rounded-full">
          <div 
            className="h-2 bg-blue-500 rounded-full transition-all duration-300" 
            style={{ width: `${Math.min(progress, 33)}%` }}
          />
        </div>

        {/* Level 2 */}
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            getLevelStatus(2) === "completed" ? "bg-green-500 text-white" :
            getLevelStatus(2) === "active" ? "bg-purple-500 text-white" :
            "bg-slate-300 text-slate-600"
          }`}>
            {getLevelStatus(2) === "completed" ? "✓" : "2"}
          </div>
          <span className={`ml-2 text-sm font-medium ${
            getLevelStatus(2) === "active" ? "text-purple-500" :
            getLevelStatus(2) === "completed" ? "text-green-500" :
            "text-slate-500"
          }`}>
            Logic
          </span>
        </div>
        
        <div className="flex-1 h-2 bg-slate-200 rounded-full">
          <div 
            className="h-2 bg-purple-500 rounded-full transition-all duration-300" 
            style={{ width: `${Math.max(0, Math.min(progress - 33, 34))}%` }}
          />
        </div>

        {/* Level 3 */}
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            getLevelStatus(3) === "completed" ? "bg-green-500 text-white" :
            getLevelStatus(3) === "active" ? "bg-red-500 text-white" :
            "bg-slate-300 text-slate-600"
          }`}>
            {getLevelStatus(3) === "completed" ? "✓" : "3"}
          </div>
          <span className={`ml-2 text-sm font-medium ${
            getLevelStatus(3) === "active" ? "text-red-500" :
            getLevelStatus(3) === "completed" ? "text-green-500" :
            "text-slate-500"
          }`}>
            Outliers
          </span>
        </div>
      </div>
    </div>
  );
}
