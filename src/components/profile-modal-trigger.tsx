"use client";

import { useActionState, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { updateProfileModalAction } from "@/app/actions";
import { ProfileForm } from "@/components/profile-form";
import { TicinoAccent } from "@/components/ticino-accent";
import { withCalendarAlpha } from "@/lib/colors";
import {
  getProfilePresetValue,
  getProfilePresetById,
  profilePresets,
} from "@/lib/profile-options";
import type { Profile } from "@/lib/types";

type ProfileModalTriggerProps = {
  profile: Profile | null;
};

const initialProfileActionState = {
  status: "idle" as const,
  message: "",
};

type ProfileModalProps = {
  onClose: () => void;
  profile: Profile | null;
};

function ProfileModal({ onClose, profile }: ProfileModalProps) {
  const router = useRouter();
  const [previewPreset, setPreviewPreset] = useState(() =>
    getProfilePresetById(
      getProfilePresetValue(
        profile?.display_color ?? profilePresets[0].color,
        profile?.avatar_emoji ?? profilePresets[0].avatar,
      ),
    ),
  );
  const [state, formAction] = useActionState(
    updateProfileModalAction,
    initialProfileActionState,
  );

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    if (state.status === "success") {
      onClose();
      router.refresh();
    }
  }, [onClose, router, state.status]);

  return (
    <div
      className="fixed inset-0 z-[1000] grid place-items-center overflow-y-auto bg-stone-950/45 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="ticino-card w-full max-w-sm rounded-[2rem] border p-5 shadow-2xl sm:max-w-md sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <TicinoAccent size="sm" variant="chestnut" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7c3f24]">
                Familienprofil
              </span>
            </div>
            <h3 className="text-xl font-semibold">Profil bearbeiten</h3>
            <p className="mt-1 text-sm text-stone-600">
              Wähle ein kompaktes Farb-Emoji-Profil.
            </p>
          </div>

          <button
            aria-label="Profil-Modal schließen"
            className="rounded-full border border-stone-200 p-2 text-stone-600 transition hover:bg-stone-100"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
          <span
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-xl"
            style={{ backgroundColor: withCalendarAlpha(previewPreset.color) }}
          >
            {previewPreset.avatar}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-stone-900">
              {profile?.full_name ?? "Familienmitglied"}
            </p>
            <p className="text-xs text-stone-500">Vorschau</p>
          </div>
        </div>

        <ProfileForm
          action={formAction}
          compact={true}
          onPresetChange={setPreviewPreset}
          onCancel={onClose}
          profile={profile}
          statusMessage={state.status === "error" ? state.message : undefined}
        />
      </div>
    </div>
  );
}

export function ProfileModalTrigger({ profile }: ProfileModalTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const modal =
    isOpen && typeof document !== "undefined"
      ? createPortal(
          <ProfileModal onClose={() => setIsOpen(false)} profile={profile} />,
          document.body,
        )
      : null;

  return (
    <>
      <button
        className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        Profil
      </button>

      {modal}
    </>
  );
}
