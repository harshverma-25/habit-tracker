import { describe, it, expect } from "vitest";
import { calculateHabitStreak, calculateMonthlyProgress } from "../src/lib/calculations";

describe("Streak Calculations", () => {
  const refDate = new Date(2026, 9, 1); // October 1, 2026

  it("returns 0 for empty completion history", () => {
    const result = calculateHabitStreak([], refDate);
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(0);
  });

  it("calculates consecutive days up to today", () => {
    const completions = ["2026-09-29", "2026-09-30", "2026-10-01"];
    const result = calculateHabitStreak(completions, refDate);
    expect(result.currentStreak).toBe(3);
    expect(result.longestStreak).toBe(3);
  });

  it("handles incomplete today when yesterday was completed", () => {
    // Today (2026-10-01) not done yet, but yesterday (2026-09-30) was done
    const completions = ["2026-09-28", "2026-09-29", "2026-09-30"];
    const result = calculateHabitStreak(completions, refDate);
    expect(result.currentStreak).toBe(3);
    expect(result.longestStreak).toBe(3);
  });

  it("resets current streak when a day before yesterday was missed", () => {
    // Missed 2026-09-30, completed 2026-10-01
    const completions = ["2026-09-28", "2026-09-29", "2026-10-01"];
    const result = calculateHabitStreak(completions, refDate);
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(2);
  });

  it("handles month boundary correctly across September to October", () => {
    const completions = [
      "2026-09-27",
      "2026-09-28",
      "2026-09-29",
      "2026-09-30",
      "2026-10-01",
    ];
    const result = calculateHabitStreak(completions, refDate);
    expect(result.currentStreak).toBe(5);
    expect(result.longestStreak).toBe(5);
  });

  it("correctly identifies longest streak in past history", () => {
    const completions = [
      "2026-08-01",
      "2026-08-02",
      "2026-08-03",
      "2026-08-04",
      "2026-08-05", // 5 days
      "2026-09-30",
      "2026-10-01", // 2 days current
    ];
    const result = calculateHabitStreak(completions, refDate);
    expect(result.currentStreak).toBe(2);
    expect(result.longestStreak).toBe(5);
  });
});

describe("Monthly Progress Calculations", () => {
  it("excludes future dates and dates prior to habit creation", () => {
    const habits = [
      { id: "h1", createdAt: "2026-10-01T00:00:00Z" },
    ];
    const monthDays = [
      { date: "2026-10-01", isFuture: false },
      { date: "2026-10-02", isFuture: true },
      { date: "2026-10-03", isFuture: true },
    ];
    const completions = [{ habitId: "h1", date: "2026-10-01", completed: true }];

    const result = calculateMonthlyProgress(habits, completions, monthDays);
    expect(result.completedCheckins).toBe(1);
    expect(result.eligibleCheckins).toBe(1);
    expect(result.overallProgress).toBe(100);
  });
});
