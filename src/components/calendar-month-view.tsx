"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { addMonths, format, subMonths } from "date-fns";
import { de } from "date-fns/locale";

import {
  createStayModalAction,
  deleteStayModalAction,
  updateStayModalAction,
} from "@/app/actions";
import { formatMonthParam } from "@/lib/calendar";
import type { Profile, Stay } from "@/lib/types";
import { FamilyFullCalendar } from "@/components/family-full-calendar";
import { NewStayForm } from "@/components/new-stay-form";
import { TicinoAccent } from "@/components/ticino-accent";

type CalendarMonthViewProps = {
  month: string;
  stays: Stay[];
  profiles: Profile[];
  currentProfileId?: string;
  initialMessage?: string;
};

type EntryModalProps = {
  defaultSelectedProfileId?: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
  profiles: Profile[];
  selection: EntryModalSelection;
};

type EntryModalSelection =
  | {
      mode: "create";
      startDate: string;
      endDate: string;
    }
  | {
      mode: "edit";
      stay: Stay;
    };

const initialCreateStayActionState = {
  status: "idle" as const,
  message: "",
};

const monthOptions = Array.from({ length: 12 }, (_, monthIndex) => ({
  label: format(new Date(2024, monthIndex, 1), "MMMM", { locale: de }),
  value: monthIndex,
}));
const weekdayLabels = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

