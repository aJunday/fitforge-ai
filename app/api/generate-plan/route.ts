import OpenAI from "openai";
import { z } from "zod";
import { WorkoutInputSchema } from "@/app/lib/schema";
import type { ApiResponse, WorkoutInput, Calculations, MacroSplit, WorkoutPlan } from "@/app/lib/types";
import { buildWorkoutPrompt } from "@/app/lib/prompt";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Activity multipliers
const ACTIVITY: Record<WorkoutInput["activityLevel"], number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
  athlete: 1.9,
};

// Mifflin-St Jeor BMR
function calcBmr(input: WorkoutInput) {
  const base = 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age;
  return input.sex === "male" ? base + 5 : base - 161;
}

function round(n: number) {
  return Math.round(n);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// Simple macro logic
function calcMacros(input: WorkoutInput, targetCalories: number): MacroSplit {
  // Protein: goal-based g/kg
  const proteinPerKg =
    input.goal === "muscle_gain" ? 2.0 :
    input.goal === "strength" ? 1.8 :
    input.goal === "fat_loss" ? 1.9 :
    input.goal === "recomp" ? 1.9 : 1.6;

  const protein_g = round(input.weightKg * proteinPerKg);

  // Fat: 0.8g/kg baseline (higher for hormonal health), clamp
  const fats_g = clamp(round(input.weightKg * 0.8), 45, 95);

  // Calories from protein/fat
  const calsFromProtein = protein_g * 4;
  const calsFromFat = fats_g * 9;

  // Remaining calories -> carbs
  const remaining = Math.max(0, targetCalories - (calsFromProtein + calsFromFat));
  const carbs_g = round(remaining / 4);

  return { protein_g, carbs_g, fats_g };
}

function calcTargetCalories(tdee: number, goal: WorkoutInput["goal"]) {
  // Safe, simple adjustments
  if (goal === "fat_loss") return round(tdee * 0.8);       // ~20% deficit
  if (goal === "muscle_gain") return round(tdee * 1.1);    // ~10% surplus
  if (goal === "strength") return round(tdee * 1.0);       // maintain
  if (goal === "recomp") return round(tdee * 0.9);         // slight deficit
  return round(tdee * 1.0);                                // general fitness
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = WorkoutInputSchema.parse(body) as WorkoutInput;

    const bmr = calcBmr(input);
    const activityMultiplier = ACTIVITY[input.activityLevel];
    const tdee = bmr * activityMultiplier;
    const targetCalories = calcTargetCalories(tdee, input.goal);

    const calculations: Calculations = {
      bmr: round(bmr),
      activityMultiplier,
      tdee: round(tdee),
      targetCalories: round(targetCalories),
    };

    const macros = calcMacros(input, calculations.targetCalories);

    const prompt = buildWorkoutPrompt(input, calculations, macros);

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You output strict JSON only." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const text = completion.choices[0]?.message?.content ?? "";

    // Validate JSON from model
    const plan = JSON.parse(text) as WorkoutPlan;

    const response: ApiResponse = { ok: true, calculations, macros, plan };
    return Response.json(response);
  } catch (err: any) {
    // zod errors look nicer
    if (err instanceof z.ZodError) {
      return Response.json({ ok: false, error: err.issues[0]?.message || "Invalid input." }, { status: 400 });
    }
    return Response.json({ ok: false, error: err?.message || "Server error" }, { status: 500 });
  }
}
