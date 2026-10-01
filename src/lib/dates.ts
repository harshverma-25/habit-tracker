import { MonthData, DayInfo, WeekGroup } from "@/types/habit";

/**
  Check if a year is a leap year.
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
  Get total number of days in a given month of a year.
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
  Format a date object or components into ISO YYYY-MM-DD string.
 */
export function formatDateString(year: number, month: number, day: number): string {
  const m = month.toString().padStart(2, "0");
  const d = day.toString().padStart(2, "0");
  return `${year}-${m}-${d}`;
}

/**
  Get short day name (Sun, Mon, Tue, etc.) for a date.
 */
export function getDayName(year: number, month: number, day: number): string {
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

/**
  Get full month name (January, February, etc.).
 */
export function getMonthName(month: number): string {
  const date = new Date(2026, month - 1, 1);
  return date.toLocaleDateString("en-US", { month: "long" });
}

/**
  Centralized rule to determine if a given date string is in the future relative to Today.
 */
export function isFutureDate(dateStr: string, referenceDate: Date = new Date()): boolean {
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);

  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  return target.getTime() > today.getTime();
}

/**
  Centralized rule to determine if a date is Today.
 */
export function isTodayDate(dateStr: string, referenceDate: Date = new Date()): boolean {
  const todayStr = formatDateString(
    referenceDate.getFullYear(),
    referenceDate.getMonth() + 1,
    referenceDate.getDate()
  );
  return dateStr === todayStr;
}

/**
  Dynamic Calendar Month Generator
  Builds MonthData with total days, day info, and Week 1..5 grouping for any year & month.
 */
export function generateMonthData(
  year: number,
  month: number,
  referenceDate: Date = new Date()
): MonthData {
  const totalDays = getDaysInMonth(year, month);
  const monthName = getMonthName(month);

  const days: DayInfo[] = [];
  const weekMap: { [key: number]: DayInfo[] } = {};

  for (let d = 1; d <= totalDays; d++) {
    const dateStr = formatDateString(year, month, d);
    const dayName = getDayName(year, month, d);
    const isToday = isTodayDate(dateStr, referenceDate);
    const isFuture = isFutureDate(dateStr, referenceDate);

    // Dynamic Week grouping:
    // Group days into Week 1 (days 1-7), Week 2 (days 8-14), Week 3 (days 15-21), Week 4 (days 22-28), Week 5 (29+)
    const weekNumber = Math.min(5, Math.ceil(d / 7));

    const dayObj: DayInfo = {
      date: dateStr,
      dayNumber: d,
      dayName,
      weekNumber,
      isToday,
      isFuture,
    };

    days.push(dayObj);

    if (!weekMap[weekNumber]) {
      weekMap[weekNumber] = [];
    }
    weekMap[weekNumber].push(dayObj);
  }

  const weeks: WeekGroup[] = Object.keys(weekMap)
    .sort((a, b) => Number(a) - Number(b))
    .map((wNumStr) => {
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
