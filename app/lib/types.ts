export type Goal = "fat_loss" | "muscle_gain" | "recomp" | "strength" | "general_fitness";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "very_active"
  | "athlete";

export type Sex = "male" | "female";

export type WorkoutLevel = "beginner" | "intermediate" | "advanced";
export type Equipment = "gym" | "home_basic" | "bodyweight";

export type WorkoutInput = {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;

  goal: Goal;
  level: WorkoutLevel;
  daysPerWeek: number; // 3-6
  timePerSessionMin: number; // 30-90
  equipment: Equipment;
};

export type MacroSplit = {
  protein_g: number;
  carbs_g: number;
  fats_g: number;
};

export type Calculations = {
  bmr: number;
  tdee: number; // maintenance calories
  targetCalories: number;
  activityMultiplier: number;
};

export type WorkoutPlan = {
  title: string;
  overview: {
    goalSummary: string;
    weeklyStructure: string;
    progressionRule: string;
    safetyNotes: string[];
  };
  schedule: Array<{
    day: string;
    focus: string;
    warmup: string[];
    workout: Array<{ exercise: string; sets: number; reps: string; restSec: number }>;
    finisher: string[];
    cooldown: string[];
  }>;
  cardio?: { frequencyPerWeek: number; sessions: string[] };
  nextSteps: string[];
  disclaimer: string;
};

export type ApiResponse =
  | {
      ok: true;
      calculations: Calculations;
      macros: MacroSplit;
      plan: WorkoutPlan;
    }
  | { ok: false; error: string };
