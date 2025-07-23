import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getRandomQuestionsByDifficulty, generateWrongAnswers } from "@/lib/gameData";
import { Question } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, RotateCcw } from "lucide-react";

interface Level1Props {
  onComplete: () => void;
  onRetry: () => void;
}

export default function Level1({ onComplete, onRetry }: Level1Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answerOptions, setAnswerOptions] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeQuestions();
  }, []);

  const initializeQuestions = () => {
    const selectedQuestions = getRandomQuestionsByDifficulty();
    const questionsArray = [selectedQuestions.easy, selectedQuestions.medium, selectedQuestions.hard];
    setQuestions(questionsArray);
    setupCurrentQuestion(questionsArray[0]);
    setCurrentQuestionIndex(0);
  };

  const setupCurrentQuestion = (question: Question) => {
    const wrongAnswers = generateWrongAnswers(question.answer);
    const allOptions = [...wrongAnswers, question.answer];
    // Shuffle options
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }
    setAnswerOptions(allOptions);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswerSelect = (answer: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestionIndex].answer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      toast({
        title: "Correct!",
        description: "Great job! Moving to the next question.",
      });

      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          const nextIndex = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIndex);
          setupCurrentQuestion(questions[nextIndex]);
        } else {
          toast({
            title: "Level 1 Complete!",
            description: "You've successfully completed all pattern questions!",
          });
          setTimeout(onComplete, 1500);
        }
      }, 1500);
    } else {
      toast({
        title: "Incorrect",
        description: "That's not quite right. Try again!",
        variant: "destructive",
      });
    }
  };

  const handleRetry = () => {
    onRetry();
    setTimeout(() => {
      initializeQuestions();
    }, 100);
  };

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="animate-pulse">Loading questions...</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <TrendingUp className="text-2xl text-blue-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Level 1: Number Patterns</h2>
        <p className="text-slate-600">Find the next number in the sequence</p>
        <div className="mt-2">
          <Badge variant="outline">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Badge>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-6 mb-8 text-center">
        <p className="text-sm text-slate-500 mb-2">Question</p>
        <h3 className="text-3xl font-bold text-slate-800 mb-4">
          {currentQuestion.question}
        </h3>
        <Badge 
          className={`${
            currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
            currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}
        >
          {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {answerOptions.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            className={`h-16 text-2xl font-bold border-2 transition-all duration-200 ${
              selectedAnswer === option
                ? showResult
                  ? isCorrect
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-red-500 bg-red-50 text-red-700'
                  : 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700'
            } ${
              showResult && option === currentQuestion.answer && selectedAnswer !== option
                ? 'border-green-500 bg-green-50 text-green-700'
                : ''
            }`}
            onClick={() => handleAnswerSelect(option)}
            disabled={showResult}
          >
            {option}
          </Button>
        ))}
      </div>

      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={handleRetry}>
          <RotateCcw className="mr-2" size={16} />
          Retry Level
        </Button>
      </div>
    </div>
  );
}
