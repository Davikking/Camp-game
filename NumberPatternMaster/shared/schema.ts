import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const gameSessionSchema = z.object({
  id: z.string(),
  currentLevel: z.number().min(1).max(3),
  level1Completed: z.boolean(),
  level2Completed: z.boolean(),
  level3Completed: z.boolean(),
  gameCompleted: z.boolean(),
  level2Solution: z.record(z.string(), z.any()).optional(),
  outliersRemaining: z.number().optional(),
});

export const questionSchema = z.object({
  question: z.string(),
  answer: z.number(),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

export const level2SolutionSchema = z.object({
  triangle: z.object({ color: z.string(), count: z.number() }),
  circle: z.object({ color: z.string(), count: z.number() }),
  square: z.object({ color: z.string(), count: z.number() }),
  hexagon: z.object({ color: z.string(), count: z.number() }),
  octagon: z.object({ color: z.string(), count: z.number() }),
});

export type GameSession = z.infer<typeof gameSessionSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Level2Solution = z.infer<typeof level2SolutionSchema>;
