import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { HabitModel } from "@/models/Habit";
import { HabitCompletionModel } from "@/models/HabitCompletion";
import { UserModel } from "@/models/User";
import { calculateHabitStreak, calculateMonthlyProgress } from "@/lib/calculations";
import { generateMonthData } from "@/lib/dates";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const yearStr = searchParams.get("year");
    const monthStr = searchParams.get("month");

    const today = new Date();
    const year = yearStr ? parseInt(yearStr, 10) : today.getFullYear();
    const month = monthStr ? parseInt(monthStr, 10) : today.getMonth() + 1;

    await connectToDatabase();
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 1. Fetch active habits for user
    const habits = await HabitModel.find({ userId: user._id, isArchived: false }).lean();
    const totalHabits = habits.length;

    // 2. Fetch all completions for streaks
    const allCompletions = await HabitCompletionModel.find({ userId: user._id }).lean();

    // Map completions by habitId -> date strings array
    const completionsByHabit: Record<string, string[]> = {};
    const completionSet = new Set<string>(); // "habitId_date"

    allCompletions.forEach((c) => {
      if (c.completed) {
        const hId = c.habitId.toString();
        if (!completionsByHabit[hId]) {
          completionsByHabit[hId] = [];
        }
        completionsByHabit[hId].push(c.date);
        completionSet.add(`${hId}_${c.date}`);
      }
    });

    // 3. Generate Month Data for selected month
    const monthData = generateMonthData(year, month, today);
    const monthDays = monthData.days;

    // 4. Calculate Streak Details & Habit Performance
    let maxCurrentStreak = 0;
    let maxLongestStreak = 0;

    const habitPerformance = habits.map((h) => {
      const hId = h._id.toString();
      const completedDates = completionsByHabit[hId] || [];
      const streakInfo = calculateHabitStreak(completedDates, today);

      if (streakInfo.currentStreak > maxCurrentStreak) {
        maxCurrentStreak = streakInfo.currentStreak;
      }
      if (streakInfo.longestStreak > maxLongestStreak) {
        maxLongestStreak = streakInfo.longestStreak;
      }

      // Calculate monthly performance for this habit
      const createdDateStr = h.createdAt.toISOString().split("T")[0];
      let completedInMonth = 0;
      let eligibleInMonth = 0;

      monthDays.forEach((day) => {
        if (!day.isFuture && day.date >= createdDateStr) {
          eligibleInMonth++;
          if (completionSet.has(`${hId}_${day.date}`)) {
            completedInMonth++;
          }
        }
      });

      const completionRate =
        eligibleInMonth > 0 ? Math.round((completedInMonth / eligibleInMonth) * 100) : 0;

      return {
        id: hId,
        name: h.name,
        description: h.description || "",
        icon: h.icon || "📖",
        color: h.color || "bg-blue-500/20 text-blue-400 border-blue-500/30",
        completedCount: completedInMonth,
        eligibleCount: eligibleInMonth,
        completionRate,
        currentStreak: streakInfo.currentStreak,
        longestStreak: streakInfo.longestStreak,
      };
    });

    // Sort habits by highest completion rate first
    habitPerformance.sort((a, b) => b.completionRate - a.completionRate);

    // Best habit
    const bestHabit = habitPerformance.length > 0 && habitPerformance[0].eligibleCount > 0
      ? {
          name: habitPerformance[0].name,
          icon: habitPerformance[0].icon,
          color: habitPerformance[0].color,
          rate: habitPerformance[0].completionRate,
        }
      : null;

    // 5. Monthly Progress calculation
    const habitListForCalc = habits.map((h) => ({
      id: h._id.toString(),
      createdAt: h.createdAt.toISOString(),
    }));
    const monthCompletionsFormatted = allCompletions.map((c) => ({
      habitId: c.habitId.toString(),
      date: c.date,
      completed: c.completed,
    }));

    const { completedCheckins, eligibleCheckins, overallProgress } = calculateMonthlyProgress(
      habitListForCalc,
      monthCompletionsFormatted,
      monthDays
    );

    // 6. Day-of-week breakdown (Mon, Tue, Wed, Thu, Fri, Sat, Sun)
    const dayOfWeekMap: Record<string, { name: string; completed: number; eligible: number }> = {
      Mon: { name: "Mon", completed: 0, eligible: 0 },
      Tue: { name: "Tue", completed: 0, eligible: 0 },
      Wed: { name: "Wed", completed: 0, eligible: 0 },
      Thu: { name: "Thu", completed: 0, eligible: 0 },
      Fri: { name: "Fri", completed: 0, eligible: 0 },
      Sat: { name: "Sat", completed: 0, eligible: 0 },
      Sun: { name: "Sun", completed: 0, eligible: 0 },
    };

    monthDays.forEach((day) => {
      if (day.isFuture) return;
      habits.forEach((h) => {
        const hId = h._id.toString();
        const createdStr = h.createdAt.toISOString().split("T")[0];
        if (day.date >= createdStr) {
          if (dayOfWeekMap[day.dayName]) {
            dayOfWeekMap[day.dayName].eligible++;
            if (completionSet.has(`${hId}_${day.date}`)) {
              dayOfWeekMap[day.dayName].completed++;
            }
          }
        }
      });
    });

    const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weeklyBreakdown = dayOrder.map((dayName) => {
      const info = dayOfWeekMap[dayName] || { name: dayName, completed: 0, eligible: 0 };
      const rate = info.eligible > 0 ? Math.round((info.completed / info.eligible) * 100) : 0;
      return {
        day: dayName,
        completed: info.completed,
        eligible: info.eligible,
        rate,
      };
    });

    // 7. Weekly trends (Week 1, Week 2, etc.)
    const weeklyTrends = monthData.weeks.map((week) => {
      let completedInWeek = 0;
      let eligibleInWeek = 0;

      week.days.forEach((day) => {
        if (day.isFuture) return;
        habits.forEach((h) => {
          const hId = h._id.toString();
          const createdStr = h.createdAt.toISOString().split("T")[0];
          if (day.date >= createdStr) {
            eligibleInWeek++;
            if (completionSet.has(`${hId}_${day.date}`)) {
              completedInWeek++;
            }
          }
        });
      });

      const rate = eligibleInWeek > 0 ? Math.round((completedInWeek / eligibleInWeek) * 100) : 0;

      return {
        weekLabel: week.label,
        weekNumber: week.weekNumber,
        completed: completedInWeek,
        eligible: eligibleInWeek,
        rate,
      };
    });

    return NextResponse.json({
      selectedMonth: { year, month, monthName: monthData.monthName },
      overallStats: {
        totalHabits,
        completedCheckins,
        eligibleCheckins,
        overallProgress,
        currentStreak: maxCurrentStreak,
        longestStreak: maxLongestStreak,
        bestHabit,
      },
      weeklyBreakdown,
      weeklyTrends,
      habitPerformance,
    });
  } catch (error) {
    console.error("GET /api/analytics error:", error);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
