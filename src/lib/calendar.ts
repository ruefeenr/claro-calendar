import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  parse,
  startOfMonth,
} from "date-fns";

export const CALENDAR_VISIBLE_MONTHS = 3;

export type ZurichPublicHoliday = {
  date: string;
  title: string;
};

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

function getEasterSunday(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}

export function getZurichPublicHolidays(
  startDate: Date,
  visibleMonths = CALENDAR_VISIBLE_MONTHS,
): ZurichPublicHoliday[] {
  const rangeStart = startOfMonth(startDate);
  const rangeEnd = endOfMonth(addMonths(startDate, visibleMonths - 1));
  const holidays: Array<{ date: Date; title: string }> = [];

  for (
    let year = rangeStart.getFullYear();
    year <= rangeEnd.getFullYear();
    year += 1
  ) {
    const easterSunday = getEasterSunday(year);

    holidays.push(
      { date: new Date(year, 0, 1), title: "Neujahr" },
      { date: new Date(year, 0, 2), title: "Berchtoldstag" },
      { date: addDays(easterSunday, -2), title: "Karfreitag" },
      { date: addDays(easterSunday, 1), title: "Ostermontag" },
      { date: new Date(year, 4, 1), title: "Tag der Arbeit" },
      { date: addDays(easterSunday, 39), title: "Auffahrt" },
      { date: addDays(easterSunday, 50), title: "Pfingstmontag" },
      { date: new Date(year, 7, 1), title: "Bundesfeier" },
      { date: new Date(year, 11, 25), title: "Weihnachten" },
      { date: new Date(year, 11, 26), title: "Stephanstag" },
    );
  }

  return holidays
    .filter((holiday) => holiday.date >= rangeStart && holiday.date <= rangeEnd)
    .sort((first, second) => first.date.getTime() - second.date.getTime())
    .map((holiday) => ({
      date: format(holiday.date, "yyyy-MM-dd"),
      title: holiday.title,
    }));
}

