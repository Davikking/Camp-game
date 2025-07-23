import { Question } from "@shared/schema";

export const questions: Question[] = [
  // Easy questions
  { question: "3, 6, 9, 12, ?", answer: 15, difficulty: "easy" },
  { question: "2, 5, 8, 11, ?", answer: 14, difficulty: "easy" },
  { question: "2, 4, 6, 8, ?", answer: 10, difficulty: "easy" },
  { question: "2, 4, 8, 16, ?", answer: 32, difficulty: "easy" },
  { question: "2, 6, 10, 14, ?", answer: 18, difficulty: "easy" },
  
  // Medium questions
  { question: "2, 5, 10, 17, ?", answer: 26, difficulty: "medium" },
  { question: "1, 4, 9, 16, ?", answer: 25, difficulty: "medium" },
  { question: "3, 9, 27, 81, ?", answer: 243, difficulty: "medium" },
  { question: "1, 1, 2, 3, ?", answer: 5, difficulty: "medium" },
  { question: "10, 7, 4, 1, ?", answer: -2, difficulty: "medium" },
  
  // Hard questions
  { question: "5, 11, 23, 47, ?", answer: 95, difficulty: "hard" },
  { question: "1, 2, 6, 24, ?", answer: 120, difficulty: "hard" },
  { question: "7, 10, 8, 11, ?", answer: 9, difficulty: "hard" },
  { question: "2, 3, 5, 8, ?", answer: 12, difficulty: "hard" },
  { question: "2, 4, 12, 48, ?", answer: 240, difficulty: "hard" },
];

export function getRandomQuestionsByDifficulty(): { easy: Question; medium: Question; hard: Question } {
  const easyQuestions = questions.filter(q => q.difficulty === "easy");
  const mediumQuestions = questions.filter(q => q.difficulty === "medium");
  const hardQuestions = questions.filter(q => q.difficulty === "hard");

  return {
    easy: easyQuestions[Math.floor(Math.random() * easyQuestions.length)],
    medium: mediumQuestions[Math.floor(Math.random() * mediumQuestions.length)],
    hard: hardQuestions[Math.floor(Math.random() * hardQuestions.length)],
  };
}

export function generateWrongAnswers(correct: number): number[] {
  const wrongAnswers: number[] = [];
  const variations = [
    correct + Math.floor(Math.random() * 10) + 1,
    correct - Math.floor(Math.random() * 5) - 1,
    Math.floor(correct * 1.5),
  ];

  // Ensure we have 3 unique wrong answers
  for (const variation of variations) {
    if (variation !== correct && !wrongAnswers.includes(variation)) {
      wrongAnswers.push(variation);
    }
  }

  // Fill remaining slots if needed
  while (wrongAnswers.length < 3) {
    const random = correct + Math.floor(Math.random() * 20) - 10;
    if (random !== correct && !wrongAnswers.includes(random)) {
      wrongAnswers.push(random);
    }
  }

  return wrongAnswers.slice(0, 3);
}
