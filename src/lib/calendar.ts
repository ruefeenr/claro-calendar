import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parse,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import type { Stay } from "@/lib/types";

export function parseMonthParam(month: string | undefined) {
  if (!month) {
    return startOfMonth(new Date());
  }

  const parsed = parse(month, "yyyy-MM", new Date());
  if (Number.isNaN(parsed.getTime())) {
    return startOfMonth(new Date());
  }

  return startOfMonth(parsed);
}

export function formatMonthParam(date: Date) {
  return format(date, "yyyy-MM");
}

export function buildMonthGrid(month: Date) {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  const days: Date[] = [];

  for (let day = start; day <= end; day = addDays(day, 1)) {
    days.push(day);
  }

  return days;
}

export function stayTouchesDay(stay: Stay, day: Date) {
  const start = new Date(`${stay.start_date}T00:00:00`);
  const end = new Date(`${stay.end_date}T00:00:00`);
  return day >= start && day <= end;
}

export function isToday(date: Date) {
  return isSameDay(date, new Date());
}

export function isCurrentMonth(date: Date, month: Date) {
  return isSameMonth(date, month);
}
