export interface Habit {
  id: string;
  userId?: string;
  name: string;
  description?: string;
  icon: string; // Lucide icon name or emoji string
  color: string; // Tailored color badge hex or CSS class
  frequency: "daily";
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  userId?: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export interface DayInfo {
  date: string; // YYYY-MM-DD
  dayNumber: number;
  dayName: string; // Thu, Fri, etc.
  weekNumber: number; // 1 to 5
  isToday: boolean;
  isFuture: boolean;
}

export interface WeekGroup {
  weekNumber: number;
  label: string; // e.g. "WEEK 1"
  days: DayInfo[];
}

export interface MonthData {
  year: number;
  month: number; // 1-12
  monthName: string; // "October"
  totalDays: number;
  weeks: WeekGroup[];
  days: DayInfo[];
}

export interface HabitStats {
  totalHabits: number;
  completedCheckins: number;
  currentStreak: number;
  overallProgress: number; // Percentage 0-100
}
