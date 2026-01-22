"use client";

import { useMemo, useState } from "react";
import type { ApiResponse, ActivityLevel, Goal, Sex, WorkoutLevel, Equipment, WorkoutPlan } from "@/app/lib/types";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    sex: "male" as Sex,
    age: 19,
    heightCm: 163,
    weightKg: 75,
    activityLevel: "moderate" as ActivityLevel,
    goal: "fat_loss" as Goal,
    level: "beginner" as WorkoutLevel,
    daysPerWeek: 5,
    timePerSessionMin: 60,
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

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
    <main style={{ padding: 40, maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 14 }}>
        Workout + Calories Generator 💪
      </h1>

      {/* FORM */}
      <div style={{ border: "1px solid #e8e8e8", borderRadius: 14, padding: 14, display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <Field label="Sex">
            <select
              value={form.sex}
              onChange={(e) => setForm((p) => ({ ...p, sex: e.target.value as Sex }))}
              style={inputStyle}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </Field>

          <Field label="Age">
            <input
              type="number"
              value={form.age}
              onChange={(e) => setForm((p) => ({ ...p, age: Number(e.target.value) }))}
              style={inputStyle}
            />
          </Field>

          <Field label="Height (cm)">
            <input
              type="number"
              value={form.heightCm}
              onChange={(e) => setForm((p) => ({ ...p, heightCm: Number(e.target.value) }))}
              style={inputStyle}
            />
          </Field>

          <Field label="Weight (kg)">
            <input
              type="number"
              value={form.weightKg}
              onChange={(e) => setForm((p) => ({ ...p, weightKg: Number(e.target.value) }))}
              style={inputStyle}
            />
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <Field label="Activity Level">
            <select
              value={form.activityLevel}
              onChange={(e) => setForm((p) => ({ ...p, activityLevel: e.target.value as ActivityLevel }))}
              style={inputStyle}
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
              onChange={(e) => setForm((p) => ({ ...p, goal: e.target.value as Goal }))}
              style={inputStyle}
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
              onChange={(e) => setForm((p) => ({ ...p, level: e.target.value as WorkoutLevel }))}
              style={inputStyle}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </Field>

          <Field label="Days per week">
            <select
              value={form.daysPerWeek}
              onChange={(e) => setForm((p) => ({ ...p, daysPerWeek: Number(e.target.value) }))}
              style={inputStyle}
            >
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
            </select>
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          <Field label="Equipment">
            <select
              value={form.equipment}
              onChange={(e) => setForm((p) => ({ ...p, equipment: e.target.value as Equipment }))}
              style={inputStyle}
            >
              <option value="gym">Gym</option>
              <option value="home_basic">Home (dumbbells/bands)</option>
              <option value="bodyweight">Bodyweight</option>
            </select>
          </Field>

          <Field label="Time per session">
            <select
              value={form.timePerSessionMin}
              onChange={(e) => setForm((p) => ({ ...p, timePerSessionMin: Number(e.target.value) }))}
              style={inputStyle}
            >
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
              <option value={60}>60 min</option>
              <option value={75}>75 min</option>
              <option value={90}>90 min</option>
            </select>
          </Field>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={generate}
            disabled={loading}
            style={{
              padding: "10px 16px",
              background: "black",
              color: "white",
              borderRadius: 10,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.75 : 1,
            }}
          >
            {loading ? "Generating..." : "Generate"}
          </button>

          <span style={{ fontSize: 13, opacity: 0.7 }}>
            Activity: <b>{activityText}</b>
          </span>
        </div>
      </div>

      {error && <p style={{ color: "crimson", marginTop: 14 }}>{error}</p>}

      {/* OUTPUT */}
      {resp && resp.ok && (
        <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
          <div style={card}>
            <h2 style={{ margin: 0 }}>Your Numbers</h2>
            <div style={{ marginTop: 10, lineHeight: 1.6 }}>
              <div>Maintenance calories (TDEE): <b>{resp.calculations.tdee}</b> kcal/day</div>
              <div>Target calories (goal): <b>{resp.calculations.targetCalories}</b> kcal/day</div>
              <div>Protein: <b>{resp.macros.protein_g}g</b> • Carbs: <b>{resp.macros.carbs_g}g</b> • Fats: <b>{resp.macros.fats_g}g</b></div>
            </div>
          </div>

          <div style={card}>
            <h2 style={{ margin: 0 }}>{resp.plan.title}</h2>
            <p style={{ marginTop: 10 }}><b>Goal:</b> {resp.plan.overview.goalSummary}</p>
            <p><b>Weekly:</b> {resp.plan.overview.weeklyStructure}</p>
            <p><b>Progression:</b> {resp.plan.overview.progressionRule}</p>

            <div style={{ marginTop: 10 }}>
              <b>Safety:</b>
              <ul style={{ marginTop: 6 }}>
                {resp.plan.overview.safetyNotes.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
            </div>
          </div>

          {plan?.schedule.map((d) => (
            <div key={d.day} style={card}>
              <h3 style={{ marginTop: 0 }}>{d.day} — {d.focus}</h3>

              <b>Warmup</b>
              <ul style={{ marginTop: 6 }}>{d.warmup.map((x, i) => <li key={i}>{x}</li>)}</ul>

              <b>Workout</b>
              <ul style={{ marginTop: 6 }}>
                {d.workout.map((ex, i) => (
                  <li key={i}>
                    {ex.exercise} — {ex.sets} sets × {ex.reps} (rest {ex.restSec}s)
                  </li>
                ))}
              </ul>

              <b>Finisher</b>
              <ul style={{ marginTop: 6 }}>{d.finisher.map((x, i) => <li key={i}>{x}</li>)}</ul>

              <b>Cooldown</b>
              <ul style={{ marginTop: 6 }}>{d.cooldown.map((x, i) => <li key={i}>{x}</li>)}</ul>
            </div>
          ))}

          {plan?.disclaimer && <p style={{ fontSize: 12, opacity: 0.75 }}>{plan.disclaimer}</p>}
        </div>
      )}
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontWeight: 800 }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  padding: 10,
  borderRadius: 10,
  border: "1px solid #ddd",
  outline: "none",
};

const card: React.CSSProperties = {
  border: "1px solid #e8e8e8",
  borderRadius: 14,
  padding: 14,
};
