import { Habit, HabitCompletion, MonthData, HabitStats, DayInfo, WeekGroup } from "@/types/habit";

export const TODAY_DATE_STR = "2026-10-01"; // October 1, 2026

export const MOCK_HABITS: Habit[] = [
  {
    id: "habit-1",
    name: "Read a book",
    description: "Read 20 pages of non-fiction",
    icon: "📖",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    frequency: "daily",
    isArchived: false,
    createdAt: "2026-09-01T00:00:00Z",
    updatedAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "habit-2",
    name: "Coding / Side Project",
    description: "Work on habit-tracker app features",
    icon: "💻",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    frequency: "daily",
    isArchived: false,
    createdAt: "2026-09-01T00:00:00Z",
    updatedAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "habit-3",
    name: "Exercise & Workout",
    description: "30 mins cardio or strength session",
    icon: "🏃",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    frequency: "daily",
    isArchived: false,
    createdAt: "2026-09-01T00:00:00Z",
    updatedAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "habit-4",
    name: "Mindful Meditation",
    description: "10 mins breathing & focus",
    icon: "🧘",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    frequency: "daily",
    isArchived: false,
    createdAt: "2026-09-01T00:00:00Z",
    updatedAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "habit-5",
    name: "Drink 2.5L Water",
    description: "Stay hydrated throughout the day",
    icon: "💧",
    color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    frequency: "daily",
    isArchived: false,
    createdAt: "2026-09-01T00:00:00Z",
    updatedAt: "2026-09-01T00:00:00Z",
  },
];

// Generate dynamic October 2026 Month prototype matching PRD guidelines
export function getOctober2026MonthData(): MonthData {
  const year = 2026;
  const month = 10;
  const monthName = "October";
  const totalDays = 31;
  const dayNames = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];

  const days: DayInfo[] = [];
  const weekMap: { [key: number]: DayInfo[] } = { 1: [], 2: [], 3: [], 4: [], 5: [] };

  for (let d = 1; d <= totalDays; d++) {
    const dayName = dayNames[(d - 1) % 7];
    const dateStr = `2026-10-${d.toString().padStart(2, "0")}`;
    const isToday = d === 1;
    const isFuture = d > 1;

    // Week calculation according to PRD week 1-5 layout
    let weekNumber = 1;
    if (d <= 3) weekNumber = 1; // Oct 1-3 (Thu, Fri, Sat)
    else if (d <= 10) weekNumber = 2; // Oct 4-10
    else if (d <= 17) weekNumber = 3; // Oct 11-17
    else if (d <= 24) weekNumber = 4; // Oct 18-24
    else weekNumber = 5; // Oct 25-31

    const dayObj: DayInfo = {
      date: dateStr,
      dayNumber: d,
      dayName,
      weekNumber,
      isToday,
      isFuture,
    };

    days.push(dayObj);
    weekMap[weekNumber].push(dayObj);
  }

  const weeks: WeekGroup[] = Object.keys(weekMap).map((wNumStr) => {
    const wNum = Number(wNumStr);
    return {
      weekNumber: wNum,
      label: `WEEK ${wNum}`,
      days: weekMap[wNum],
    };
  });

  return {
    year,
    month,
    monthName,
    totalDays,
    weeks,
    days,
  };
}

// Initial mock completions for October 2026 prototype
export const INITIAL_MOCK_COMPLETIONS: HabitCompletion[] = [
  // Habit 1 (Reading)
  { id: "c1-1", habitId: "habit-1", date: "2026-10-01", completed: true },
  
  // Habit 2 (Coding)
  { id: "c2-1", habitId: "habit-2", date: "2026-10-01", completed: true },

  // Habit 3 (Exercise)
  { id: "c3-1", habitId: "habit-3", date: "2026-10-01", completed: false },

  // Habit 4 (Meditation)
  { id: "c4-1", habitId: "habit-4", date: "2026-10-01", completed: true },

  // Habit 5 (Water)
  { id: "c5-1", habitId: "habit-5", date: "2026-10-01", completed: true },
];

export const MOCK_STATS: HabitStats = {
  totalHabits: 5,
  completedCheckins: 4,
  currentStreak: 12,
  overallProgress: 80,
};