function EntryModal({
  defaultSelectedProfileId,
  onClose,
  onSuccess,
  profiles,
  selection,
}: EntryModalProps) {
  const [saveState, saveFormAction] = useActionState(
    selection.mode === "edit" ? updateStayModalAction : createStayModalAction,
    initialCreateStayActionState,
  );
  const [deleteState, deleteFormAction] = useActionState(
    deleteStayModalAction,
    initialCreateStayActionState,
  );
  const isEditing = selection.mode === "edit";
  const stay = isEditing ? selection.stay : null;

  useEffect(() => {
    if (saveState.status === "success") {
      onSuccess(saveState.message);
    }
  }, [onSuccess, saveState.message, saveState.status]);

  useEffect(() => {
    if (deleteState.status === "success") {
      onSuccess(deleteState.message);
    }
  }, [deleteState.message, deleteState.status, onSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 px-4 py-6">
      <div className="ticino-card max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[1.5rem] border p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <TicinoAccent size="sm" variant={isEditing ? "mountain" : "home"} />
            <h3 className="text-xl font-semibold">
              {isEditing ? "Aufenthalt bearbeiten" : "Neuen Aufenthalt anlegen"}
            </h3>
          </div>

          <button
            aria-label="Modal schließen"
            className="rounded-full border border-stone-200 p-2 text-stone-600 transition hover:bg-stone-100"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <NewStayForm
          action={saveFormAction}
          deleteAction={isEditing ? deleteFormAction : undefined}
          deleteStatusMessage={
            deleteState.status === "error" ? deleteState.message : undefined
          }
          defaultSelectedProfileId={isEditing ? undefined : defaultSelectedProfileId}
          initialEndDate={isEditing ? stay?.end_date : selection.endDate}
          initialGuestCount={stay?.guest_count}
          initialNote={stay?.note}
          initialRoomIds={stay?.room_ids}
          initialStartDate={isEditing ? stay?.start_date : selection.startDate}
          initialTitle={stay?.title}
          onCancel={onClose}
          profiles={profiles}
          selectedProfileIds={stay?.participants.map((profile) => profile.id)}
          stayId={stay?.id}
          statusMessage={
            saveState.status === "error" ? saveState.message : undefined
          }
          submitLabel="Speichern"
        />
      </div>
    </div>
  );
}

export function CalendarMonthView({
  month,
  stays,
  profiles,
  currentProfileId,
  initialMessage,
}: CalendarMonthViewProps) {
  const router = useRouter();
  const monthDate = new Date(`${month}T00:00:00`);
  const [activeMonthDate, setActiveMonthDate] = useState(monthDate);
  const previousMonth = formatMonthParam(subMonths(activeMonthDate, 1));
  const nextMonth = formatMonthParam(addMonths(activeMonthDate, 1));
  const currentMonth = formatMonthParam(new Date());
  const activeMonthTitle = format(activeMonthDate, "MMMM yyyy", { locale: de });
  const [modalRange, setModalRange] = useState<EntryModalSelection | null>(null);
  const [bannerMessage, setBannerMessage] = useState(initialMessage ?? "");
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const monthPickerRef = useRef<HTMLDivElement>(null);
  const yearOptions = Array.from({ length: 9 }, (_, index) => {
    const startYear = activeMonthDate.getFullYear() - 4;
    return startYear + index;
  });

  useEffect(() => {
    setActiveMonthDate(new Date(`${month}T00:00:00`));
  }, [month]);

  const handleVisibleMonthChange = useCallback((visibleMonth: string) => {
    setActiveMonthDate((currentDate) => {
      if (formatMonthParam(currentDate) === visibleMonth) {
        return currentDate;
      }

      return new Date(`${visibleMonth}-01T00:00:00`);
    });
  }, []);

  useEffect(() => {
    if (!isMonthPickerOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        monthPickerRef.current &&
        !monthPickerRef.current.contains(event.target as Node)
      ) {
        setIsMonthPickerOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isMonthPickerOpen]);

  function openCreateModal(startDate: string, endDate: string) {
    setModalRange({ mode: "create", startDate, endDate });
  }

  function openEditModal(stayId: string) {
    const stay = stays.find((item) => item.id === stayId);

    if (stay) {
      setModalRange({ mode: "edit", stay });
    }
  }

  function handleCreateSuccess(message: string) {
    const targetMonth =
      modalRange?.mode === "create"
        ? formatMonthParam(new Date(`${modalRange.startDate}T00:00:00`))
        : null;

    setBannerMessage(message);
    setModalRange(null);

    if (targetMonth && targetMonth !== formatMonthParam(monthDate)) {
      router.push(`/calendar?month=${targetMonth}`);
      return;
    }

    router.refresh();
  }

  function navigateToMonth(monthIndex: number, year: number) {
    router.push(`/calendar?month=${formatMonthParam(new Date(year, monthIndex, 1))}`);
    setIsMonthPickerOpen(false);
  }

  return (
    <section className="space-y-6">
      <div
        className="ticino-soft-card sticky top-3 z-30 rounded-3xl border p-4 shadow-lg backdrop-blur sm:p-5"
        data-calendar-sticky-header
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative" ref={monthPickerRef}>
                <button
                  aria-expanded={isMonthPickerOpen}
                  className="inline-flex items-center gap-2 rounded-full border border-amber-900/15 bg-white/70 px-3 py-2 text-sm font-medium text-stone-700 shadow-sm transition hover:border-amber-900/25 hover:bg-white hover:text-stone-900"
                  onClick={() => setIsMonthPickerOpen((isOpen) => !isOpen)}
                  type="button"
                >
                  <span className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                    {activeMonthTitle}
                  </span>
                  <ChevronDown className="h-4 w-4 text-stone-500" />
                </button>

                {isMonthPickerOpen ? (
                  <div className="absolute left-0 top-full z-20 mt-2 w-64 rounded-2xl border border-amber-900/15 bg-[#fffbf5] p-3 shadow-xl">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="space-y-1">
                        <span className="text-xs font-medium uppercase tracking-[0.12em] text-stone-500">
                          Monat
                        </span>
                        <select
                          className="w-full rounded-xl border border-amber-900/15 bg-white/80 px-3 py-2 text-sm outline-none focus:border-amber-900/30"
                          onChange={(event) =>
                            navigateToMonth(
                              Number(event.target.value),
                              activeMonthDate.getFullYear(),
                            )
                          }
                          value={activeMonthDate.getMonth()}
                        >
                          {monthOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="space-y-1">
                        <span className="text-xs font-medium uppercase tracking-[0.12em] text-stone-500">
                          Jahr
                        </span>
                        <select
                          className="w-full rounded-xl border border-amber-900/15 bg-white/80 px-3 py-2 text-sm outline-none focus:border-amber-900/30"
                          onChange={(event) =>
                            navigateToMonth(
                              activeMonthDate.getMonth(),
                              Number(event.target.value),
                            )
                          }
                          value={activeMonthDate.getFullYear()}
                        >
                          {yearOptions.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              className="inline-flex items-center rounded-full border border-amber-900/15 bg-white/70 px-4 py-2 text-sm font-medium hover:border-amber-900/25 hover:bg-white"
              href={`/calendar?month=${currentMonth}`}
            >
              Heute
            </Link>
            <Link
              aria-label="Vorheriger Monat"
              className="inline-flex items-center gap-2 rounded-full border border-amber-900/15 bg-white/70 px-4 py-2 text-sm font-medium hover:border-amber-900/25 hover:bg-white"
              href={`/calendar?month=${previousMonth}`}
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <Link
              aria-label="Nächster Monat"
              className="inline-flex items-center gap-2 rounded-full border border-amber-900/15 bg-white/70 px-4 py-2 text-sm font-medium hover:border-amber-900/25 hover:bg-white"
              href={`/calendar?month=${nextMonth}`}
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 border-t border-amber-900/10 pt-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-stone-500 sm:text-sm">
          {weekdayLabels.map((weekday) => (
            <span key={weekday}>{weekday}</span>
          ))}
        </div>
      </div>

      {bannerMessage ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {bannerMessage}
        </div>
      ) : null}

      <FamilyFullCalendar
        key={month}
        month={month}
        onCreateRange={openCreateModal}
        onEditStay={openEditModal}
        onVisibleMonthChange={handleVisibleMonthChange}
        stays={stays}
      />

      <div className="ticino-soft-card rounded-3xl border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7c3f24]">
            Familienlegende
          </h3>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {profiles.map((profile) => (
            <div
              className="inline-flex items-center gap-3 rounded-full border border-amber-900/10 bg-white/70 px-4 py-2 text-sm shadow-sm"
              key={profile.id}
            >
              <span className="text-lg" role="img" aria-label={profile.full_name}>
                {profile.avatar_emoji}
              </span>
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: profile.display_color }}
              />
              {profile.full_name}
            </div>
          ))}
        </div>
      </div>

      {modalRange ? (
        <EntryModal
          key={
            modalRange.mode === "edit"
              ? `edit-${modalRange.stay.id}`
              : `create-${modalRange.startDate}-${modalRange.endDate}`
          }
          defaultSelectedProfileId={currentProfileId}
          onClose={() => setModalRange(null)}
          onSuccess={handleCreateSuccess}
          profiles={profiles}
          selection={modalRange}
        />
      ) : null}
    </section>
  );
}
