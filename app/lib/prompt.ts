import type { WorkoutInput, Calculations, MacroSplit } from "./types";

export function buildWorkoutPrompt(
  input: WorkoutInput,
  calculations: Calculations,
  macros: MacroSplit
) {
  return `
You are a fitness coach. Create a workout plan that strictly matches the user inputs.

USER INPUTS
- Sex: ${input.sex}
- Age: ${input.age}
- Height: ${input.heightCm} cm
- Weight: ${input.weightKg} kg
- Activity Level: ${input.activityLevel}
- Goal: ${input.goal}
- Training Level: ${input.level}
- Days per week: ${input.daysPerWeek}
- Time per session: ${input.timePerSessionMin} min
- Equipment: ${input.equipment}

DETERMINISTIC CALCULATIONS (do NOT change these numbers)
- BMR: ${calculations.bmr}
- Activity multiplier: ${calculations.activityMultiplier}
- Maintenance calories (TDEE): ${calculations.tdee}
- Target calories: ${calculations.targetCalories}
- Macros (grams): protein ${macros.protein_g}g, carbs ${macros.carbs_g}g, fats ${macros.fats_g}g

OUTPUT REQUIREMENTS
Return ONLY valid JSON matching this shape:
{
  "title": string,
  "overview": {
    "goalSummary": string,
    "weeklyStructure": string,
    "progressionRule": string,
    "safetyNotes": string[]
  },
  "schedule": [
    {
      "day": "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday",
      "focus": string,
      "warmup": string[],
      "workout": [{"exercise": string, "sets": number, "reps": string, "restSec": number}],
      "finisher": string[],
      "cooldown": string[]
    }
  ],
  "cardio": {"frequencyPerWeek": number, "sessions": string[]} (optional),
  "nextSteps": string[],
  "disclaimer": string
}

RULES
- The plan MUST reflect the goal:
  - fat_loss: include cardio 2–4x/week, strength full-body or upper/lower.
  - muscle_gain: prioritize progressive overload; cardio minimal.
  - recomp: balanced strength + moderate cardio.
  - strength: lower reps, higher rest, main lifts.
  - general_fitness: mix strength + cardio + mobility.
- Use equipment constraint (gym/home_basic/bodyweight).
- Fit inside the time limit.
- Use exactly ${input.daysPerWeek} workout days (not more, not less).
- Do not mention calories/macros in the plan JSON (we show those separately in UI).
`;
}
