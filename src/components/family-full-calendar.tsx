"use client";

import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import deLocale from "@fullcalendar/core/locales/de";
import type { EventContentArg } from "@fullcalendar/core";
import type { DateClickArg, DateSelectArg } from "@fullcalendar/interaction";
import { addDays, format, subDays } from "date-fns";

import { withCalendarAlpha } from "@/lib/colors";
import type { Stay } from "@/lib/types";

type FamilyFullCalendarProps = {
  month: string;
  stays: Stay[];
  onCreateRange: (startDate: string, endDate: string) => void;
  onEditStay: (stayId: string) => void;
};

function renderEventContent(eventInfo: EventContentArg) {
  const participants = eventInfo.event.extendedProps.participants as string[];
  const participantAvatars = eventInfo.event.extendedProps.participantAvatars as string[];
  const participantSummary = participants.map((participant, index) => {
    const avatar = participantAvatars[index];
    return avatar ? `${avatar} ${participant}` : participant;
  });

  return (
    <div className="claro-event-content">
      <div className="claro-event-title">{eventInfo.event.title}</div>
      {participantSummary.length ? (
        <div className="claro-event-meta">{participantSummary.join(", ")}</div>
      ) : null}
    </div>
  );
}

export function FamilyFullCalendar({
  month,
  stays,
  onCreateRange,
  onEditStay,
}: FamilyFullCalendarProps) {
  const events = stays.map((stay) => {
    const eventColor = withCalendarAlpha(
      stay.participants[0]?.display_color ?? "#57534e",
    );

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
        participants: stay.participants.map((participant) => participant.full_name),
        participantAvatars: stay.participants.map(
          (participant) => participant.avatar_emoji,
        ),
        note: stay.note,
      },
    };
  });

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

  function handleEventClick(info: { event: { id: string } }) {
    onEditStay(info.event.id);
  }

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
    initialView: "dayGridMonth",
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
  };

  return (
    <div className="claro-fullcalendar ticino-card ticino-pattern rounded-3xl border p-4">
      <FullCalendar {...(calendarProps as Record<string, unknown>)} />
    </div>
  );
}
