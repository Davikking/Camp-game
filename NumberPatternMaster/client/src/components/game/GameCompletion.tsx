import { Button } from "@/components/ui/button";
import { Trophy, Play } from "lucide-react";

interface GameCompletionProps {
  onPlayAgain: () => void;
}

export default function GameCompletion({ onPlayAgain }: GameCompletionProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="text-3xl text-green-600" size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Congratulations!</h2>
        <p className="text-slate-600 mb-6">
          You've successfully completed all three levels of the Pattern & Logic Challenge!
        </p>
        <div className="flex justify-center space-x-4">
          <Button onClick={onPlayAgain} className="bg-blue-500 hover:bg-blue-600">
            <Play className="mr-2" size={16} />
            Play Again
          </Button>
        </div>
      </div>
    </div>
  );
}
