"use client";

import { useState } from "react";

import { defaultAvatar } from "@/lib/avatar-options";
import {
  getProfilePresetById,
  getProfilePresetValue,
  profilePresets,
  type ProfilePresetId,
} from "@/lib/profile-options";
import type { Profile } from "@/lib/types";

type ProfileFormProps = {
  profile: Profile | null;
  action: (formData: FormData) => void | Promise<void>;
  compact?: boolean;
  onPresetChange?: (preset: (typeof profilePresets)[number]) => void;
  onCancel?: () => void;
  statusMessage?: string;
};

export function ProfileForm({
  profile,
  action,
  compact = false,
  onPresetChange,
  onCancel,
  statusMessage,
}: ProfileFormProps) {
  const initialPresetId = getProfilePresetValue(
    profile?.display_color ?? profilePresets[0].color,
    profile?.avatar_emoji ?? defaultAvatar,
  );
  const [selectedPresetId, setSelectedPresetId] = useState(initialPresetId);
  const selectedPreset = getProfilePresetById(selectedPresetId);

  function handlePresetChange(value: ProfilePresetId) {
    const nextPreset = getProfilePresetById(value);
    setSelectedPresetId(value);
    onPresetChange?.(nextPreset);
  }

  return (
    <form action={action} className={compact ? "space-y-4" : "space-y-6"}>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-stone-700">Anzeigename</span>
        <input
          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-stone-900"
          defaultValue={profile?.full_name ?? ""}
          name="full_name"
          placeholder="Dein Name"
          required
          type="text"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-stone-700">Profil-Preset</span>
        <select
          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-900"
          name="profile_preset"
          onChange={(event) =>
            handlePresetChange(event.target.value as ProfilePresetId)
          }
          value={selectedPresetId}
        >
          {profilePresets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
        </select>
      </label>

      <input name="display_color" type="hidden" value={selectedPreset.color} />
      <input name="avatar_emoji" type="hidden" value={selectedPreset.avatar} />

      {statusMessage ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {statusMessage}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {onCancel ? (
          <button
            className="rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-400"
            onClick={onCancel}
            type="button"
          >
            Schließen
          </button>
        ) : null}

        <button
          className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
          type="submit"
        >
          Profil speichern
        </button>
      </div>
    </form>
  );
}
