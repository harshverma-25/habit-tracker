import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, getUserIdFromSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { HabitModel } from "@/models/Habit";
import { HabitCompletionModel } from "@/models/HabitCompletion";
import { calculateHabitStreak, calculateMonthlyProgress } from "@/lib/calculations";
import { generateMonthData } from "@/lib/dates";

// GET /api/stats?year=2026&month=10 — Calculate real statistics and streaks for authenticated user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await getUserIdFromSession(session);
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const yearStr = searchParams.get("year");
    const monthStr = searchParams.get("month");

    const today = new Date();
    const year = yearStr ? parseInt(yearStr, 10) : today.getFullYear();
    const month = monthStr ? parseInt(monthStr, 10) : today.getMonth() + 1;

    await connectToDatabase();
    // 1. Fetch active habits for user
    const habits = await HabitModel.find({ userId, isArchived: false })
      .select("_id createdAt")
      .lean();
    const totalHabits = habits.length;

    // 2. Fetch completion records with field projection
    const allCompletions = await HabitCompletionModel.find({ userId })
      .select("habitId date completed -_id")
      .lean();

    // Map completions by habitId -> array of completed date strings (YYYY-MM-DD)
    const habitCompletionsMap: Record<string, string[]> = {};
    allCompletions.forEach((c) => {
      if (c.completed) {
        const hId = c.habitId.toString();
        if (!habitCompletionsMap[hId]) {
          habitCompletionsMap[hId] = [];
        }
        habitCompletionsMap[hId].push(c.date);
      }
    });

    // 3. Calculate max current streak across all active habits
    let maxCurrentStreak = 0;
    const habitStreakDetails: Record<string, { currentStreak: number; longestStreak: number }> = {};

    habits.forEach((habit) => {
      const hId = habit._id.toString();
      const dates = habitCompletionsMap[hId] || [];
      const streakInfo = calculateHabitStreak(dates, today);
      habitStreakDetails[hId] = streakInfo;

      if (streakInfo.currentStreak > maxCurrentStreak) {
        maxCurrentStreak = streakInfo.currentStreak;
      }
    });

    // 4. Calculate monthly progress for current selected month
    const monthData = generateMonthData(year, month, today);
    const monthHabits = habits.map((h) => ({
      id: h._id.toString(),
      createdAt: h.createdAt.toISOString(),
    }));

    const monthCompletionsFormatted = allCompletions.map((c) => ({
      habitId: c.habitId.toString(),
      date: c.date,
      completed: c.completed,
    }));

    const { completedCheckins, overallProgress } = calculateMonthlyProgress(
      monthHabits,
      monthCompletionsFormatted,
      monthData.days
    );

    return NextResponse.json({
      stats: {
        totalHabits,
        completedCheckins,
        currentStreak: maxCurrentStreak,
        overallProgress,
      },
      habitStreaks: habitStreakDetails,
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
