"use client";

import { useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import deLocale from "@fullcalendar/core/locales/de";
import type { EventContentArg } from "@fullcalendar/core";
import type { DateClickArg, DateSelectArg } from "@fullcalendar/interaction";
import { addDays, format, subDays } from "date-fns";

import { CALENDAR_VISIBLE_MONTHS, getZurichPublicHolidays } from "@/lib/calendar";
import { withCalendarAlpha } from "@/lib/colors";
import { formatRoomNames, getCapacityWarning } from "@/lib/rooms";
import type { Stay } from "@/lib/types";

type FamilyFullCalendarProps = {
  month: string;
  stays: Stay[];
  onCreateRange: (startDate: string, endDate: string) => void;
  onEditStay: (stayId: string) => void;
  onVisibleMonthChange?: (month: string) => void;
};

function renderEventContent(eventInfo: EventContentArg) {
  if (eventInfo.event.extendedProps.eventKind === "holiday") {
    return (
      <div className="claro-event-content claro-holiday-content">
        <div className="claro-event-title">{eventInfo.event.title}</div>
      </div>
    );
  }

  const participants = (eventInfo.event.extendedProps.participants ?? []) as string[];
  const participantAvatars = (eventInfo.event.extendedProps.participantAvatars ??
    []) as string[];
  const participantSummary = participants.map((participant, index) => {
    const avatar = participantAvatars[index];
    return avatar ? `${avatar} ${participant}` : participant;
  });
  const guestCount = eventInfo.event.extendedProps.guestCount as number;
  const roomNames = eventInfo.event.extendedProps.roomNames as string;
  const capacityWarning = eventInfo.event.extendedProps.capacityWarning as
    | string
    | null;

  return (
    <div className="claro-event-content">
      <div className="claro-event-title">{eventInfo.event.title}</div>
      {participantSummary.length ? (
        <div className="claro-event-meta">{participantSummary.join(", ")}</div>
      ) : null}
      <div className="claro-event-meta">
        {guestCount} Pers.
        {roomNames ? ` · ${roomNames}` : ""}
      </div>
      {capacityWarning ? (
        <div className="claro-event-warning">Kapazität überschritten</div>
      ) : null}
    </div>
  );
}

export function FamilyFullCalendar({
  month,
  stays,
  onCreateRange,
  onEditStay,
  onVisibleMonthChange,
}: FamilyFullCalendarProps) {
  const calendarRef = useRef<HTMLDivElement>(null);
  const monthDate = new Date(`${month}T00:00:00`);
  const stayEvents = stays.map((stay) => {
    const eventColor = withCalendarAlpha(
      stay.participants[0]?.display_color ?? "#57534e",
    );
    const roomNames = formatRoomNames(stay.room_ids);
    const capacityWarning = getCapacityWarning(stay.guest_count, stay.room_ids);

    return {
      id: stay.id,
      title: stay.title,
      start: stay.start_date,
      end: format(addDays(new Date(`${stay.end_date}T00:00:00`), 1), "yyyy-MM-dd"),
      allDay: true,
      backgroundColor: eventColor,
      borderColor: eventColor,
      textColor: "#1c1917",
      extendedProps: {
        eventKind: "stay",
        participants: stay.participants.map((participant) => participant.full_name),
        participantAvatars: stay.participants.map(
          (participant) => participant.avatar_emoji,
        ),
        capacityWarning,
        guestCount: stay.guest_count,
        note: stay.note,
        roomNames,
      },
    };
  });
  const holidayEvents = getZurichPublicHolidays(monthDate).map((holiday) => ({
    id: `zurich-holiday-${holiday.date}`,
    title: holiday.title,
    start: holiday.date,
    allDay: true,
    classNames: ["claro-holiday-event"],
    display: "block",
    editable: false,
    extendedProps: {
      eventKind: "holiday",
    },
  }));
  const events = [...holidayEvents, ...stayEvents];

  function handleDateClick(info: DateClickArg) {
    onCreateRange(info.dateStr, info.dateStr);
  }

  function handleDateSelect(info: DateSelectArg) {
    onCreateRange(
      info.startStr,
      format(subDays(new Date(info.endStr), 1), "yyyy-MM-dd"),
    );
    info.view.calendar.unselect();
  }

  function handleEventClick(info: {
    event: { id: string; extendedProps: Record<string, unknown> };
  }) {
    if (info.event.extendedProps.eventKind === "holiday") {
      return;
    }

    onEditStay(info.event.id);
  }

  useEffect(() => {
    if (!onVisibleMonthChange) {
      return;
    }

    const notifyVisibleMonthChange = onVisibleMonthChange;
    let animationFrame: number | null = null;

    function updateVisibleMonth() {
      const calendarElement = calendarRef.current;

      if (!calendarElement) {
        return;
      }

      const stickyHeader = document.querySelector<HTMLElement>(
        "[data-calendar-sticky-header]",
      );
      const headerBottom = stickyHeader?.getBoundingClientRect().bottom ?? 0;
      const anchorY = headerBottom + 16;
      const dayCells = Array.from(
        calendarElement.querySelectorAll<HTMLElement>(".fc-daygrid-day[data-date]"),
      );
      const firstVisibleCell = dayCells.find(
        (cell) => cell.getBoundingClientRect().bottom >= anchorY,
      );

      if (!firstVisibleCell) {
        return;
      }

      const rowTop = firstVisibleCell.getBoundingClientRect().top;
      const rowCells = dayCells.filter(
        (cell) => Math.abs(cell.getBoundingClientRect().top - rowTop) < 4,
      );
      const monthStartCell = rowCells.find((cell) =>
        cell.dataset.date?.endsWith("-01"),
      );
      const representativeCell =
        monthStartCell ?? rowCells[Math.floor(rowCells.length / 2)] ?? firstVisibleCell;
      const activeDate = representativeCell.dataset.date;

      if (activeDate) {
        notifyVisibleMonthChange(activeDate.slice(0, 7));
      }
    }

    function scheduleUpdate() {
      if (animationFrame !== null) {
        return;
      }

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = null;
        updateVisibleMonth();
      });
    }

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }

      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [month, onVisibleMonthChange]);

  const calendarProps = {
    dateClick: handleDateClick,
    dayMaxEventRows: 3,
    dayMaxEvents: true,
    eventContent: renderEventContent,
    eventClick: handleEventClick,
    events,
    firstDay: 1,
    fixedWeekCount: false,
    headerToolbar: false,
    height: "auto",
    initialDate: month,
    initialView: "dayGridContinuousRange",
    locales: [deLocale],
    locale: "de",
    longPressDelay: 180,
    moreLinkText: (count: number) => `+${count} weitere`,
    plugins: [dayGridPlugin, interactionPlugin],
    select: handleDateSelect,
    selectable: true,
    selectLongPressDelay: 180,
    selectMinDistance: 1,
    selectMirror: true,
    showNonCurrentDates: true,
    views: {
      dayGridContinuousRange: {
        type: "dayGrid",
        dateAlignment: "month",
        duration: { months: CALENDAR_VISIBLE_MONTHS },
      },
    },
  };

  return (
    <div
      className="claro-fullcalendar ticino-card ticino-pattern rounded-3xl border p-4"
      ref={calendarRef}
    >
      <FullCalendar {...(calendarProps as Record<string, unknown>)} />
    </div>
  );
}
