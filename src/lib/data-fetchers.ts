import { getUserIdFromSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { HabitModel } from "@/models/Habit";
import { HabitCompletionModel } from "@/models/HabitCompletion";
import { Habit, HabitCompletion } from "@/types/habit";
import { calculateHabitStreak, calculateMonthlyProgress } from "@/lib/calculations";
import { generateMonthData } from "@/lib/dates";
import { Session } from "next-auth";

export async function getInitialDashboardData(session: Session | null): Promise<{
  initialHabits: Habit[];
  initialCompletions: HabitCompletion[];
}> {
  if (!session) return { initialHabits: [], initialCompletions: [] };

  const userId = await getUserIdFromSession(session);
  if (!userId) return { initialHabits: [], initialCompletions: [] };

  try {
    await connectToDatabase();

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
    const daysInMonth = new Date(year, month, 0).getDate();
    const endDate = `${year}-${month.toString().padStart(2, "0")}-${daysInMonth.toString().padStart(2, "0")}`;

    const [habitsDocs, completionsDocs] = await Promise.all([
      HabitModel.find({ userId, isArchived: false })
        .select("_id name description icon color frequency isArchived createdAt updatedAt")
        .sort({ createdAt: 1 })
        .lean(),
      HabitCompletionModel.find({
        userId,
        date: { $gte: startDate, $lte: endDate },
      })
        .select("_id habitId date completed")
        .lean(),
    ]);

    const initialHabits: Habit[] = habitsDocs.map((h) => ({
      id: h._id.toString(),
      name: h.name,
      description: h.description || "",
      icon: h.icon,
      color: h.color,
      frequency: h.frequency,
      isArchived: h.isArchived,
      createdAt: h.createdAt.toISOString(),
      updatedAt: h.updatedAt.toISOString(),
    }));

    const initialCompletions: HabitCompletion[] = completionsDocs.map((c) => ({
      id: c._id.toString(),
      habitId: c.habitId.toString(),
      date: c.date,
      completed: c.completed,
    }));

    return { initialHabits, initialCompletions };
  } catch (error) {
    console.error("Error fetching initial dashboard data:", error);
    return { initialHabits: [], initialCompletions: [] };
  }
}

export async function getInitialAnalyticsData(session: Session | null) {
  if (!session) return null;

  const userId = await getUserIdFromSession(session);
  if (!userId) return null;

  try {
    await connectToDatabase();

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    const [habitsDocs, completionsDocs] = await Promise.all([
      HabitModel.find({ userId, isArchived: false })
        .select("_id name description icon color frequency isArchived createdAt")
        .lean(),
      HabitCompletionModel.find({ userId })
        .select("habitId date completed -_id")
        .lean(),
    ]);

    const totalHabits = habitsDocs.length;
    if (totalHabits === 0) return null;

    const completionsByHabit: Record<string, string[]> = {};
    const completionSet = new Set<string>();

    completionsDocs.forEach((c) => {
      if (c.completed) {
        const hId = c.habitId.toString();
        if (!completionsByHabit[hId]) completionsByHabit[hId] = [];
        completionsByHabit[hId].push(c.date);
        completionSet.add(`${hId}_${c.date}`);
      }
    });

    const monthData = generateMonthData(year, month, today);
    const monthDays = monthData.days;

    let maxCurrentStreak = 0;
    let maxLongestStreak = 0;

    const habitPerformance = habitsDocs.map((h) => {
      const hId = h._id.toString();
      const completedDates = completionsByHabit[hId] || [];
      const streakInfo = calculateHabitStreak(completedDates, today);

      if (streakInfo.currentStreak > maxCurrentStreak) maxCurrentStreak = streakInfo.currentStreak;
      if (streakInfo.longestStreak > maxLongestStreak) maxLongestStreak = streakInfo.longestStreak;

      const createdDateStr = h.createdAt.toISOString().split("T")[0];
      let completedInMonth = 0;
      let eligibleInMonth = 0;

      monthDays.forEach((day) => {
        if (!day.isFuture && day.date >= createdDateStr) {
          eligibleInMonth++;
          if (completionSet.has(`${hId}_${day.date}`)) completedInMonth++;
        }
      });

      const completionRate = eligibleInMonth > 0 ? Math.round((completedInMonth / eligibleInMonth) * 100) : 0;

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

    habitPerformance.sort((a, b) => b.completionRate - a.completionRate);

    const bestHabit = habitPerformance.length > 0 && habitPerformance[0].eligibleCount > 0
      ? {
          name: habitPerformance[0].name,
          icon: habitPerformance[0].icon,
          color: habitPerformance[0].color,
          rate: habitPerformance[0].completionRate,
        }
      : null;

    const habitListForCalc = habitsDocs.map((h) => ({
      id: h._id.toString(),
      createdAt: h.createdAt.toISOString(),
    }));

    const monthCompletionsFormatted = completionsDocs.map((c) => ({
      habitId: c.habitId.toString(),
      date: c.date,
      completed: c.completed,
    }));

    const { completedCheckins, eligibleCheckins, overallProgress } = calculateMonthlyProgress(
      habitListForCalc,
      monthCompletionsFormatted,
      monthDays
    );

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
      habitsDocs.forEach((h) => {
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
      return { day: dayName, completed: info.completed, eligible: info.eligible, rate };
    });

    const weeklyTrends = monthData.weeks.map((week) => {
      let completedInWeek = 0;
      let eligibleInWeek = 0;

      week.days.forEach((day) => {
        if (day.isFuture) return;
        habitsDocs.forEach((h) => {
          const hId = h._id.toString();
          const createdStr = h.createdAt.toISOString().split("T")[0];
          if (day.date >= createdStr) {
            eligibleInWeek++;
            if (completionSet.has(`${hId}_${day.date}`)) completedInWeek++;
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

    return {
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
    };
  } catch (error) {
    console.error("Error fetching initial analytics data:", error);
    return null;
  }
}
