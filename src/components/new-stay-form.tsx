"use client";

import { createStayAction } from "@/app/actions";
import type { Profile } from "@/lib/types";

type NewStayFormProps = {
  profiles: Profile[];
  action?: (formData: FormData) => void | Promise<void>;
  deleteAction?: (formData: FormData) => void | Promise<void>;
  stayId?: string;
  initialTitle?: string;
  initialNote?: string | null;
  initialStartDate?: string;
  initialEndDate?: string;
  defaultSelectedProfileId?: string;
  selectedProfileIds?: string[];
  onCancel?: () => void;
  submitLabel?: string;
  statusMessage?: string;
  deleteStatusMessage?: string;
};

export function NewStayForm({
  profiles,
  action = createStayAction,
  deleteAction,
  stayId,
  initialTitle,
  initialNote,
  initialStartDate,
  initialEndDate,
  defaultSelectedProfileId,
  selectedProfileIds,
  onCancel,
  submitLabel = "Speichern",
  statusMessage,
  deleteStatusMessage,
}: NewStayFormProps) {
  const selectedProfiles = new Set(
    selectedProfileIds ?? (defaultSelectedProfileId ? [defaultSelectedProfileId] : []),
  );

  return (
    <form action={action} className="space-y-4">
      {stayId ? <input name="stay_id" type="hidden" value={stayId} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-stone-700">Titel</span>
          <input
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-2.5 outline-none ring-0 transition placeholder:text-stone-400 focus:border-stone-900"
            defaultValue={initialTitle}
            name="title"
            placeholder="z.B. Wochenende in Claro"
            required
            type="text"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-stone-700">Notiz</span>
          <input
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-2.5 outline-none ring-0 transition placeholder:text-stone-400 focus:border-stone-900"
            defaultValue={initialNote ?? ""}
            name="note"
            placeholder="z.B. Anreise Freitagabend"
            type="text"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-stone-700">Startdatum</span>
          <input
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-2.5 outline-none ring-0 transition focus:border-stone-900"
            defaultValue={initialStartDate}
            name="start_date"
            required
            type="date"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-stone-700">Enddatum</span>
          <input
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-2.5 outline-none ring-0 transition focus:border-stone-900"
            defaultValue={initialEndDate}
            name="end_date"
            required
            type="date"
          />
        </label>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-stone-700">
          Wer ist in Claro?
        </legend>
        <div className="grid gap-2 md:grid-cols-2">
          {profiles.map((profile) => (
            <label
              className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-2.5"
              key={profile.id}
            >
              <input
                className="h-4 w-4 accent-stone-900"
                defaultChecked={selectedProfiles.has(profile.id)}
                name="participant_ids"
                type="checkbox"
                value={profile.id}
              />
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: profile.display_color }}
              />
              <span className="font-medium text-stone-800">{profile.full_name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {statusMessage ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {statusMessage}
        </div>
      ) : null}

      {deleteStatusMessage ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {deleteStatusMessage}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {onCancel ? (
          <button
            className="rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-400"
            onClick={onCancel}
            type="button"
          >
            Abbrechen
          </button>
        ) : null}

        <button
          className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700"
          type="submit"
        >
          {submitLabel}
        </button>

        {deleteAction ? (
          <button
            className="rounded-full border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100"
            formAction={deleteAction}
            onClick={(event) => {
              if (!window.confirm("Diesen Aufenthalt wirklich löschen?")) {
                event.preventDefault();
              }
            }}
            type="submit"
          >
            Löschen
          </button>
        ) : null}
      </div>
    </form>
  );
}
