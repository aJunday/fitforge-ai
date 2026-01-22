"use client";

import { useMemo, useState } from "react";
import type {
  ApiResponse,
  ActivityLevel,
  Goal,
  Sex,
  WorkoutLevel,
  Equipment,
  WorkoutPlan,
} from "@/app/lib/types";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Store numeric inputs as STRINGS to avoid "020" / auto-zero glitches
  const [form, setForm] = useState({
    sex: "male" as Sex,
    age: "19",
    heightCm: "163",
    weightKg: "75",
    goalWeightKg: "70",
    activityLevel: "moderate" as ActivityLevel,
    goal: "fat_loss" as Goal,
    level: "beginner" as WorkoutLevel,
    daysPerWeek: "5",
    timePerSessionMin: "60",
    equipment: "gym" as Equipment,
  });

  const activityText = useMemo(() => {
    const map: Record<ActivityLevel, string> = {
      sedentary: "Sedentary (little/no exercise)",
      light: "Light (1–3 days/wk)",
      moderate: "Moderate (3–5 days/wk)",
      very_active: "Very active (6–7 days/wk)",
      athlete: "Athlete (hard training/job)",
    };
    return map[form.activityLevel];
  }, [form.activityLevel]);

  async function generate() {
    setLoading(true);
    setError(null);
    setResp(null);

    const payload = {
      ...form,
      age: Number(form.age),
      heightCm: Number(form.heightCm),
      weightKg: Number(form.weightKg),
      goalWeightKg: Number(form.goalWeightKg),
      daysPerWeek: Number(form.daysPerWeek),
      timePerSessionMin: Number(form.timePerSessionMin),
    };

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = (await res.json()) as ApiResponse;

      if (!json.ok) {
        setError(json.error);
        return;
      }

      setResp(json);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const plan: WorkoutPlan | null = resp && resp.ok ? resp.plan : null;

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          Workout <span className="text-accent">+</span> Calories Generator 💪
        </h1>

        {/* FORM */}
        <div className="glass p-6 grid gap-6">
          {/* Row 1 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
            }}
          >
            <Field label="Sex">
              <select
                value={form.sex}
                onChange={(e) =>
                  setForm((p) => ({ ...p, sex: e.target.value as Sex }))
                }
                style={inputStyleDark}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </Field>

            <Field label="Age">
              <input
                type="number"
                value={form.age}
                onChange={(e) =>
                  setForm((p) => ({ ...p, age: e.target.value }))
                }
                style={inputStyleDark}
              />
            </Field>

            <Field label="Height (cm)">
              <input
                type="number"
                value={form.heightCm}
                onChange={(e) =>
                  setForm((p) => ({ ...p, heightCm: e.target.value }))
                }
                style={inputStyleDark}
              />
            </Field>

            <Field label="Weight (kg)">
              <input
                type="number"
                value={form.weightKg}
                onChange={(e) =>
                  setForm((p) => ({ ...p, weightKg: e.target.value }))
                }
                style={inputStyleDark}
              />
            </Field>
          </div>

          {/* Row 2 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 16,
            }}
          >
            <Field label="Goal Weight (kg)">
              <input
                type="number"
                value={form.goalWeightKg}
                onChange={(e) =>
                  setForm((p) => ({ ...p, goalWeightKg: e.target.value }))
                }
                style={inputStyleDark}
              />
            </Field>
            <div />
          </div>

          {/* Row 3 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
            }}
          >
            <Field label="Daily activity (outside workouts)">
              <select
                value={form.activityLevel}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    activityLevel: e.target.value as ActivityLevel,
                  }))
                }
                style={inputStyleDark}
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="very_active">Very active</option>
                <option value="athlete">Athlete</option>
              </select>
            </Field>

            <Field label="Goal">
              <select
                value={form.goal}
                onChange={(e) =>
                  setForm((p) => ({ ...p, goal: e.target.value as Goal }))
                }
                style={inputStyleDark}
              >
                <option value="fat_loss">Fat loss</option>
                <option value="muscle_gain">Muscle gain</option>
                <option value="recomp">Recomp</option>
                <option value="strength">Strength</option>
                <option value="general_fitness">General fitness</option>
              </select>
            </Field>

            <Field label="Level">
              <select
                value={form.level}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    level: e.target.value as WorkoutLevel,
                  }))
                }
                style={inputStyleDark}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </Field>

            <Field label="Workout days per week">
              <select
                value={form.daysPerWeek}
                onChange={(e) =>
                  setForm((p) => ({ ...p, daysPerWeek: e.target.value }))
                }
                style={inputStyleDark}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </Field>
          </div>

          {/* Row 4 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 16,
            }}
          >
            <Field label="Equipment">
              <select
                value={form.equipment}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    equipment: e.target.value as Equipment,
                  }))
                }
                style={inputStyleDark}
              >
                <option value="gym">Gym</option>
                <option value="home_basic">Home (dumbbells/bands)</option>
                <option value="bodyweight">Bodyweight</option>
              </select>
            </Field>

            <Field label="Time per session">
              <select
                value={form.timePerSessionMin}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    timePerSessionMin: e.target.value,
                  }))
                }
                style={inputStyleDark}
              >
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min</option>
                <option value="75">75 min</option>
                <option value="90">90 min</option>
                <option value="120">120 min</option>
              </select>
            </Field>
          </div>

          <div className="flex gap-3 items-center flex-wrap">
            <button
              onClick={generate}
              disabled={loading}
              className="btn-glow px-7 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "Generate"}
            </button>

            <span className="text-sm opacity-80">
              Activity: <b>{activityText}</b>
            </span>
          </div>
        </div>

        {error && <p className="text-red-400 mt-4">{error}</p>}

        {/* OUTPUT */}
        {resp && resp.ok && (
          <div className="mt-6 grid gap-4 animate-fade-up">
            <div className="glass p-5">
              <h2 className="text-xl font-extrabold text-yellow-300 m-0">
                Your Numbers
              </h2>
              <div className="mt-3 leading-7">
                <div>
                  Maintenance calories (TDEE):{" "}
                  <b className="text-white">{resp.calculations.tdee}</b>{" "}
                  kcal/day
                </div>
                <div>
                  Target calories (goal):{" "}
                  <b className="text-white">
                    {resp.calculations.targetCalories}
                  </b>{" "}
                  kcal/day
                </div>
                <div>
                  Protein: <b className="text-white">{resp.macros.protein_g}g</b>{" "}
                  • Carbs: <b className="text-white">{resp.macros.carbs_g}g</b>{" "}
                  • Fats: <b className="text-white">{resp.macros.fats_g}g</b>
                </div>
                <div className="mt-2">
                  Goal weight:{" "}
                  <b className="text-white">{form.goalWeightKg} kg</b>
                </div>
              </div>
            </div>

            <div className="glass p-5">
              <h2 className="text-xl font-extrabold text-yellow-300 m-0">
                {resp.plan.title}
              </h2>
              <p className="mt-3">
                <b className="text-yellow-300">Goal:</b>{" "}
                {resp.plan.overview.goalSummary}
              </p>
              <p>
                <b className="text-yellow-300">Weekly:</b>{" "}
                {resp.plan.overview.weeklyStructure}
              </p>
              <p>
                <b className="text-yellow-300">Progression:</b>{" "}
                {resp.plan.overview.progressionRule}
              </p>

              <div className="mt-3">
                <b className="text-yellow-300">Safety:</b>
                <ul className="mt-2 list-disc pl-6">
                  {resp.plan.overview.safetyNotes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>
            </div>

            {plan?.schedule.map((d) => (
  <div key={d.day} className="glass p-5">
    <h3 className="text-lg font-extrabold text-yellow-300 mt-0">
      {d.day} — {d.focus}
    </h3>

    {d.focus === "Rest Day" ? (
      <>
        <p className="opacity-90 mt-2">
          Recovery day — let your body adapt. Keep it light and stay consistent.
        </p>

        <b className="text-yellow-300">Optional recovery</b>
        <ul className="mt-2 list-disc pl-6">
          <li>5–10 min easy walk</li>
          <li>Mobility 10 min</li>
          <li>Light stretching 5–10 min</li>
        </ul>
      </>
    ) : (
      <>
        <b className="text-yellow-300">Warmup</b>
        <ul className="mt-2 list-disc pl-6">
          {d.warmup.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>

        <b className="text-yellow-300">Workout</b>
        <ul className="mt-2 list-disc pl-6">
          {d.workout.map((ex, i) => (
            <li key={i}>
              {ex.exercise} — {ex.sets} sets × {ex.reps} (rest {ex.restSec}s)
            </li>
          ))}
        </ul>

        <b className="text-yellow-300">Finisher</b>
        <ul className="mt-2 list-disc pl-6">
          {d.finisher.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>

        <b className="text-yellow-300">Cooldown</b>
        <ul className="mt-2 list-disc pl-6">
          {d.cooldown.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      </>
    )}
  </div>
))}


            {plan?.disclaimer && (
              <p className="text-xs opacity-70 mt-2">{plan.disclaimer}</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontWeight: 900, color: "#fde047" }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyleDark: React.CSSProperties = {
  padding: 10,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.20)",
  background: "rgba(255,255,255,0.04)",
  color: "white",
  outline: "none",
};
