import { formatDateString } from "./dates";

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
}

/**
  Parse a YYYY-MM-DD string into a Local midnight Date object to eliminate timezone skew.
 */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

/**
  Subtract N days from a Date object safely in local time.
 */
export function subtractDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

/**
  Calculate Current and Longest Streak for a habit based on completed date strings (YYYY-MM-DD).
  - referenceDate: Today's date (defaults to current system time or passed date).
 */
export function calculateHabitStreak(
  completedDates: string[],
  referenceDate: Date = new Date()
): StreakResult {
  if (!completedDates || completedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Create set of unique completed YYYY-MM-DD strings
  const completedSet = new Set(completedDates);

  // Normalize referenceDate (Today) to YYYY-MM-DD
  const todayStr = formatDateString(
    referenceDate.getFullYear(),
    referenceDate.getMonth() + 1,
    referenceDate.getDate()
  );

  // 1. Calculate Current Streak:
  // Check if Today is completed. If not completed today, streak can still continue if Yesterday was completed.
  let currentStreak = 0;
  let checkDate = parseLocalDate(todayStr);

  // If today is NOT completed, check if yesterday was completed
  const isTodayCompleted = completedSet.has(todayStr);
  if (!isTodayCompleted) {
    checkDate = subtractDays(checkDate, 1);
  }

  // Count backwards day-by-day as long as the date exists in completedSet
  while (true) {
    const dStr = formatDateString(
      checkDate.getFullYear(),
      checkDate.getMonth() + 1,
      checkDate.getDate()
    );

    if (completedSet.has(dStr)) {
      currentStreak++;
      checkDate = subtractDays(checkDate, 1);
    } else {
      break;
    }
  }

  // 2. Calculate Longest Streak across all completion history:
  // Sort all unique completed date objects chronologically
  const sortedDates = Array.from(completedSet)
    .map((dStr) => parseLocalDate(dStr))
    .sort((a, b) => a.getTime() - b.getTime());

  let longestStreak = 0;
  let tempStreak = 0;
  let prevTime: number | null = null;

  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  for (const dateObj of sortedDates) {
    const time = dateObj.getTime();

    if (prevTime === null) {
      tempStreak = 1;
    } else {
      const diffDays = Math.round((time - prevTime) / ONE_DAY_MS);
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }

    prevTime = time;
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  return {
    currentStreak,
    longestStreak,
  };
}

/**
  Calculate Overall Monthly Progress Percentage:
  Completed Checkins / Eligible Checkins * 100
  - Excludes future dates from eligible count
  - Excludes days prior to habit createdAt timestamp
 */
export function calculateMonthlyProgress(
  habits: { id: string; createdAt: string }[],
  completions: { habitId: string; date: string; completed: boolean }[],
  monthDays: { date: string; isFuture: boolean }[]
): { completedCheckins: number; eligibleCheckins: number; overallProgress: number } {
  const activeHabits = habits;
  if (!activeHabits || activeHabits.length === 0 || !monthDays || monthDays.length === 0) {
    return { completedCheckins: 0, eligibleCheckins: 0, overallProgress: 0 };
  }

  // Filter valid completed check-ins within the selected month
  const monthDateSet = new Set(monthDays.map((d) => d.date));
  const completedCheckins = completions.filter(
    (c) => c.completed && monthDateSet.has(c.date)
  ).length;

  let eligibleCheckins = 0;

  // Calculate eligible check-in slots
  for (const habit of activeHabits) {
    const habitCreatedDateStr = habit.createdAt.split("T")[0];

    for (const day of monthDays) {
      // Exclude future dates
      if (day.isFuture) continue;

      // Exclude days before habit creation date
      if (day.date < habitCreatedDateStr) continue;

      eligibleCheckins++;
    }
  }

  const overallProgress =
    eligibleCheckins > 0 ? Math.round((completedCheckins / eligibleCheckins) * 100) : 0;

  return {
    completedCheckins,
    eligibleCheckins,
    overallProgress,
  };
}
