// app/lib/schema.ts
import { z } from "zod";

export const WorkoutInputSchema = z.object({
  sex: z.enum(["male", "female"]),
  age: z.number().int().min(13).max(80),
  heightCm: z.number().min(120).max(230),
  weightKg: z.number().min(30).max(250),
  goalWeightKg: z.number().min(30).max(250), // ✅ NEW

  activityLevel: z.enum(["sedentary", "light", "moderate", "very_active", "athlete"]),
  goal: z.enum(["fat_loss", "muscle_gain", "recomp", "strength", "general_fitness"]),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  daysPerWeek: z.number().int().min(1).max(6), // ✅ UPDATED (now includes 1 & 2)
  timePerSessionMin: z.number().int().min(20).max(120),
  equipment: z.enum(["gym", "home_basic", "bodyweight"]),
});
